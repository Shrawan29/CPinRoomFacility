import mongoose from "mongoose";

const guestOTPSchema = new mongoose.Schema(
  {
    qrToken: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    otpHash: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

// Auto-delete expired OTPs
guestOTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const GuestOTP = mongoose.model("GuestOTP", guestOTPSchema);
export default GuestOTP;
