import crypto from "crypto";
import GuestOTP from "../models/GuestOtp.js";

export const sendOTP = async (qrToken, phone) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  // remove old OTPs
  await GuestOTP.deleteMany({ qrToken, phone });

  await GuestOTP.create({
    qrToken,
    phone,
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  });

  // TEMP: replace with SMS/WhatsApp
  console.log(`📩 OTP for ${phone}: ${otp}`);
};

export const verifyOTP = async (qrToken, phone, otp) => {
  const record = await GuestOTP.findOne({ qrToken, phone });
  if (!record) return false;

  if (record.expiresAt < new Date()) {
    await record.deleteOne();
    return false;
  }

  const otpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  if (record.otpHash !== otpHash) return false;

  await record.deleteOne();
  return true;
};
