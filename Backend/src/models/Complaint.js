import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    // Guest context (captured server-side)
    guestSessionId: {
      type: String,
      required: true,
      index: true,
    },
    guestName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", ComplaintSchema);
