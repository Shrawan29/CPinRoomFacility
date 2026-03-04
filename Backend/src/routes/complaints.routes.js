import express from "express";

import adminAuth from "../middleware/adminAuth.middleware.js";
import guestAuth from "../middleware/guestAuth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";

import {
  createComplaint,
  listComplaints,
} from "../controllers/complaint.controller.js";

const router = express.Router();

// Guest: submit a complaint/feedback/etc
router.post("/", guestAuth, createComplaint);

// Admin: view-only list
router.get("/", adminAuth, allowRoles("SUPER_ADMIN"), listComplaints);

export default router;
