import mongoose from "mongoose";

const qrTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true
    },
    roomNumber: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    used: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Auto-delete expired tokens
qrTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const QRToken = mongoose.model("QRToken", qrTokenSchema);
export default QRToken;
