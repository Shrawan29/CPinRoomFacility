import Order from "../models/Order.js";
import { computeExpiresAtFromEnv } from "../utils/retention.util.js";

const AUTO_DELIVER_AFTER_MS = 10 * 60 * 1000;
// Default is disabled so reporting keeps history unless explicitly enabled.
const DEFAULT_ORDER_RETENTION_DAYS = 0;

const autoDeliverReadyOrders = async () => {
  const cutoff = new Date(Date.now() - AUTO_DELIVER_AFTER_MS);
  const expiresAt = computeExpiresAtFromEnv(
    "ORDER_RETENTION_DAYS",
    DEFAULT_ORDER_RETENTION_DAYS
  );
  await Order.updateMany(
    { status: "READY", updatedAt: { $lte: cutoff } },
    expiresAt
      ? { $set: { status: "DELIVERED", expiresAt } }
      : { $set: { status: "DELIVERED" }, $unset: { expiresAt: 1 } }
  );
};

/**
 * DINING_ADMIN → Get all active orders
 */
export const getKitchenOrders = async (req, res) => {
  try {
    await autoDeliverReadyOrders();

    const orders = await Order.find({
      status: { $ne: "DELIVERED" },
    }).sort({ createdAt: 1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to load orders" });
  }
};

/**
 * DINING_ADMIN → Update order status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Kitchen has only 2 manual steps:
    // 1) Accept order -> PREPARING
    // 2) Order leaved / on way -> READY
    // DELIVERED is set automatically after 10 minutes in READY.
    const allowed = ["PREPARING", "READY"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const current = String(order.status || "");
    const isValidTransition =
      (current === "PLACED" && status === "PREPARING") ||
      (current === "PREPARING" && status === "READY");

    if (!isValidTransition) {
      return res.status(409).json({
        message: `Invalid status transition from ${current} to ${status}`,
      });
    }

    order.status = status;
    // Only DELIVERED orders should have expiresAt set.
    // Kitchen transitions are PREPARING/READY, so clear any accidental expiresAt.
    order.expiresAt = undefined;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
};
