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
