import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";

/**
 * GUEST → Place Order
 */
export const placeOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const { roomNumber } = req.guest; // injected by GuestAuth middleware

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items selected" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findOne({
        _id: item.menuItemId,
        isAvailable: true,
      });

      if (!menuItem) {
        return res
          .status(400)
          .json({ message: "One or more items are unavailable" });
      }

      const qty = item.qty || 1;
      const price = menuItem.price;

      totalAmount += price * qty;

      orderItems.push({
        name: menuItem.name,
        qty,
        price,
      });
    }

    const order = await Order.create({
      roomNumber,
      items: orderItems,
      totalAmount,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

/**
 * GUEST → Get My Orders
 */
export const getMyOrders = async (req, res) => {
  try {
    const { roomNumber } = req.guest;

    const orders = await Order.find({ roomNumber })
      .sort({ createdAt: -1 })
      .select("_id status items totalAmount createdAt");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
