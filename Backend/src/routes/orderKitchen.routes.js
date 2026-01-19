import express from "express";
import adminAuth from "../middleware/adminAuth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";
import {
  getKitchenOrders,
  updateOrderStatus,
} from "../controllers/orderKitchen.controller.js";

const router = express.Router();

router.get(
  "/",
  adminAuth,
  allowRoles("DINING_ADMIN"),
  getKitchenOrders
);

router.patch(
  "/:orderId/status",
  adminAuth,
  allowRoles("DINING_ADMIN"),
  updateOrderStatus
);

export default router;
