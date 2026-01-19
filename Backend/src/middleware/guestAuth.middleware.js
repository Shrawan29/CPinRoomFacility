import GuestSession from "../models/GuestSession.js";
import ActiveStay from "../models/ActiveStay.js";

const guestAuth = async (req, res, next) => {
  try {
    const sessionId = req.headers["x-guest-session"];

    if (!sessionId) {
      return res.status(401).json({
        message: "Guest session missing"
      });
    }

    // 1. Validate session
    const session = await GuestSession.findOne({ sessionId });
    if (!session) {
      return res.status(401).json({
        message: "Invalid or expired session"
      });
    }

    // 2. Validate active stay
    const stay = await ActiveStay.findOne({
      roomNumber: session.roomNumber,
      phone: session.phone,
      status: "ACTIVE"
    });

    if (!stay) {
      return res.status(403).json({
        message: "Stay inactive. Please contact reception."
      });
    }

    // 3. Attach guest context
    req.guest = {
      phone: session.phone,
      roomNumber: session.roomNumber
    };

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export default guestAuth;
