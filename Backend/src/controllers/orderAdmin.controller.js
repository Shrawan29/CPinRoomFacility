import Order from "../models/Order.js";
import { computeExpiresAtFromEnv } from "../utils/retention.util.js";

export const listOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};


const allowedStatuses = ["PLACED", "PREPARING", "DELIVERED"];
// Default disabled so reports keep history unless explicitly enabled.
const DEFAULT_ORDER_RETENTION_DAYS = 0;

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid order status"
    });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  order.status = status;

  // Safety: only allow expiresAt when retention is explicitly enabled and status is DELIVERED.
  if (status === "DELIVERED") {
    const expiresAt = computeExpiresAtFromEnv(
      "ORDER_RETENTION_DAYS",
      DEFAULT_ORDER_RETENTION_DAYS
    );
    order.expiresAt = expiresAt || undefined;
  } else {
    order.expiresAt = undefined;
  }

  await order.save();

  res.json({
    message: "Order status updated",
    orderId: order._id,
    status: order.status
  });
};


