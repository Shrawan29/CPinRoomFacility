import mongoose from "mongoose";

const guestSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true
    },
    roomNumber: {
      type: String,
      required: true
    },
    deviceId: {
      type: String
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

// Auto-remove expired sessions (safety)
guestSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const GuestSession = mongoose.model("GuestSession", guestSessionSchema);
export default GuestSession;
