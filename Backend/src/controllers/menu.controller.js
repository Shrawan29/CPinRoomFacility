/**
 * DINING_ADMIN → Bulk create/update menu items
 */
export const bulkUpsertMenuItems = async (req, res) => {
  try {
    const items = req.body.items;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const upserted = [];
    for (const item of items) {
      if (!item.name || !item.category || item.price == null) continue;
      // Try to find by name+category, update if exists, else create
      const updated = await MenuItem.findOneAndUpdate(
        { name: item.name, category: item.category },
        {
          $set: {
            price: item.price,
            description: item.description || "",
            isVeg: item.isVeg !== undefined ? item.isVeg : true,
            isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
          },
        },
        { new: true, upsert: true }
      );
      upserted.push(updated);
    }
    res.json({ message: "Bulk upsert complete", count: upserted.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import MenuItem from "../models/MenuItem.js";

/**
 * DINING_ADMIN → Create menu item
 */
export const createMenuItem = async (req, res) => {
  try {
    const { name, category, price, description, isVeg } = req.body;

    if (!name || !category || price == null) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const item = await MenuItem.create({
      name,
      category,
      price,
      description,
      isVeg,
      isAvailable: true,
    });

    res.status(201).json({
      message: "Menu item created",
      item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DINING_ADMIN → Update menu item
 */
export const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({
      message: "Menu item updated",
      item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DINING_ADMIN → Delete menu item
 */
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({
      message: "Menu item deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DINING_ADMIN → List all menu items
 */
export const listAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GUEST → List available menu items only
 */
export const listAvailableMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true }).sort({
      category: 1,
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GUEST → Add to cart
 */
export const addToCart = async (req, res) => {
  try {
    const { itemId } = req.body;

    // Check if the item is already in the cart
    const existingItem = req.session.cart.find(
      (item) => item._id.toString() === itemId,
    );

    if (existingItem) {
      // If the item is already in the cart, increment the quantity
      existingItem.qty += 1;
    } else {
      // If the item is not in the cart, add it with a quantity of 1
      req.session.cart.push({ _id: itemId, qty: 1 });
    }

    res.json({ message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
