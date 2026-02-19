import express from "express";
import adminAuth from "../middleware/adminAuth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  listAllMenuItems,
  listAvailableMenuItems,
  bulkUpsertMenuItems,
} from "../controllers/menu.controller.js";

router.post(
  "/kitchen/bulk",
  adminAuth,
  allowRoles("DINING_ADMIN"),
  bulkUpsertMenuItems
);

const router = express.Router();

/* ===========================
   KITCHEN ADMIN (DINING_ADMIN)
   =========================== */

router.get(
  "/kitchen",
  adminAuth,
  allowRoles("DINING_ADMIN"),
  listAllMenuItems
);

router.post(
  "/kitchen",
  adminAuth,
  allowRoles("DINING_ADMIN"),
  createMenuItem
);

router.put(
  "/kitchen/:id",
  adminAuth,
  allowRoles("DINING_ADMIN"),
  updateMenuItem
);

router.delete(
  "/kitchen/:id",
  adminAuth,
  allowRoles("DINING_ADMIN"),
  deleteMenuItem
);

/* =========
   GUEST
   ========= */

router.get("/guest", listAvailableMenuItems);

export default router;
