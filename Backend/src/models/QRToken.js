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

// Auto-delete expired tokens (TTL)
qrTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Performance & safety indexes
qrTokenSchema.index({ token: 1 });
qrTokenSchema.index(
  { token: 1, used: 1 },
  { partialFilterExpression: { used: false } }
);

// Helper method
qrTokenSchema.methods.isExpired = function () {
  return this.expiresAt < new Date();
};

const QRToken = mongoose.model("QRToken", qrTokenSchema);
export default QRToken;
