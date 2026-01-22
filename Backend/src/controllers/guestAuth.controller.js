import crypto from "crypto";
import QRToken from "../models/QRToken.js";
import ActiveStay from "../models/ActiveStay.js";
import GuestSession from "../models/GuestSession.js";
import { sendOTP, verifyOTP } from "../services/otp.service.js";

/**
 * STEP 1: Send OTP
 */
export const sendGuestOTP = async (req, res) => {
  try {
    const { qrToken, phone } = req.body;

    if (!qrToken || !phone) {
      return res.status(400).json({ message: "QR token and phone required" });
    }

    const tokenDoc = await QRToken.findOne({
      token: qrToken,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      return res.status(401).json({ message: "Invalid or expired QR token" });
    }

    const stay = await ActiveStay.findOne({
      roomNumber: tokenDoc.roomNumber,
      phone,
      status: "ACTIVE",
    });

    if (!stay) {
      return res.status(403).json({
        message: "Phone number does not match active stay",
      });
    }

    // ✅ FIX: pass qrToken + phone
    await sendOTP(qrToken, phone);

    res.json({
      message: "OTP sent successfully",
      roomNumber: tokenDoc.roomNumber,
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/**
 * STEP 2: Verify OTP
 */
export const verifyGuestOTP = async (req, res) => {
  try {
    const { qrToken, phone, otp, deviceId } = req.body;

    if (!qrToken || !phone || !otp || !deviceId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const tokenDoc = await QRToken.findOne({
      token: qrToken,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      return res.status(401).json({ message: "Invalid or expired QR token" });
    }

    const stay = await ActiveStay.findOne({
      roomNumber: tokenDoc.roomNumber,
      phone,
      status: "ACTIVE",
    });

    if (!stay) {
      return res.status(403).json({
        message: "No active stay found",
      });
    }

    // ✅ FIX: verify with qrToken + phone
    const otpValid = await verifyOTP(qrToken, phone, otp);
    if (!otpValid) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    // Mark QR token as used
    tokenDoc.used = true;
    await tokenDoc.save();

    // Create guest session
    const sessionId = crypto.randomBytes(32).toString("hex");

    await GuestSession.create({
      sessionId,
      phone,
      roomNumber: tokenDoc.roomNumber,
      deviceId,
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    });

    res.json({
      token: sessionId,
      guest: {
        phone,
        roomNumber: tokenDoc.roomNumber,
      },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};
