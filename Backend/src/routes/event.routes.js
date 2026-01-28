import express from "express";
import adminAuth from "../middleware/adminAuth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";
import {
  createEvent,
  updateEvent,
  listEvents,
  deleteEvent,
} from "../controllers/event.controller.js";
import { updateEventStatuses } from "../services/eventScheduler.service.js";

const router = express.Router();

/* =========================
   ADMIN / SUPER_ADMIN
   ========================= */

// Get all events
router.get(
  "/",
  adminAuth,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  listEvents
);

// Create new event
router.post(
  "/",
  adminAuth,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  createEvent
);

// Update event (title, date, location, status)
router.put(
  "/:id",
  adminAuth,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  updateEvent
);

// Delete event
router.delete(
  "/:id",
  adminAuth,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  deleteEvent
);

// Manual trigger for event status scheduler (for testing/debugging)
router.post(
  "/scheduler/trigger",
  adminAuth,
  allowRoles("SUPER_ADMIN"),
  async (req, res) => {
    try {
      const result = await updateEventStatuses();
      res.json({
        message: "Event status update triggered successfully",
        result
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;