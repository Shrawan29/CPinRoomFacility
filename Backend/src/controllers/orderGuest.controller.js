import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import { computeExpiresAtFromEnv } from "../utils/retention.util.js";

const AUTO_DELIVER_AFTER_MS = 10 * 60 * 1000;
// Default is disabled so reporting keeps history unless explicitly enabled.
const DEFAULT_ORDER_RETENTION_DAYS = 0;

const normalizeLabel = (value) => String(value || "").trim();

const normalizeRequestedAddons = (value) => {
  if (!Array.isArray(value)) return [];

  const unique = new Set();
  value.forEach((entry) => {
    const label = normalizeLabel(entry);
    if (label) unique.add(label.toLowerCase());
  });

  return Array.from(unique);
};

const autoDeliverReadyOrdersForRoom = async (roomNumber) => {
  const cutoff = new Date(Date.now() - AUTO_DELIVER_AFTER_MS);

  const expiresAt = computeExpiresAtFromEnv(
    "ORDER_RETENTION_DAYS",
    DEFAULT_ORDER_RETENTION_DAYS
  );

  await Order.updateMany(
    { roomNumber, status: "READY", updatedAt: { $lte: cutoff } },
    expiresAt
      ? { $set: { status: "DELIVERED", expiresAt } }
      : { $set: { status: "DELIVERED" }, $unset: { expiresAt: 1 } }
  );
};

/**
 * GUEST → Place Order
 */
export const placeOrder = async (req, res) => {
  try {
    const { items, notes } = req.body;
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

      const parsedQty = Number(item?.qty);
      const qty = Number.isFinite(parsedQty) && parsedQty > 0
        ? Math.floor(parsedQty)
        : 1;

      const optionLabel = normalizeLabel(item?.selectedOptionLabel).toLowerCase();
      const addonNames = normalizeRequestedAddons(item?.selectedAddonNames);

      const availableOptions = Array.isArray(menuItem.options)
        ? menuItem.options
        : [];
      const availableAddons = Array.isArray(menuItem.addons)
        ? menuItem.addons
        : [];

      let unitPrice = Number(menuItem.price) || 0;
      let selectedOptionName = "";

      if (optionLabel) {
        const matchedOption = availableOptions.find(
          (option) => normalizeLabel(option?.label).toLowerCase() === optionLabel
        );

        if (matchedOption) {
          unitPrice = Number(matchedOption.price) || unitPrice;
          selectedOptionName = normalizeLabel(matchedOption.label);
        }
      }

      const selectedAddonEntries = addonNames
        .map((addonName) =>
          availableAddons.find(
            (addon) => normalizeLabel(addon?.name).toLowerCase() === addonName
          )
        )
        .filter(Boolean);

      const addonPrice = selectedAddonEntries.reduce(
        (sum, addon) => sum + (Number(addon.price) || 0),
        0
      );

      const selectedAddonLabels = [
        ...new Set(
          selectedAddonEntries
            .map((addon) => normalizeLabel(addon.name))
            .filter(Boolean)
        ),
      ];

      unitPrice = Math.max(0, unitPrice + addonPrice);

      const lineDetails = [];
      if (selectedOptionName) lineDetails.push(selectedOptionName);
      if (selectedAddonLabels.length > 0) {
        lineDetails.push(`+ ${selectedAddonLabels.join(", ")}`);
      }

      const lineName =
        lineDetails.length > 0
          ? `${menuItem.name} (${lineDetails.join(" | ")})`
          : menuItem.name;

      totalAmount += unitPrice * qty;

      orderItems.push({
        name: lineName,
        qty,
        price: unitPrice,
      });
    }

    const order = await Order.create({
      roomNumber,
      items: orderItems,
      totalAmount,
      notes: notes || ""
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

    await autoDeliverReadyOrdersForRoom(roomNumber);

    const orders = await Order.find({ roomNumber })
      .sort({ createdAt: -1 })
      .select("_id status items totalAmount createdAt");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
