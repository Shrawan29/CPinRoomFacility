import express from "express";
import adminAuth from "../middleware/adminAuth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";
import { getAdminDashboardStats } from "../controllers/adminDashboard.controller.js";

const router = express.Router();

router.get(
  "/stats",
  adminAuth,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  getAdminDashboardStats
);

export default router;
