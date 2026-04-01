import MenuItem from "../models/MenuItem.js";

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const normalizeBoolean = (value, fallback) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lowered = value.toLowerCase();
    if (lowered === "true") return true;
    if (lowered === "false") return false;
  }
  return fallback;
};

const normalizeRequiredText = (value) =>
  typeof value === "string" ? value.trim() : "";

const normalizeOptionalText = (value) => {
  if (value == null) return undefined;
  return typeof value === "string" ? value.trim() : String(value).trim();
};

const normalizePrice = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
};

const normalizeOptions = (options) => {
  if (!Array.isArray(options)) return [];

  return options
    .map((opt) => ({
      label: normalizeRequiredText(opt?.label),
      price: normalizePrice(opt?.price),
    }))
    .filter((opt) => opt.label && opt.price != null && opt.price >= 0);
};

const normalizeAddons = (addons) => {
  if (!Array.isArray(addons)) return [];

  return addons
    .map((addon) => ({
      name: normalizeRequiredText(addon?.name),
      price: normalizePrice(addon?.price),
    }))
    .filter((addon) => addon.name && addon.price != null && addon.price >= 0);
};

const buildCreatePayload = (input) => {
  const name = normalizeRequiredText(input?.name);
  const category = normalizeRequiredText(input?.category);
  const price = normalizePrice(input?.price);

  if (!name || !category || price == null || price < 0) {
    return null;
  }

  const payload = {
    name,
    category,
    price,
    description: normalizeOptionalText(input?.description) || "",
    isVeg: normalizeBoolean(input?.isVeg, true),
    isAvailable: normalizeBoolean(input?.isAvailable, true),
    options: normalizeOptions(input?.options),
    addons: normalizeAddons(input?.addons),
  };

  if (hasOwn(input || {}, "image")) {
    payload.image = normalizeOptionalText(input?.image) || "";
  }

  return payload;
};

const buildUpdatePayload = (input) => {
  const payload = {};

  if (hasOwn(input, "name")) {
    const name = normalizeRequiredText(input.name);
    if (!name) return null;
    payload.name = name;
  }

  if (hasOwn(input, "category")) {
    const category = normalizeRequiredText(input.category);
    if (!category) return null;
    payload.category = category;
  }

  if (hasOwn(input, "price")) {
    const price = normalizePrice(input.price);
    if (price == null || price < 0) return null;
    payload.price = price;
  }

  if (hasOwn(input, "description")) {
    payload.description = normalizeOptionalText(input.description) || "";
  }

  if (hasOwn(input, "image")) {
    payload.image = normalizeOptionalText(input.image) || "";
  }

  if (hasOwn(input, "options")) {
    payload.options = normalizeOptions(input.options);
  }

  if (hasOwn(input, "addons")) {
    payload.addons = normalizeAddons(input.addons);
  }

  if (hasOwn(input, "isVeg")) {
    const isVeg = normalizeBoolean(input.isVeg, undefined);
    if (isVeg === undefined) return null;
    payload.isVeg = isVeg;
  }

  if (hasOwn(input, "isAvailable")) {
    const isAvailable = normalizeBoolean(input.isAvailable, undefined);
    if (isAvailable === undefined) return null;
    payload.isAvailable = isAvailable;
  }

  return payload;
};

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
    let skipped = 0;

    for (const item of items) {
      const payload = buildCreatePayload(item);
      if (!payload) {
        skipped += 1;
        continue;
      }

      // Try to find by name+category, update if exists, else create.
      const updated = await MenuItem.findOneAndUpdate(
        { name: payload.name, category: payload.category },
        { $set: payload },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

      upserted.push(updated);
    }

    res.json({
      message: "Bulk upsert complete",
      count: upserted.length,
      skipped,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DINING_ADMIN → Create menu item
 */
export const createMenuItem = async (req, res) => {
  try {
    const payload = buildCreatePayload(req.body);

    if (!payload) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const item = await MenuItem.create(payload);

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
    const payload = buildUpdatePayload(req.body || {});
    if (payload == null) {
      return res.status(400).json({ message: "Invalid menu item payload" });
    }

    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

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
