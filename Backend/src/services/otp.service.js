const otpStore = new Map(); // phone → { otp, expiresAt }

export const sendOTP = (phone) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(phone, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  });

  console.log(`📩 OTP for ${phone}: ${otp}`); // TEMP (console)
};

export const verifyOTP = (phone, otp) => {
  const data = otpStore.get(phone);
  if (!data) return false;

  if (Date.now() > data.expiresAt) {
    otpStore.delete(phone);
    return false;
  }

  if (data.otp !== otp) return false;

  otpStore.delete(phone);
  return true;
};
