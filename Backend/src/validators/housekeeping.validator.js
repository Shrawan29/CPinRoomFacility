import { HOUSEKEEPING_ITEM_NAMES } from "../models/ServiceRequest.js";

const asTrimmedString = (value) => {
  if (value === undefined || value === null) return "";
  return String(value).trim();
};

const parseIntStrict = (value) => {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && /^-?\d+$/.test(value.trim())) {
    return Number.parseInt(value.trim(), 10);
  }
  return NaN;
};

export const validateCreateHousekeepingRequest = (req, res, next) => {
  const items = req.body?.items;
  const note = req.body?.note;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors: [{ field: "items", message: "At least one item is required" }],
    });
  }

  const errors = [];
  const normalizedItems = [];

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i] || {};
    const name = asTrimmedString(item.name);
    const quantity = parseIntStrict(item.quantity);

    if (!name) {
      errors.push({ field: `items[${i}].name`, message: "Item name is required" });
    } else if (!HOUSEKEEPING_ITEM_NAMES.includes(name)) {
      errors.push({
        field: `items[${i}].name`,
        message: `Invalid item name. Allowed: ${HOUSEKEEPING_ITEM_NAMES.join(", ")}`,
      });
    }

    if (!Number.isInteger(quantity)) {
      errors.push({ field: `items[${i}].quantity`, message: "Quantity must be an integer" });
    } else if (quantity < 1 || quantity > 5) {
      errors.push({
        field: `items[${i}].quantity`,
        message: "Quantity must be between 1 and 5",
      });
    }

    if (name && Number.isInteger(quantity) && quantity >= 1 && quantity <= 5) {
      normalizedItems.push({ name, quantity });
    }
  }

  const noteStr = note === undefined ? "" : String(note);
  if (note !== undefined && typeof noteStr !== "string") {
    errors.push({ field: "note", message: "Note must be a string" });
  } else if (noteStr && noteStr.length > 500) {
    errors.push({ field: "note", message: "Note must be 500 characters or less" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  // Merge duplicates by name (client may send repeated items)
  const merged = new Map();
  for (const it of normalizedItems) {
    merged.set(it.name, (merged.get(it.name) || 0) + it.quantity);
  }

  // Still enforce max per item per request body (not the daily limit).
  const mergedItems = [...merged.entries()].map(([name, quantity]) => ({ name, quantity }));
  for (const it of mergedItems) {
    if (it.quantity > 5) {
      return res.status(400).json({
        message: "Validation failed",
        errors: [
          {
            field: "items",
            message: `Total quantity for '${it.name}' in a single request cannot exceed 5`,
          },
        ],
      });
    }
  }

  req.body.items = mergedItems;
  req.body.note = asTrimmedString(noteStr);
  return next();
};

export const validateStatusQuery = (req, res, next) => {
  const { status } = req.query;
  if (!status) return next();

  const allowed = new Set(["pending", "accepted", "completed", "active"]);
  if (!allowed.has(String(status))) {
    return res.status(400).json({
      message: "Validation failed",
      errors: [{ field: "status", message: "Invalid status filter" }],
    });
  }
  return next();
};
