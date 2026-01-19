import crypto from "crypto";
import QRToken from "../models/QRToken.js";
import ActiveStay from "../models/ActiveStay.js";
import GuestSession from "../models/GuestSession.js";
import { sendOTP, verifyOTP } from "../services/otp.service.js";

/**
 * STEP 1: Send OTP (QR token required)
 */
export const sendGuestOTP = async (req, res) => {
  const { qrToken, phone } = req.body;

  if (!qrToken || !phone) {
    return res.status(400).json({ message: "QR token and phone required" });
  }

  const tokenDoc = await QRToken.findOne({
    token: qrToken,
    used: false
  });

  if (!tokenDoc) {
    return res.status(401).json({ message: "Invalid or expired QR token" });
  }

  const stay = await ActiveStay.findOne({
    roomNumber: tokenDoc.roomNumber,
    phone,
    status: "ACTIVE"
  });

  if (!stay) {
    return res.status(403).json({
      message: "Phone number does not match active stay"
    });
  }

  sendOTP(phone);

  res.json({
    message: "OTP sent successfully"
  });
};

/**
 * STEP 2: Verify OTP and create session
 */
export const verifyGuestOTP = async (req, res) => {
  const { qrToken, phone, otp, deviceId } = req.body;

  if (!qrToken || !phone || !otp) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const tokenDoc = await QRToken.findOne({
    token: qrToken,
    used: false
  });

  if (!tokenDoc) {
    return res.status(401).json({ message: "Invalid or expired QR token" });
  }

  const stay = await ActiveStay.findOne({
    roomNumber: tokenDoc.roomNumber,
    phone,
    status: "ACTIVE"
  });

  if (!stay) {
    return res.status(403).json({
      message: "No active stay found"
    });
  }

  const otpValid = verifyOTP(phone, otp);
  if (!otpValid) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  // Mark QR token as used
  tokenDoc.used = true;
  await tokenDoc.save();

  // Create guest session (valid till checkout, safety cap 2 days)
  const sessionId = crypto.randomBytes(32).toString("hex");

  await GuestSession.create({
    sessionId,
    phone,
    roomNumber: tokenDoc.roomNumber,
    deviceId,
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  });

  res.json({
    message: "Login successful",
    sessionId
  });
};
