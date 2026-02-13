import mongoose from "mongoose";

const guestSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true
    },
    source: {
      type: String,
      enum: ["APP", "HOTEL_SYNC"],
      default: "APP",
      required: true
    },
    guestName: {
      type: String,
      required: true
    },
    roomNumber: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    syncedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

// Auto-remove expired sessions (safety)
guestSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const GuestSession = mongoose.model("GuestSession", guestSessionSchema);
export default GuestSession;
