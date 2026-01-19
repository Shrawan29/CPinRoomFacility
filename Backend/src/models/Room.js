import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "OCCUPIED"],
      default: "AVAILABLE"
    }
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
