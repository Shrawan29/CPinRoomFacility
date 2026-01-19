import express from "express";
import adminAuth from "../middleware/adminAuth.middleware.js";
import guestAuth from "../middleware/guestAuth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";
import {
  createEvent,
  updateEvent,
  listActiveEvents
} from "../controllers/event.controller.js";

const router = express.Router();

// Admin
router.post(
  "/",
  adminAuth,
  allowRoles("SUPER_ADMIN", "ADMIN"),
  createEvent
);

router.patch(
  "/:id",
  adminAuth,
  allowRoles("SUPER_ADMIN", "ADMIN"),
  updateEvent
);

// Guest
router.get(
  "/guest",
  guestAuth,
  listActiveEvents
);

export default router;
