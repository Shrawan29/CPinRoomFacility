import Room from "../models/Room.js";

export const scanRoomQR = async (req, res) => {
  try {
    const { roomNumber } = req.params;

    const FRONTEND_URL =
      process.env.FRONTEND_URL || "http://localhost:5173";

    /* ============================
       1. Validate room exists
       ============================ */
    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.redirect(
        `${FRONTEND_URL}/guest/access-fallback?reason=invalid-room`
      );
    }

    /* ============================
       2. Redirect to guest login with room number
       ============================ */
    return res.redirect(
      `${FRONTEND_URL}/guest/login?room=${encodeURIComponent(roomNumber)}`
    );

  } catch (error) {
    console.error("QR Scan Error:", error);

    return res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/guest/access-fallback?reason=server-error`
    );
  }
};
