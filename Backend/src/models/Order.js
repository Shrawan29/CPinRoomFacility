import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
    },
    // When set, MongoDB TTL will delete the order at this time.
    // This is only populated once an order is finalized (e.g., DELIVERED).
    expiresAt: {
      type: Date,
    },
    items: [
      {
        name: String,
        qty: Number,
        price: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: ["PLACED", "PREPARING", "READY", "DELIVERED"],
      default: "PLACED",
    },
  },
  { timestamps: true }
);

// Auto-delete finalized orders when expiresAt is set
orderSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Common query patterns
orderSchema.index({ roomNumber: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);
