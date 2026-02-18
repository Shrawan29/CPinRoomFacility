import mongoose from "mongoose";
import ServiceRequest from "../models/ServiceRequest.js";
import HotelInfo from "../models/HotelInfo.js";

const resolveHotelId = async () => {
  let hotel = await HotelInfo.findOne().select("_id");
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

    const created = await ServiceRequest.create({
      hotelId,
      roomNumber,
      guestId,
      items,
      note,
      status: "pending",
    });

    return res.status(201).json({
      message: "Housekeeping request created",
      request: created,
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
      baseQuery.status = { $in: ["pending", "accepted"] };
    } else if (status) {
      baseQuery.status = status;
    }

    // Admin view: all hotel requests
    if (req.admin) {
      const allowed = new Set(["SUPER_ADMIN", "HOUSEKEEPING_ADMIN"]);
      if (!allowed.has(req.admin.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const requests = await ServiceRequest.find(baseQuery)
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
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request id" });
    }

    const hotelId = await resolveHotelId();

    const updated = await ServiceRequest.findOneAndUpdate(
      { _id: id, hotelId, status: "pending" },
      { $set: { status: "accepted" } },
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

    return res.json({
      message: "Request accepted",
      request: updated,
    });
  } catch (error) {
    console.error("Accept housekeeping request error:", error);
    return res.status(error.statusCode || 500).json({
      message: "Failed to accept request",
      error: error.message,
    });
  }
};

export const completeHousekeepingRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request id" });
    }

    const hotelId = await resolveHotelId();

    const updated = await ServiceRequest.findOneAndUpdate(
      { _id: id, hotelId, status: "accepted" },
      { $set: { status: "completed" } },
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
        message: "Only accepted requests can be completed",
        currentStatus: existing.status,
      });
    }

    return res.json({
      message: "Request completed",
      request: updated,
    });
  } catch (error) {
    console.error("Complete housekeeping request error:", error);
    return res.status(error.statusCode || 500).json({
      message: "Failed to complete request",
      error: error.message,
    });
  }
};
