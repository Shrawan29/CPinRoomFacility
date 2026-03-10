import Room from "../models/Room.js";
import GuestSession from "../models/GuestSession.js";
import GuestCredential from "../models/GuestCredential.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import dataSyncService from "../services/dataSync.service.js";

const DEFAULT_GUEST_SESSION_TTL_HOURS = 8;

const getGuestSessionCutoff = () => {
  const hours = Number(process.env.GUEST_SESSION_HOURS || DEFAULT_GUEST_SESSION_TTL_HOURS);
  const ttlHours = Number.isFinite(hours) && hours > 0 ? hours : DEFAULT_GUEST_SESSION_TTL_HOURS;
  return new Date(Date.now() - ttlHours * 60 * 60 * 1000);
};

const getGuestSessionTtlMs = () => {
  const hours = Number(process.env.GUEST_SESSION_HOURS || DEFAULT_GUEST_SESSION_TTL_HOURS);
  const ttlHours = Number.isFinite(hours) && hours > 0 ? hours : DEFAULT_GUEST_SESSION_TTL_HOURS;
  return ttlHours * 60 * 60 * 1000;
};

const parseDateParam = (value) => {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isFinite(date.getTime()) ? date : null;
};

export const getAdminDashboardStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const now = new Date();
    const ttlMs = getGuestSessionTtlMs();
    const cutoffLegacy = new Date(now.getTime() - ttlMs);

    const [totalRooms, availableRooms, occupiedRooms, activeSessions, todayOrders] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments({ status: "AVAILABLE" }),
      Room.countDocuments({ status: "OCCUPIED" }),
      GuestSession.countDocuments({
        source: "APP",
        createdAt: { $lte: now },
        expiresAt: { $gt: now },
        $or: [
          { authExpiresAt: { $gt: now } },
          { authExpiresAt: { $exists: false }, createdAt: { $gte: cutoffLegacy } },
        ],
      }),
      Order.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd },
      }),
    ]);

    res.json({
      totalRooms,
      availableRooms,
      occupiedRooms,
      activeSessions,
      todayOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load dashboard stats",
    });
  }
};

export const getAllGuests = async (req, res) => {
  try {
    const ttlMs = getGuestSessionTtlMs();
    const now = new Date();

    const mode = String(req.query.mode || "").trim().toLowerCase();
    const windowParam = String(req.query.window || "").trim().toLowerCase();
    const fromParam = parseDateParam(req.query.from);
    const toParam = parseDateParam(req.query.to);

    if (mode === "active" || mode === "now") {
      const cutoffLegacy = new Date(now.getTime() - ttlMs);
      const active = await GuestSession.find({
        source: "APP",
        createdAt: { $lte: now },
        expiresAt: { $gt: now },
        $or: [
          { authExpiresAt: { $gt: now } },
          { authExpiresAt: { $exists: false }, createdAt: { $gte: cutoffLegacy } },
        ],
      })
        .sort({ createdAt: -1 })
        .lean();

      const roomNumbers = Array.from(
        new Set(
          active
            .map((s) => (s?.roomNumber != null ? String(s.roomNumber).trim() : ""))
            .filter(Boolean)
        )
      );
      const occupiedRooms = roomNumbers.length
        ? await Room.find({ roomNumber: { $in: roomNumbers }, status: "OCCUPIED" })
          .select("roomNumber")
          .lean()
        : [];
      const occupiedSet = new Set(
        occupiedRooms
          .map((r) => (r?.roomNumber != null ? String(r.roomNumber).trim() : ""))
          .filter(Boolean)
      );

      const sessions = active
        .map((s) => {
          const createdAt = s?.createdAt ? new Date(s.createdAt) : null;
          const authExpiresAt = s?.authExpiresAt ? new Date(s.authExpiresAt) : null;
          const endedAt = s?.endedAt ? new Date(s.endedAt) : null;
          const createdAtMs = createdAt ? createdAt.getTime() : NaN;
          const authExpiresAtMs = authExpiresAt ? authExpiresAt.getTime() : NaN;
          const effectiveAuthExpiry = Number.isFinite(authExpiresAtMs)
            ? authExpiresAt
            : Number.isFinite(createdAtMs)
              ? new Date(createdAtMs + ttlMs)
              : null;

          const endedAtMs = endedAt ? endedAt.getTime() : NaN;
          const effectiveAuthExpiryMs = effectiveAuthExpiry
            ? effectiveAuthExpiry.getTime()
            : NaN;
          const effectiveEnd = Number.isFinite(endedAtMs)
            ? (Number.isFinite(effectiveAuthExpiryMs)
              ? new Date(Math.min(endedAtMs, effectiveAuthExpiryMs))
              : endedAt)
            : effectiveAuthExpiry;

          return {
            ...s,
            activeFrom: createdAt,
            // For Active Now, show the time "as of now" (not the predicted expiry)
            activeTo: now,
            sessionEndAt: effectiveEnd,
          };
        })
        .filter((s) => {
          const roomNumber = s?.roomNumber != null ? String(s.roomNumber).trim() : "";
          return roomNumber && occupiedSet.has(roomNumber);
        })
        .filter((s) => {
          const start = s?.activeFrom ? new Date(s.activeFrom).getTime() : NaN;
          const end = s?.sessionEndAt ? new Date(s.sessionEndAt).getTime() : NaN;
          if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
          return start <= now.getTime() && end > now.getTime();
        });

      return res.json({ mode: "active", from: now, to: now, sessions });
    }

    let from = null;
    let to = null;

    if (fromParam && toParam) {
      from = fromParam;
      to = toParam;
    } else if (windowParam === "week" || windowParam === "7d" || windowParam === "7days") {
      to = now;
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      // default: last 24 hours
      to = now;
      from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    if (!from || !to || !Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || from > to) {
      return res.status(400).json({
        message: "Invalid from/to range",
      });
    }

    // Query sessions that could overlap the window.
    // A session is active over [createdAt, authExpiresAt] (or createdAt+TTL for legacy records).
    const fromMinusTtl = new Date(from.getTime() - ttlMs);

    const candidates = await GuestSession.find({
      source: "APP",
      createdAt: { $gte: fromMinusTtl, $lte: to },
      expiresAt: { $gt: from },
    })
      .sort({ createdAt: -1 })
      .lean();

    const filtered = candidates
      .map((s) => {
        const createdAt = s?.createdAt ? new Date(s.createdAt) : null;
        const authExpiresAt = s?.authExpiresAt ? new Date(s.authExpiresAt) : null;
        const endedAt = s?.endedAt ? new Date(s.endedAt) : null;
        const createdAtMs = createdAt ? createdAt.getTime() : NaN;
        const authExpiresAtMs = authExpiresAt ? authExpiresAt.getTime() : NaN;
        const effectiveAuthExpiry = Number.isFinite(authExpiresAtMs)
          ? authExpiresAt
          : (Number.isFinite(createdAtMs) ? new Date(createdAtMs + ttlMs) : null);

        const endedAtMs = endedAt ? endedAt.getTime() : NaN;
        const effectiveAuthExpiryMs = effectiveAuthExpiry
          ? effectiveAuthExpiry.getTime()
          : NaN;
        const effectiveEnd = Number.isFinite(endedAtMs)
          ? (Number.isFinite(effectiveAuthExpiryMs)
            ? new Date(Math.min(endedAtMs, effectiveAuthExpiryMs))
            : endedAt)
          : effectiveAuthExpiry;

        const windowEnd = to;
        const effectiveEndForWindow = effectiveEnd
          ? new Date(Math.min(effectiveEnd.getTime(), windowEnd.getTime()))
          : null;

        return {
          ...s,
          activeFrom: createdAt,
          // For history windows, cap to the selected window end.
          activeTo: effectiveEndForWindow,
          sessionEndAt: effectiveEnd,
        };
      })
      .filter((s) => {
        const start = s?.activeFrom ? new Date(s.activeFrom).getTime() : NaN;
        const end = s?.sessionEndAt ? new Date(s.sessionEndAt).getTime() : NaN;
        if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
        return start < to.getTime() && end > from.getTime();
      });

    res.json({
      mode: windowParam === "week" || windowParam === "7d" || windowParam === "7days" ? "week" : "range",
      from,
      to,
      sessions: filtered,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load guests",
    });
  }
};

export const getRegisteredGuests = async (req, res) => {
  try {
    const guests = await GuestCredential.find({ status: "ACTIVE" })
      .select("guestName roomNumber source updatedAt")
      .collation({ locale: "en", numericOrdering: true })
      .sort({ roomNumber: 1, guestName: 1 })
      .lean();

    res.json(guests);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load registered guests",
    });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .collation({ locale: "en", numericOrdering: true })
      .sort({ roomNumber: 1 })
      .lean();

    res.json(rooms);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load rooms",
    });
  }
};

export const getSyncStatus = async (req, res) => {
  try {
    const targetDbName = mongoose.connection?.name;
    const [roomsCount, syncedGuestsCount] = await Promise.all([
      Room.countDocuments(),
      GuestSession.countDocuments({ source: "HOTEL_SYNC" }),
    ]);

    res.json({
      targetDbName,
      roomsCount,
      syncedGuestsCount,
      sync: dataSyncService.getStatus(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load sync status",
    });
  }
};
