import crypto from "crypto";

// key → `${qrToken}_${phone}`
const otpStore = new Map();

export const sendOTP = (qrToken, phone) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  otpStore.set(`${qrToken}_${phone}`, {
    otp: hashedOTP,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  // TEMP: replace with SMS / WhatsApp provider
  console.log(`📩 OTP for ${phone}: ${otp}`);
};

export const verifyOTP = (qrToken, phone, otp) => {
  const key = `${qrToken}_${phone}`;
  const data = otpStore.get(key);

  if (!data) return false;

  if (Date.now() > data.expiresAt) {
    otpStore.delete(key);
    return false;
  }

  const hashedOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  if (data.otp !== hashedOTP) return false;

  otpStore.delete(key);
  return true;
};
