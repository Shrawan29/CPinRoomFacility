import mongoose from "mongoose";
import bcrypt from "bcrypt";

const guestCredentialSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["APP", "HOTEL_SYNC"],
      default: "APP",
      required: true,
    },
    guestName: {
      type: String,
      required: true,
      trim: true,
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

// Composite unique index: only one active credential per guest per room
guestCredentialSchema.index(
  { guestName: 1, roomNumber: 1 },
  { unique: true, partialFilterExpression: { status: "ACTIVE" } }
);

// Methods
guestCredentialSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

guestCredentialSchema.statics.hashPassword = async function (password) {
  return bcrypt.hash(password, 10);
};

const GuestCredential = mongoose.model("GuestCredential", guestCredentialSchema);
export default GuestCredential;
