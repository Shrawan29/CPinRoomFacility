import Order from "../models/Order.js";

/**
 * DINING_ADMIN → Get all active orders
 */
export const getKitchenOrders = async (req, res) => {
  try {
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

    const allowed = ["PREPARING", "READY", "DELIVERED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
};
