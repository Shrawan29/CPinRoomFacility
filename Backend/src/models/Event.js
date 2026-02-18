import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    image: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000000,
    },
    eventDate: { type: Date, required: true },
    eventTime: { type: String }, // Format: HH:MM (e.g., "14:30")
    location: String,
    contact: String,
    link: String,
    status: {
      type: String,
      enum: ["UPCOMING", "ACTIVE", "COMPLETED"],
      default: "UPCOMING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);