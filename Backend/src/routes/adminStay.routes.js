import express from "express";
import adminAuth from "../middleware/adminAuth.middleware.js";
import {
  checkInGuest,
  checkOutGuest,
  getActiveStays
} from "../controllers/adminStay.controller.js";
import allowRoles from "../middleware/role.middleware.js";

const router = express.Router();

// ADMIN & SUPER_ADMIN allowed
router.post(
  "/checkin",
  adminAuth,
  allowRoles("SUPER_ADMIN", "ADMIN"),
  checkInGuest
);

router.post(
  "/checkout",
  adminAuth,
  allowRoles("SUPER_ADMIN", "ADMIN"),
  checkOutGuest
);

router.get(
  "/active",
  adminAuth,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  getActiveStays
);


export default router;
