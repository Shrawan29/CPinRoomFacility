import Order from "../models/Order.js";

export const listOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};


const allowedStatuses = ["PLACED", "PREPARING", "DELIVERED"];

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
  await order.save();

  res.json({
    message: "Order status updated",
    orderId: order._id,
    status: order.status
  });
};


