import express from "express";
import adminAuth from "../middleware/adminAuth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";
import {
  getDailyReport,
  getMonthlyReport,
  getInsightsReport
} from "../controllers/adminReport.controller.js";

const router = express.Router();

router.get(
  "/daily",
  adminAuth,
  allowRoles("SUPER_ADMIN"),
  getDailyReport
);

router.get(
  "/monthly",
  adminAuth,
  allowRoles("SUPER_ADMIN"),
  getMonthlyReport
);

router.get(
  "/insights",
  adminAuth,
  allowRoles("SUPER_ADMIN"),
  getInsightsReport
);

export default router;
