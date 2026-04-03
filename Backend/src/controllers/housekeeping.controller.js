import mongoose from "mongoose";
import ServiceRequest from "../models/ServiceRequest.js";
import HotelInfo from "../models/HotelInfo.js";
import Admin from "../models/Admin.js";
import {
  getSupervisorPhoneForRoom,
  parseFloorFromRoomNumber,
} from "../services/housekeepingVoiceAlert.service.js";
import {
  clearHousekeepingEscalationTimers,
  scheduleHousekeepingEscalation,
} from "../services/housekeepingEscalationScheduler.service.js";

const HOUSEKEEPING_ADMIN_ROLES = new Set([
  "SUPER_ADMIN",
  "HOUSEKEEPING_ADMIN",
  "HOUSEKEEPING_SUPERVISOR",
]);

const HOUSEKEEPING_TEAM_ROLES = [
  "HOUSEKEEPING_ADMIN",
  "HOUSEKEEPING_SUPERVISOR",
  "HOUSEKEEPING_STAFF",
];

const DEFAULT_FIRST_CALL_DELAY_MS = 75_000;
const DEFAULT_ESCALATION_DELAY_MS = 180_000;

const toPositiveInt = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
};

const toComparablePhone = (value) => String(value ?? "").replace(/[^\d+]/g, "");

const HOUSEKEEPING_REQUEST_POPULATE = [
  { path: "assignedSupervisorId", select: "name email phone role" },
  { path: "assignedStaffId", select: "name email phone role" },
  { path: "assignedByAdminId", select: "name email phone role" },
  { path: "acceptedByAdminId", select: "name email phone role" },
  { path: "completedByAdminId", select: "name email phone role" },
];

const resolveHotelId = async () => {
  let hotel = await HotelInfo.findOne().sort({ updatedAt: -1, createdAt: -1 }).select("_id");
  if (!hotel) {
    const name = String(process.env.HOTEL_NAME || "Hotel").trim() || "Hotel";
    hotel = await HotelInfo.create({
      basicInfo: {
        name,
      },
    });
  }
  return hotel._id;
};

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const resolveAssignedSupervisorId = async (roomNumber) => {
  const supervisorPhone = getSupervisorPhoneForRoom(roomNumber);
  const comparablePhone = toComparablePhone(supervisorPhone);
  if (!comparablePhone) return null;

  const allSupervisors = await Admin.find({
    role: "HOUSEKEEPING_SUPERVISOR",
    isActive: true,
  })
    .select("_id phone")
    .lean();

  const exact = allSupervisors.find((item) => toComparablePhone(item.phone) === comparablePhone);
  return exact?._id || null;
};

const parseAdminAssignmentInput = (value, fieldName) => {
  if (value === undefined) {
    return { hasValue: false };
  }

  if (value === null || String(value).trim() === "") {
    return { hasValue: true, objectId: null };
  }

  if (!mongoose.Types.ObjectId.isValid(value)) {
    const error = new Error(`${fieldName} must be a valid id`);
    error.statusCode = 400;
    throw error;
  }

  return {
    hasValue: true,
    objectId: new mongoose.Types.ObjectId(value),
  };
};

const verifyAdminRole = async (adminId, allowedRoles, fieldName) => {
  if (!adminId) return null;

  const admin = await Admin.findOne({
    _id: adminId,
    isActive: true,
    role: { $in: allowedRoles },
  })
    .select("_id name email phone role")
    .lean();

  if (!admin) {
    const error = new Error(`${fieldName} does not reference an active ${allowedRoles.join("/")}`);
    error.statusCode = 400;
    throw error;
  }

  return admin;
};

export const createHousekeepingRequest = async (req, res) => {
  try {
    if (!req.guest?.roomNumber || !req.guest?.id) {
      return res.status(401).json({ message: "Guest session missing" });
    }

    const hotelId = await resolveHotelId();
    const roomNumber = String(req.guest.roomNumber).trim();
    const guestId = req.guest.id;
    const items = req.body.items;
    const note = req.body.note || "";

    const todayStart = startOfDay(new Date());
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const requestedNames = items.map((i) => i.name);
    const existingTotals = await ServiceRequest.aggregate([
      {
        $match: {
          hotelId: new mongoose.Types.ObjectId(hotelId),
          roomNumber,
          createdAt: { $gte: todayStart, $lt: tomorrowStart },
        },
      },
      { $unwind: "$items" },
      { $match: { "items.name": { $in: requestedNames } } },
      {
        $group: {
          _id: "$items.name",
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
    ]);

    const totalsByName = new Map(existingTotals.map((r) => [r._id, r.totalQuantity]));
    const limitViolations = [];
    for (const item of items) {
      const already = totalsByName.get(item.name) || 0;
      const nextTotal = already + item.quantity;
      if (nextTotal > 5) {
        limitViolations.push({
          name: item.name,
          alreadyRequestedToday: already,
          requestedNow: item.quantity,
          limit: 5,
        });
      }
    }

    if (limitViolations.length > 0) {
      return res.status(400).json({
        message: "Daily item limit exceeded (max 5 per item per day per room)",
        violations: limitViolations,
      });
    }

    const notifiedAt = new Date();
    const roomFloor = parseFloorFromRoomNumber(roomNumber);
    const assignedSupervisorId = await resolveAssignedSupervisorId(roomNumber);

    const created = await ServiceRequest.create({
      hotelId,
      roomNumber,
      guestId,
      items,
      note,
      status: "pending",
      roomFloor,
      assignedSupervisorId,
      notifiedAt,
      callAttemptCount: 0,
    });

    // App notification is immediate via dashboard polling, and voice calls are scheduled fallback.
    scheduleHousekeepingEscalation(created.toObject());

    const firstCallDelayMs = toPositiveInt(
      process.env.HOUSEKEEPING_CALL_DELAY_MS,
      DEFAULT_FIRST_CALL_DELAY_MS
    );
    const escalationDelayMs = toPositiveInt(
      process.env.HOUSEKEEPING_ESCALATION_DELAY_MS,
      DEFAULT_ESCALATION_DELAY_MS
    );

    const enriched = await ServiceRequest.findById(created._id)
      .populate(HOUSEKEEPING_REQUEST_POPULATE)
      .lean();

    return res.status(201).json({
      message: "Housekeeping request created",
      request: enriched,
      notificationSequence: {
        notifiedAt,
        firstCallAt: new Date(notifiedAt.getTime() + firstCallDelayMs),
        escalatesAt: new Date(notifiedAt.getTime() + escalationDelayMs),
      },
    });
  } catch (error) {
    console.error("Create housekeeping request error:", error);
    return res.status(error.statusCode || 500).json({
      message: "Failed to create housekeeping request",
      error: error.message,
    });
  }
};

export const listHousekeepingRequests = async (req, res) => {
  try {
    const hotelId = await resolveHotelId();
    const status = req.query.status ? String(req.query.status) : undefined;

    const baseQuery = { hotelId };
    if (status === "active") {
      baseQuery.status = { $in: ["pending", "accepted", "in_progress"] };
    } else if (status) {
      baseQuery.status = status;
    }

    // Admin view: all hotel requests
    if (req.admin) {
      const allowed = new Set([
        "SUPER_ADMIN",
        "HOUSEKEEPING_ADMIN",
        "HOUSEKEEPING_SUPERVISOR",
        "HOUSEKEEPING_STAFF",
      ]);
      if (!allowed.has(req.admin.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (req.admin.role === "HOUSEKEEPING_SUPERVISOR") {
        baseQuery.$or = [
          { assignedSupervisorId: req.admin.id },
          { assignedSupervisorId: { $exists: false } },
          { assignedSupervisorId: null },
        ];
      }

      if (req.admin.role === "HOUSEKEEPING_STAFF") {
        baseQuery.assignedStaffId = req.admin.id;
      }

      const requests = await ServiceRequest.find(baseQuery)
        .populate(HOUSEKEEPING_REQUEST_POPULATE)
        .sort({ createdAt: -1 })
        .lean();

      return res.json({
        message: "Housekeeping requests fetched",
        count: requests.length,
        requests,
      });
    }

    // Guest view: only their room's requests
    if (!req.guest?.roomNumber || !req.guest?.id) {
      return res.status(401).json({ message: "Guest session missing" });
    }

    const roomNumber = String(req.guest.roomNumber).trim();
    const requests = await ServiceRequest.find({
      ...baseQuery,
      roomNumber,
      guestId: req.guest.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      message: "Housekeeping requests fetched",
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("List housekeeping requests error:", error);
    return res.status(error.statusCode || 500).json({
      message: "Failed to fetch housekeeping requests",
      error: error.message,
    });
  }
};

export const acceptHousekeepingRequest = async (req, res) => {
  try {
    if (!HOUSEKEEPING_ADMIN_ROLES.has(req.admin?.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request id" });
    }

    const hotelId = await resolveHotelId();

    const query = { _id: id, hotelId, status: "pending" };
    if (req.admin.role === "HOUSEKEEPING_SUPERVISOR") {
      query.$or = [
        { assignedSupervisorId: req.admin.id },
        { assignedSupervisorId: { $exists: false } },
        { assignedSupervisorId: null },
      ];
    }

    const setUpdates = {
      status: "accepted",
      acceptedAt: new Date(),
      acceptedByAdminId: req.admin.id,
    };

    if (req.admin.role === "HOUSEKEEPING_SUPERVISOR") {
      setUpdates.assignedSupervisorId = req.admin.id;
    }

    const updated = await ServiceRequest.findOneAndUpdate(
      query,
      { $set: setUpdates, $unset: { expiresAt: 1 } },
      { new: true }
    );

    if (!updated) {
      const existing = await ServiceRequest.findOne({ _id: id, hotelId }).select(
        "status"
      );
      if (!existing) {
        return res.status(404).json({ message: "Request not found" });
      }
      return res.status(409).json({
        message: "Only pending requests can be accepted",
        currentStatus: existing.status,
      });
    }

    clearHousekeepingEscalationTimers(id);

    const populated = await ServiceRequest.findById(updated._id)
      .populate(HOUSEKEEPING_REQUEST_POPULATE)
      .lean();

    return res.json({
      message: "Request accepted",
      request: populated,
    });
  } catch (error) {
    console.error("Accept housekeeping request error:", error);
    return res.status(error.statusCode || 500).json({
      message: "Failed to accept request",
      error: error.message,
    });
  }
};

export const assignHousekeepingRequest = async (req, res) => {
  try {
    if (!HOUSEKEEPING_ADMIN_ROLES.has(req.admin?.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request id" });
    }

    const hotelId = await resolveHotelId();
    const assignedStaffInput = parseAdminAssignmentInput(req.body?.assignedStaffId, "assignedStaffId");
    const assignedSupervisorInput = parseAdminAssignmentInput(
      req.body?.assignedSupervisorId,
      "assignedSupervisorId"
    );

    if (!assignedStaffInput.hasValue && !assignedSupervisorInput.hasValue) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    if (assignedStaffInput.hasValue && assignedStaffInput.objectId) {
      await verifyAdminRole(assignedStaffInput.objectId, ["HOUSEKEEPING_STAFF"], "assignedStaffId");
    }

    if (assignedSupervisorInput.hasValue && assignedSupervisorInput.objectId) {
      await verifyAdminRole(
        assignedSupervisorInput.objectId,
        ["HOUSEKEEPING_SUPERVISOR", "HOUSEKEEPING_ADMIN"],
        "assignedSupervisorId"
      );
    }

    const setUpdates = {
      assignedByAdminId: req.admin.id,
      assignedAt: new Date(),
    };

    if (assignedStaffInput.hasValue) {
      setUpdates.assignedStaffId = assignedStaffInput.objectId;
    }

    if (assignedSupervisorInput.hasValue) {
      setUpdates.assignedSupervisorId = assignedSupervisorInput.objectId;
    } else if (req.admin.role === "HOUSEKEEPING_SUPERVISOR") {
      setUpdates.assignedSupervisorId = req.admin.id;
    }

    const updated = await ServiceRequest.findOneAndUpdate(
      { _id: id, hotelId, status: { $in: ["pending", "accepted", "in_progress"] } },
      { $set: setUpdates },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Request not found or cannot be assigned" });
    }

    const populated = await ServiceRequest.findById(updated._id)
      .populate(HOUSEKEEPING_REQUEST_POPULATE)
      .lean();

    return res.json({
      message: "Request assignment updated",
      request: populated,
    });
  } catch (error) {
    console.error("Assign housekeeping request error:", error);
    return res.status(error.statusCode || 500).json({
      message: "Failed to assign request",
      error: error.message,
    });
  }
};

export const markHousekeepingRequestInProgress = async (req, res) => {
  try {
    if (!req.admin?.role) {
      return res.status(403).json({ message: "Access denied" });
    }

    const allowedRoles = new Set([
      "SUPER_ADMIN",
      "HOUSEKEEPING_ADMIN",
      "HOUSEKEEPING_SUPERVISOR",
      "HOUSEKEEPING_STAFF",
    ]);
    if (!allowedRoles.has(req.admin.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request id" });
    }

    const hotelId = await resolveHotelId();
    const query = { _id: id, hotelId, status: "accepted" };

    if (req.admin.role === "HOUSEKEEPING_SUPERVISOR") {
      query.assignedSupervisorId = req.admin.id;
    }
    if (req.admin.role === "HOUSEKEEPING_STAFF") {
      query.assignedStaffId = req.admin.id;
    }

    const updated = await ServiceRequest.findOneAndUpdate(
      query,
      { $set: { status: "in_progress", inProgressAt: new Date() } },
      { new: true }
    );

    if (!updated) {
      return res.status(409).json({
        message: "Only accepted requests can be moved to in-progress",
      });
    }

    const populated = await ServiceRequest.findById(updated._id)
      .populate(HOUSEKEEPING_REQUEST_POPULATE)
      .lean();

    return res.json({
      message: "Request marked in progress",
      request: populated,
    });
  } catch (error) {
    console.error("In-progress housekeeping request error:", error);
    return res.status(error.statusCode || 500).json({
      message: "Failed to update request",
      error: error.message,
    });
  }
};

export const completeHousekeepingRequest = async (req, res) => {
  try {
    if (!req.admin?.role) {
      return res.status(403).json({ message: "Access denied" });
    }

    const allowedRoles = new Set([
      "SUPER_ADMIN",
      "HOUSEKEEPING_ADMIN",
      "HOUSEKEEPING_SUPERVISOR",
      "HOUSEKEEPING_STAFF",
    ]);
    if (!allowedRoles.has(req.admin.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request id" });
    }

    const hotelId = await resolveHotelId();

    const query = {
      _id: id,
      hotelId,
      status: { $in: ["accepted", "in_progress"] },
    };

    if (req.admin.role === "HOUSEKEEPING_SUPERVISOR") {
      query.assignedSupervisorId = req.admin.id;
    }
    if (req.admin.role === "HOUSEKEEPING_STAFF") {
      query.assignedStaffId = req.admin.id;
    }

    const updated = await ServiceRequest.findOneAndUpdate(
      query,
      {
        $set: {
          status: "completed",
          completedAt: new Date(),
          completedByAdminId: req.admin.id,
        },
        $unset: { expiresAt: 1 },
      },
      { new: true }
    );

    if (!updated) {
      const existing = await ServiceRequest.findOne({ _id: id, hotelId }).select(
        "status"
      );
      if (!existing) {
        return res.status(404).json({ message: "Request not found" });
      }
      return res.status(409).json({
        message: "Only accepted or in-progress requests can be completed",
        currentStatus: existing.status,
      });
    }

    clearHousekeepingEscalationTimers(id);

    const populated = await ServiceRequest.findById(updated._id)
      .populate(HOUSEKEEPING_REQUEST_POPULATE)
      .lean();

    return res.json({
      message: "Request completed",
      request: populated,
    });
  } catch (error) {
    console.error("Complete housekeeping request error:", error);
    return res.status(error.statusCode || 500).json({
      message: "Failed to complete request",
      error: error.message,
    });
  }
};

export const getHousekeepingTeam = async (req, res) => {
  try {
    const allowed = new Set([
      "SUPER_ADMIN",
      "HOUSEKEEPING_ADMIN",
      "HOUSEKEEPING_SUPERVISOR",
      "HOUSEKEEPING_STAFF",
    ]);

    if (!allowed.has(req.admin?.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const team = await Admin.find({
      isActive: true,
      role: { $in: HOUSEKEEPING_TEAM_ROLES },
    })
      .select("_id name email phone role")
      .sort({ role: 1, name: 1 })
      .lean();

    return res.json({
      message: "Housekeeping team fetched",
      team,
    });
  } catch (error) {
    console.error("Get housekeeping team error:", error);
    return res.status(error.statusCode || 500).json({
      message: "Failed to fetch housekeeping team",
      error: error.message,
    });
  }
};
