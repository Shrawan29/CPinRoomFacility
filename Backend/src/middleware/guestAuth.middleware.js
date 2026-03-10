import GuestSession from "../models/GuestSession.js";
import Room from "../models/Room.js";

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

    // Check session expiry
    if (session.expiresAt < new Date()) {
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
