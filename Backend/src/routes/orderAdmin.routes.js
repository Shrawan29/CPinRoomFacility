import express from "express";
import adminAuth from "../middleware/adminAuth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";
import {
  listOrders,
  updateOrderStatus
} from "../controllers/orderAdmin.controller.js";

const router = express.Router();

router.get(
  "/",
  adminAuth,
  allowRoles("SUPER_ADMIN", "ADMIN", "DINING_ADMIN"),
  listOrders
);

router.patch(
  "/:id",
  adminAuth,
  allowRoles("SUPER_ADMIN", "ADMIN", "DINING_ADMIN"),
  updateOrderStatus
);

export default router;
