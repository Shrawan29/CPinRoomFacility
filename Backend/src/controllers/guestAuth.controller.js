import crypto from "crypto";
import GuestCredential from "../models/GuestCredential.js";
import GuestSession from "../models/GuestSession.js";
import {
  normalizeGuestName,
  normalizePasswordInput,
  normalizeRoomNumber,
} from "../utils/guestName.util.js";

/**
 * Guest Login - Username & Password
 * Password format: guestname_roomno
 */
export const guestLogin = async (req, res) => {
  try {
    const { guestName, roomNumber, password } = req.body;

    if (!guestName || !roomNumber || !password) {
      return res
        .status(400)
        .json({ message: "Guest name, room number, and password required" });
    }

    const normalizedGuestName = normalizeGuestName(guestName);
    const normalizedRoomNumber = normalizeRoomNumber(roomNumber);
    const normalizedPassword = normalizePasswordInput(password);
    const legacyPassword = String(password || "")
      .replace(/\s+/g, " ")
      .trim();

    // Find guest credential
    const credential = await GuestCredential.findOne({
      guestName: normalizedGuestName,
      roomNumber: normalizedRoomNumber,
      status: "ACTIVE",
    });

    if (!credential) {
      return res.status(401).json({
        message: "Invalid guest name or room number",
      });
    }

    // Verify password
    let passwordMatch = await credential.comparePassword(normalizedPassword);
    if (!passwordMatch && legacyPassword && legacyPassword !== normalizedPassword) {
      passwordMatch = await credential.comparePassword(legacyPassword);
    }
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create guest session
    const sessionId = crypto.randomBytes(32).toString("hex");

    await GuestSession.create({
      sessionId,
      guestName: normalizedGuestName,
      roomNumber: normalizedRoomNumber,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.json({
      token: sessionId,
      guest: {
        guestName: normalizedGuestName,
        roomNumber: normalizedRoomNumber,
      },
    });
  } catch (err) {
    console.error("Guest login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
