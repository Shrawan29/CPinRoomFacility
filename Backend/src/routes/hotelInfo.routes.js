import express from "express";
import adminAuth from "../middleware/adminAuth.middleware.js";
import guestAuth from "../middleware/guestAuth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";
import {
  upsertHotelInfo,
  getHotelInfo
} from "../controllers/hotelInfo.controller.js";

const router = express.Router();

// Admin update
router.post(
  "/",
  adminAuth,
  allowRoles("SUPER_ADMIN", "ADMIN"),
  upsertHotelInfo
);

// Guest read
router.get(
  "/",
  guestAuth,
  getHotelInfo
);

export default router;
