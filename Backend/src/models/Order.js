import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
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
    status: {
      type: String,
      enum: ["PLACED", "PREPARING", "READY", "DELIVERED"],
      default: "PLACED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
