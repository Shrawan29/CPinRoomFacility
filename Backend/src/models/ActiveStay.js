import mongoose from "mongoose";

const activeStaySchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    roomNumber: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CHECKED_OUT"],
      default: "ACTIVE"
    },
    checkInAt: {
      type: Date,
      default: Date.now
    },
    checkOutAt: {
      type: Date
    }
  },
  { timestamps: true }
);

/**
 * DB-_toggle RULES (CRITICAL)
 * - Only one ACTIVE stay per room
 * - Only one ACTIVE stay per phone
 */
activeStaySchema.index(
  { roomNumber: 1 },
  { unique: true, partialFilterExpression: { status: "ACTIVE" } }
);

activeStaySchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { status: "ACTIVE" } }
);

const ActiveStay = mongoose.model("ActiveStay", activeStaySchema);
export default ActiveStay;
