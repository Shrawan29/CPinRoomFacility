import express from "express";
import adminAuth from "../middleware/adminAuth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";
import { 
  getAdminDashboardStats,
  getAllGuests,
  getAllRooms,
  getSyncStatus
} from "../controllers/adminDashboard.controller.js";

const router = express.Router();

router.get(
  "/stats",
  adminAuth,
  allowRoles("SUPER_ADMIN"),
  getAdminDashboardStats
);

router.get(
  "/guests",
  adminAuth,
  allowRoles("SUPER_ADMIN"),
  getAllGuests
);

router.get(
  "/rooms",
  adminAuth,
  allowRoles("SUPER_ADMIN"),
  getAllRooms
);

router.get(
  "/sync-status",
  adminAuth,
  allowRoles("SUPER_ADMIN"),
  getSyncStatus
);

export default router;
