import mongoose from "mongoose";

export const HOUSEKEEPING_ITEM_NAMES = [
  "Towel",
  "Shampoo",
  "Soap",
  "Bedsheet",
  "Water Bottle",
  "Room Cleaning",
];

const serviceRequestItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: HOUSEKEEPING_ITEM_NAMES,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { _id: false }
);

const serviceRequestSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HotelInfo",
      required: true,
      index: true,
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    guestId: {
      // In this codebase, guests are session-based; this stores the GuestSession _id.
      type: mongoose.Schema.Types.ObjectId,
      ref: "GuestSession",
      required: true,
      index: true,
    },
    items: {
      type: [serviceRequestItemSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one item is required",
      },
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

serviceRequestSchema.index({ hotelId: 1, roomNumber: 1, createdAt: 1 });
serviceRequestSchema.index({ hotelId: 1, status: 1, createdAt: -1 });

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);
export default ServiceRequest;
