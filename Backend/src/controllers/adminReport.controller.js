import GuestSession from "../models/GuestSession.js";
import Order from "../models/Order.js";
import Room from "../models/Room.js";
import Complaint from "../models/Complaint.js";
import ServiceRequest from "../models/ServiceRequest.js";
import Event from "../models/Event.js";
import MenuItem from "../models/MenuItem.js";
import QRToken from "../models/QRToken.js";
import Admin from "../models/Admin.js";
import HotelInfo from "../models/HotelInfo.js";
import GuestCredential from "../models/GuestCredential.js";
import dataSyncService from "../services/dataSync.service.js";

const DEFAULT_GUEST_SESSION_TTL_HOURS = 8;

const getGuestSessionTtlMs = () => {
  const hours = Number(process.env.GUEST_SESSION_HOURS || DEFAULT_GUEST_SESSION_TTL_HOURS);
  const ttlHours = Number.isFinite(hours) && hours > 0 ? hours : DEFAULT_GUEST_SESSION_TTL_HOURS;
  return ttlHours * 60 * 60 * 1000;
};

const getLocalDayRange = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const daysAgoStart = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - Number(daysAgo));
  d.setHours(0, 0, 0, 0);
  return d;
};

const safeMoney = (value) => {
  if (value == null) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

/**
 * ADMIN / SUPER_ADMIN → Daily Report
 */
export const getDailyReport = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const [
      newGuestSessions,
      totalOrders,
      occupiedRooms
    ] = await Promise.all([
      GuestSession.countDocuments({
        createdAt: { $gte: start, $lte: end }
      }),
      Order.countDocuments({
        createdAt: { $gte: start, $lte: end }
      }),
      Room.countDocuments({ status: "OCCUPIED" })
    ]);

    res.json({
      date: start.toDateString(),
      newGuestSessions,
      totalOrders,
      occupiedRooms
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load daily report" });
  }
};

/**
 * ADMIN / SUPER_ADMIN → Monthly Report
 */
export const getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query; // month: 1–12

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const [
      monthlyGuestSessions,
      monthlyOrders
    ] = await Promise.all([
      GuestSession.countDocuments({
        createdAt: { $gte: start, $lte: end }
      }),
      Order.countDocuments({
        createdAt: { $gte: start, $lte: end }
      })
    ]);

    res.json({
      month,
      year,
      monthlyGuestSessions,
      monthlyOrders
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load monthly report" });
  }
};

/**
 * ADMIN / SUPER_ADMIN → Full App Insights Report
 *
 * This is intended for the Reports page and returns a broad, app-wide snapshot
 * with multiple time windows (today / last 7 days / last 30 days / all-time).
 */
export const getInsightsReport = async (req, res) => {
  try {
    const now = new Date();
    const { start: todayStart, end: todayEnd } = getLocalDayRange(now);
    const last7Start = daysAgoStart(6);
    const last30Start = daysAgoStart(29);

    const ttlMs = getGuestSessionTtlMs();
    const cutoffLegacy = new Date(now.getTime() - ttlMs);

    const activeAppSessionFilter = {
      source: "APP",
      createdAt: { $lte: now },
      expiresAt: { $gt: now },
      $and: [
        {
          $or: [
            { endedAt: { $exists: false } },
            { endedAt: null },
            { endedAt: { $gt: now } },
          ],
        },
        {
          $or: [
            { authExpiresAt: { $gt: now } },
            { authExpiresAt: { $exists: false }, createdAt: { $gte: cutoffLegacy } },
          ],
        },
      ],
    };

    const activeHotelSessionFilter = {
      source: "HOTEL_SYNC",
      expiresAt: { $gt: now },
    };

    const [
      totalRooms,
      availableRooms,
      occupiedRooms,
      activeAppSessions,
      activeHotelSessions,
      sessionsToday,
      sessionsLast7,
      sessionsLast30,
      sessionsAll,
      activeGuestCredentials,
      activeGuestCredentialsBySource,
      ordersTodayAgg,
      ordersLast7Agg,
      ordersLast30Agg,
      ordersAllAgg,
      ordersByStatus,
      topOrderItemsLast30,
      topOrderRoomsLast30,
      serviceToday,
      serviceByStatus,
      topServiceItemsLast30,
      complaintsToday,
      complaintsLast7,
      complaintsLast30,
      complaintsAll,
      topComplaintCategoriesLast30,
      topComplaintTypesLast30,
      topComplaintRoomsLast30,
      eventsByStatus,
      nextUpcomingEvent,
      menuCounts,
      menuCategories,
      qrCounts,
      adminCounts,
      adminByRole,
      lastAdminLogin,
      hotelInfo,
    ] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments({ status: "AVAILABLE" }),
      Room.countDocuments({ status: "OCCUPIED" }),

      GuestSession.countDocuments(activeAppSessionFilter),
      GuestSession.countDocuments(activeHotelSessionFilter),

      GuestSession.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
      GuestSession.countDocuments({ createdAt: { $gte: last7Start, $lte: now } }),
      GuestSession.countDocuments({ createdAt: { $gte: last30Start, $lte: now } }),
      GuestSession.countDocuments({}),

      GuestCredential.countDocuments({ status: "ACTIVE" }),
      GuestCredential.aggregate([
        { $match: { status: "ACTIVE" } },
        { $group: { _id: "$source", count: { $sum: 1 } } },
      ]),

      Order.aggregate([
        { $match: { createdAt: { $gte: todayStart, $lte: todayEnd } } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
            avgOrderValue: { $avg: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: last7Start, $lte: now } } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
            avgOrderValue: { $avg: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: last30Start, $lte: now } } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
            avgOrderValue: { $avg: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
            avgOrderValue: { $avg: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: last30Start, $lte: now } } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.name",
            qty: { $sum: "$items.qty" },
            revenue: {
              $sum: {
                $multiply: [
                  { $ifNull: ["$items.qty", 0] },
                  { $ifNull: ["$items.price", 0] },
                ],
              },
            },
          },
        },
        { $sort: { qty: -1, revenue: -1 } },
        { $limit: 8 },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: last30Start, $lte: now } } },
        {
          $group: {
            _id: "$roomNumber",
            count: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
          },
        },
        { $sort: { count: -1, revenue: -1 } },
        { $limit: 8 },
      ]),

      ServiceRequest.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
      ServiceRequest.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      ServiceRequest.aggregate([
        { $match: { createdAt: { $gte: last30Start, $lte: now } } },
        { $unwind: "$items" },
        { $group: { _id: "$items.name", quantity: { $sum: "$items.quantity" } } },
        { $sort: { quantity: -1 } },
        { $limit: 8 },
      ]),

      Complaint.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
      Complaint.countDocuments({ createdAt: { $gte: last7Start, $lte: now } }),
      Complaint.countDocuments({ createdAt: { $gte: last30Start, $lte: now } }),
      Complaint.countDocuments({}),
      Complaint.aggregate([
        { $match: { createdAt: { $gte: last30Start, $lte: now } } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      Complaint.aggregate([
        { $match: { createdAt: { $gte: last30Start, $lte: now } } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      Complaint.aggregate([
        { $match: { createdAt: { $gte: last30Start, $lte: now } } },
        { $group: { _id: "$roomNumber", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),

      Event.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Event.findOne({ status: { $in: ["UPCOMING", "ACTIVE"] }, eventDate: { $gte: now } })
        .sort({ eventDate: 1 })
        .select("title eventDate eventTime location status")
        .lean(),

      MenuItem.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            available: { $sum: { $cond: [{ $eq: ["$isAvailable", true] }, 1, 0] } },
            veg: { $sum: { $cond: [{ $eq: ["$isVeg", true] }, 1, 0] } },
            avgPrice: { $avg: "$price" },
          },
        },
      ]),
      MenuItem.distinct("category"),

      QRToken.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            used: { $sum: { $cond: [{ $eq: ["$used", true] }, 1, 0] } },
          },
        },
      ]),

      Admin.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] } },
          },
        },
      ]),
      Admin.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$role", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Admin.findOne({ lastLoginAt: { $exists: true, $ne: null } })
        .sort({ lastLoginAt: -1 })
        .select("name email role lastLoginAt")
        .lean(),

      HotelInfo.findOne().sort({ updatedAt: -1, createdAt: -1 }).select("updatedAt createdAt basicInfo.name").lean(),
    ]);

    const normalizeAgg = (aggArr) => {
      const row = Array.isArray(aggArr) && aggArr.length > 0 ? aggArr[0] : null;
      return {
        count: row?.count ?? 0,
        revenue: safeMoney(row?.revenue ?? 0),
        avgOrderValue: safeMoney(row?.avgOrderValue ?? 0),
      };
    };

    const byStatusToObject = (rows, knownStatuses = []) => {
      const out = {};
      for (const s of knownStatuses) out[s] = 0;
      (Array.isArray(rows) ? rows : []).forEach((r) => {
        if (r?._id) out[String(r._id)] = Number(r.count) || 0;
      });
      return out;
    };

    const menuRow = Array.isArray(menuCounts) && menuCounts.length > 0 ? menuCounts[0] : null;
    const qrRow = Array.isArray(qrCounts) && qrCounts.length > 0 ? qrCounts[0] : null;
    const adminRow = Array.isArray(adminCounts) && adminCounts.length > 0 ? adminCounts[0] : null;

    const validUnusedQrTokens = await QRToken.countDocuments({ used: false, expiresAt: { $gt: now } });

    const occupancyRate = totalRooms > 0 ? occupiedRooms / totalRooms : 0;

    const dataSyncStatus = dataSyncService?.getStatus ? dataSyncService.getStatus() : { isSyncing: false, lastRun: null };

    res.json({
      generatedAt: now,
      windows: {
        todayStart,
        todayEnd,
        last7Start,
        last30Start,
      },
      rooms: {
        total: totalRooms,
        available: availableRooms,
        occupied: occupiedRooms,
        occupancyRate,
      },
      guests: {
        activeSessionsNow: {
          app: activeAppSessions,
          hotelSync: activeHotelSessions,
          total: activeAppSessions + activeHotelSessions,
        },
        sessionsCreated: {
          today: sessionsToday,
          last7Days: sessionsLast7,
          last30Days: sessionsLast30,
          allTime: sessionsAll,
        },
        activeGuestCredentials: {
          total: activeGuestCredentials,
          bySource: byStatusToObject(activeGuestCredentialsBySource),
        },
      },
      orders: {
        today: normalizeAgg(ordersTodayAgg),
        last7Days: normalizeAgg(ordersLast7Agg),
        last30Days: normalizeAgg(ordersLast30Agg),
        allTime: normalizeAgg(ordersAllAgg),
        byStatus: byStatusToObject(ordersByStatus, ["PLACED", "PREPARING", "READY", "DELIVERED"]),
        topItemsLast30Days: (Array.isArray(topOrderItemsLast30) ? topOrderItemsLast30 : []).map((r) => ({
          name: r?._id || "(unknown)",
          qty: Number(r?.qty) || 0,
          revenue: safeMoney(r?.revenue || 0),
        })),
        topRoomsLast30Days: (Array.isArray(topOrderRoomsLast30) ? topOrderRoomsLast30 : []).map((r) => ({
          roomNumber: r?._id || "(unknown)",
          count: Number(r?.count) || 0,
          revenue: safeMoney(r?.revenue || 0),
        })),
      },
      housekeeping: {
        requestsToday: serviceToday,
        byStatus: byStatusToObject(serviceByStatus, ["pending", "accepted", "completed"]),
        topItemsLast30Days: (Array.isArray(topServiceItemsLast30) ? topServiceItemsLast30 : []).map((r) => ({
          name: r?._id || "(unknown)",
          quantity: Number(r?.quantity) || 0,
        })),
      },
      complaints: {
        counts: {
          today: complaintsToday,
          last7Days: complaintsLast7,
          last30Days: complaintsLast30,
          allTime: complaintsAll,
        },
        topCategoriesLast30Days: (Array.isArray(topComplaintCategoriesLast30) ? topComplaintCategoriesLast30 : []).map((r) => ({
          category: r?._id || "(unknown)",
          count: Number(r?.count) || 0,
        })),
        topTypesLast30Days: (Array.isArray(topComplaintTypesLast30) ? topComplaintTypesLast30 : []).map((r) => ({
          type: r?._id || "(unknown)",
          count: Number(r?.count) || 0,
        })),
        topRoomsLast30Days: (Array.isArray(topComplaintRoomsLast30) ? topComplaintRoomsLast30 : []).map((r) => ({
          roomNumber: r?._id || "(unknown)",
          count: Number(r?.count) || 0,
        })),
      },
      events: {
        byStatus: byStatusToObject(eventsByStatus, ["UPCOMING", "ACTIVE", "COMPLETED"]),
        next: nextUpcomingEvent
          ? {
              title: nextUpcomingEvent.title,
              eventDate: nextUpcomingEvent.eventDate,
              eventTime: nextUpcomingEvent.eventTime || "",
              location: nextUpcomingEvent.location || "",
              status: nextUpcomingEvent.status,
            }
          : null,
      },
      menu: {
        total: Number(menuRow?.total) || 0,
        available: Number(menuRow?.available) || 0,
        unavailable: Math.max(0, (Number(menuRow?.total) || 0) - (Number(menuRow?.available) || 0)),
        veg: Number(menuRow?.veg) || 0,
        nonVeg: Math.max(0, (Number(menuRow?.total) || 0) - (Number(menuRow?.veg) || 0)),
        categories: Array.isArray(menuCategories) ? menuCategories.filter(Boolean).length : 0,
        avgPrice: safeMoney(menuRow?.avgPrice || 0),
      },
      qrTokens: {
        total: Number(qrRow?.total) || 0,
        used: Number(qrRow?.used) || 0,
        validUnused: validUnusedQrTokens,
      },
      admins: {
        total: Number(adminRow?.total) || 0,
        active: Number(adminRow?.active) || 0,
        byRole: byStatusToObject(adminByRole, ["SUPER_ADMIN", "DINING_ADMIN", "HOUSEKEEPING_ADMIN"]),
        lastLogin: lastAdminLogin
          ? {
              name: lastAdminLogin.name,
              email: lastAdminLogin.email,
              role: lastAdminLogin.role,
              lastLoginAt: lastAdminLogin.lastLoginAt,
            }
          : null,
      },
      hotelInfo: {
        configured: !!hotelInfo,
        name: hotelInfo?.basicInfo?.name || "",
        updatedAt: hotelInfo?.updatedAt || null,
        createdAt: hotelInfo?.createdAt || null,
      },
      dataSync: {
        isSyncing: !!dataSyncStatus?.isSyncing,
        lastRun: dataSyncStatus?.lastRun || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load insights report" });
  }
};
