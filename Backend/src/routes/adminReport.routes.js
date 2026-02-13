import express from "express";
import adminAuth from "../middleware/adminAuth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";
import {
  getDailyReport,
  getMonthlyReport
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

export default router;
