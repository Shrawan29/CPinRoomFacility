import Complaint from "../models/Complaint.js";
import { submitComplaintToRannkly } from "../services/rannkly.service.js";

const normalize = (value) => String(value ?? "").trim();

export const createComplaint = async (req, res) => {
  try {
    const type = normalize(req.body?.type);
    const category = normalize(req.body?.category);
    const subject = normalize(req.body?.subject);
    const message = normalize(req.body?.message);

    if (!type || !category || !subject || !message) {
      return res.status(400).json({
        message: "type, category, subject, and message are required",
      });
    }

    const doc = await Complaint.create({
      type,
      category,
      subject,
      message,
      guestSessionId: req.guest.sessionId,
      guestName: req.guest.guestName,
      roomNumber: req.guest.roomNumber,
    });

    const rannklySync = await submitComplaintToRannkly({
      complaintId: String(doc._id),
      type,
      category,
      subject,
      message,
      guestName: req.guest.guestName,
      roomNumber: req.guest.roomNumber,
    });

    if (!rannklySync.synced && !["disabled", "type_not_enabled"].includes(rannklySync.reason)) {
      const syncError = rannklySync.message || rannklySync.reason;
      console.warn(`[Rannkly] Complaint ${doc._id} sync failed: ${syncError}`);
    }

    return res.status(201).json({
      message: "Submitted successfully",
      id: doc._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const listComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(500);

    return res.json({
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
