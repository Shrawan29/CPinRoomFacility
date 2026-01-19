import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: String,
    eventDate: {
      type: Date,
      required: true
    },
    location: String,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
