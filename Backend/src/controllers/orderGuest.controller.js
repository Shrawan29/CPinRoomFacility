import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";

export const getMyOrders = async (req, res) => {
  try {
    const { roomNumber, phone } = req.guest;

    const orders = await Order.find({
      roomNumber,
      phone
    })
      .sort({ createdAt: -1 })
      .select("_id status createdAt updatedAt items");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const placeOrder = async (req, res) => {
  try {
    const { items, note } = req.body;
    const { roomNumber, phone } = req.guest;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items selected" });
    }

    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findOne({
        _id: item.menuItemId,
        isAvailable: true
      });

      if (!menuItem) {
        return res.status(400).json({
          message: "One or more items are unavailable"
        });
      }

      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity
      });
    }

    const order = await Order.create({
      roomNumber,
      phone,
      items: orderItems,
      note
    });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
