import crypto from "crypto";
import QRToken from "../models/QRToken.js";
import ActiveStay from "../models/ActiveStay.js";
import Room from "../models/Room.js";

export const scanRoomQR = async (req, res) => {
  try {
    const { roomNumber } = req.params;

    // 1. Validate room
    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).json({
        message: "Invalid room QR"
      });
    }

    // 2. Check active stay
    const stay = await ActiveStay.findOne({
      roomNumber,
      status: "ACTIVE"
    });

    if (!stay) {
      return res.status(403).json({
        message: "No active stay for this room"
      });
    }

    // 3. Generate secure token
    const token = crypto.randomBytes(32).toString("hex");

    // 4. Save token (5 minutes expiry)
    await QRToken.create({
      token,
      roomNumber,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    res.json({
      message: "QR verified",
      qrToken: token
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
