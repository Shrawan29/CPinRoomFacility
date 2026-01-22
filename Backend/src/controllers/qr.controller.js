import crypto from "crypto";
import QRToken from "../models/QRToken.js";
import ActiveStay from "../models/ActiveStay.js";
import Room from "../models/Room.js";

export const scanRoomQR = async (req, res) => {
  try {
    const { roomNumber } = req.params;

    const FRONTEND_URL =
      process.env.FRONTEND_URL || "http://localhost:5173";

    /* ============================
       1. Validate room
       ============================ */
    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.redirect(
        `${FRONTEND_URL}/guest/access-fallback?reason=invalid-room`
      );
    }

    /* ============================
       2. Check active stay
       ============================ */
    const stay = await ActiveStay.findOne({
      roomNumber,
      status: "ACTIVE"
    });

    if (!stay) {
      return res.redirect(
        `${FRONTEND_URL}/guest/access-fallback?reason=no-active-stay`
      );
    }

    /* ============================
       3. Generate secure token
       ============================ */
    const token = crypto.randomBytes(32).toString("hex");

    /* ============================
       4. Save token (5 min expiry)
       ============================ */
    await QRToken.create({
      token,
      roomNumber,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      used: false
    });

    /* ============================
       5. Redirect to guest login
       ============================ */
    return res.redirect(
      `${FRONTEND_URL}/guest/login?token=${token}`
    );

  } catch (error) {
    console.error("QR Scan Error:", error);

    return res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/guest/access-fallback?reason=server-error`
    );
  }
};
