import GuestSession from "../models/GuestSession.js";
import Room from "../models/Room.js";

const DEFAULT_GUEST_SESSION_TTL_HOURS = 8;

const getGuestSessionTtlMs = () => {
  const hours = Number(process.env.GUEST_SESSION_HOURS || DEFAULT_GUEST_SESSION_TTL_HOURS);
  const ttlHours = Number.isFinite(hours) && hours > 0 ? hours : DEFAULT_GUEST_SESSION_TTL_HOURS;
  return ttlHours * 60 * 60 * 1000;
};

const guestAuth = async (req, res, next) => {
  try {
    const sessionId = req.headers["x-guest-session"];

    if (!sessionId) {
      return res.status(401).json({
        message: "Guest session missing"
      });
    }

    // Validate session
    const session = await GuestSession.findOne({ sessionId });
    if (!session) {
      return res.status(401).json({
        message: "Invalid or expired session"
      });
    }

    // Check retention expiry (document TTL)
    if (session.expiresAt < new Date()) {
      return res.status(401).json({
        message: "Session expired"
      });
    }

    // Enforce auth TTL from login time.
    // New sessions store authExpiresAt; older records fall back to createdAt+TTL.
    const ttlMs = getGuestSessionTtlMs();
    const createdAtMs = session?.createdAt ? new Date(session.createdAt).getTime() : NaN;
    const authExpiresAtMs = session?.authExpiresAt ? new Date(session.authExpiresAt).getTime() : NaN;
    const effectiveAuthExpiryMs = Number.isFinite(authExpiresAtMs)
      ? authExpiresAtMs
      : (Number.isFinite(createdAtMs) ? createdAtMs + ttlMs : NaN);

    if (Number.isFinite(effectiveAuthExpiryMs) && Date.now() > effectiveAuthExpiryMs) {
      return res.status(401).json({
        message: "Session expired"
      });
    }

    // If the guest has checked out (room is AVAILABLE), invalidate the session.
    const room = await Room.findOne({ roomNumber: session.roomNumber }).select("status").lean();
    if (!room || room.status !== "OCCUPIED") {
      return res.status(401).json({
        message: "Session ended"
      });
    }

    // Attach guest context
    req.guest = {
      id: session._id,
      sessionId: session.sessionId,
      guestName: session.guestName,
      roomNumber: session.roomNumber,
    };

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export default guestAuth;
