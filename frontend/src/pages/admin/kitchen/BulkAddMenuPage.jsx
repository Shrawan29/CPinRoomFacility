import { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { createMenuItem } from "../../../services/menu.service";

const EMPTY_ITEM = () => ({
  name: "",
  category: "",
  price: "",
  description: "",
  isVeg: true,
  image: "",
  options: [],
  addons: [],
  expanded: true,
});

const CATEGORIES = ["Starters", "Main Course", "Breads", "Rice & Biryani", "Desserts", "Beverages", "Sides", "Specials"];

const VegIcon = ({ isVeg }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 18,
      height: 18,
      border: `2px solid ${isVeg ? "#16a34a" : "#dc2626"}`,
      borderRadius: 3,
      flexShrink: 0,
    }}
  >
    <span
      style={{
        width: 9,
        height: 9,
        borderRadius: "50%",
        background: isVeg ? "#16a34a" : "#dc2626",
        display: "block",
      }}
    />
  </span>
);

function ItemCard({ item, idx, onChange, onRemove, onDuplicate, total }) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [addonsOpen, setAddonsOpen] = useState(false);

  const isComplete = item.name && item.category && item.price;

  const handleOptionChange = (optIdx, field, value) => {
    const opts = [...item.options];
    opts[optIdx] = { ...opts[optIdx], [field]: value };
    onChange(idx, "options", opts);
  };
  const addOption = () => onChange(idx, "options", [...item.options, { label: "", price: "" }]);
  const removeOption = (optIdx) => onChange(idx, "options", item.options.filter((_, i) => i !== optIdx));

  const handleAddonChange = (addonIdx, field, value) => {
    const ads = [...item.addons];
    ads[addonIdx] = { ...ads[addonIdx], [field]: value };
    onChange(idx, "addons", ads);
  };
  const addAddon = () => onChange(idx, "addons", [...item.addons, { name: "", price: "" }]);
  const removeAddon = (addonIdx) => onChange(idx, "addons", item.addons.filter((_, i) => i !== addonIdx));

  return (
    <div
      style={{
        background: "#fff",
        border: `1.5px solid ${isComplete ? "var(--brand)" : "#e5d5c8"}`,
        borderRadius: 14,
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: isComplete ? "0 2px 12px rgba(164,0,93,0.08)" : "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      {/* Card Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          background: isComplete ? "rgba(164,0,93,0.04)" : "var(--bg-secondary)",
          borderBottom: "1px solid #e5d5c8",
        }}
      >
        {/* Item number badge */}
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: isComplete ? "var(--brand)" : "#d4b8a8",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {idx + 1}
        </span>

        <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: item.name ? "var(--text-primary)" : "var(--text-muted)" }}>
          {item.name || "Unnamed item"}
        </span>

        {item.category && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 20,
              background: "rgba(164,0,93,0.1)",
              color: "var(--brand)",
            }}
          >
            {item.category}
          </span>
        )}

        {item.price && (
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
            ₹{item.price}
          </span>
        )}

        <VegIcon isVeg={item.isVeg} />

        <div style={{ display: "flex", gap: 4, marginLeft: 4 }}>
          <button
            type="button"
            onClick={() => onDuplicate(idx)}
            title="Duplicate"
            style={{
              padding: "4px 8px",
              fontSize: 11,
              borderRadius: 6,
              border: "1px solid #d4b8a8",
              background: "transparent",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            ⧉
          </button>
          {total > 1 && (
            <button
              type="button"
              onClick={() => onRemove(idx)}
              title="Remove"
              style={{
                padding: "4px 8px",
                fontSize: 11,
                borderRadius: 6,
                border: "1px solid #fca5a5",
                background: "transparent",
                color: "#dc2626",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: "16px" }}>
        {/* Row 1: Name + Category + Price */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, marginBottom: 10 }}>
          <div>
            <label style={labelStyle}>Item Name *</label>
            <input
              placeholder="e.g. Paneer Tikka"
              value={item.name}
              onChange={(e) => onChange(idx, "name", e.target.value)}
              style={inputStyle(!!item.name)}
            />
          </div>
          <div>
            <label style={labelStyle}>Category *</label>
            <select
              value={item.category}
              onChange={(e) => onChange(idx, "category", e.target.value)}
              style={{ ...inputStyle(!!item.category), cursor: "pointer" }}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Price (₹) *</label>
            <input
              type="number"
              placeholder="0"
              value={item.price}
              onChange={(e) => onChange(idx, "price", e.target.value)}
              style={{ ...inputStyle(!!item.price), width: 90 }}
            />
          </div>
        </div>

        {/* Row 2: Description + Veg toggle */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 10, alignItems: "start" }}>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              placeholder="Short description of the dish..."
              value={item.description}
              onChange={(e) => onChange(idx, "description", e.target.value)}
              rows={2}
              style={{ ...inputStyle(!!item.description), resize: "none" }}
            />
          </div>
          <div>
            <label style={labelStyle}>Type</label>
            <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => onChange(idx, "isVeg", v)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: item.isVeg === v
                      ? `2px solid ${v ? "#16a34a" : "#dc2626"}`
                      : "2px solid #e5d5c8",
                    background: item.isVeg === v
                      ? v ? "rgba(22,163,74,0.06)" : "rgba(220,38,38,0.06)"
                      : "transparent",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <VegIcon isVeg={v} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: v ? "#16a34a" : "#dc2626" }}>
                    {v ? "Veg" : "Non-Veg"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Image URL */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Image URL</label>
          <input
            placeholder="https://..."
            value={item.image}
            onChange={(e) => onChange(idx, "image", e.target.value)}
            style={inputStyle(!!item.image)}
          />
        </div>

        {/* Options & Addons as collapsible */}
        <div style={{ display: "flex", gap: 8 }}>
          {/* Options */}
          <div style={{ flex: 1 }}>
            <button
              type="button"
              onClick={() => setOptionsOpen((o) => !o)}
              style={expandBtnStyle(item.options.length > 0)}
            >
              <span>⚙ Portion Options</span>
              <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                {item.options.length > 0 && (
                  <span style={{ fontSize: 11, background: "var(--brand)", color: "#fff", borderRadius: 10, padding: "1px 7px", fontWeight: 700 }}>
                    {item.options.length}
                  </span>
                )}
                <span style={{ fontSize: 12 }}>{optionsOpen ? "▲" : "▼"}</span>
              </span>
            </button>
            {optionsOpen && (
              <div style={{ marginTop: 8, padding: 10, background: "var(--bg-primary)", borderRadius: 8, border: "1px solid #e5d5c8" }}>
                {item.options.map((opt, optIdx) => (
                  <div key={optIdx} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                    <input
                      value={opt.label}
                      onChange={(e) => handleOptionChange(optIdx, "label", e.target.value)}
                      placeholder="e.g. Half"
                      style={{ ...inputStyle(false), flex: 1, fontSize: 12 }}
                    />
                    <span style={{ color: "var(--text-muted)", fontSize: 12 }}>₹</span>
                    <input
                      type="number"
                      value={opt.price}
                      onChange={(e) => handleOptionChange(optIdx, "price", e.target.value)}
                      placeholder="Price"
                      style={{ ...inputStyle(false), width: 72, fontSize: 12 }}
                    />
                    <button type="button" onClick={() => removeOption(optIdx)} style={removeSmallBtn}>✕</button>
                  </div>
                ))}
                <button type="button" onClick={addOption} style={addSmallBtn}>+ Add Portion</button>
              </div>
            )}
          </div>

          {/* Addons */}
          <div style={{ flex: 1 }}>
            <button
              type="button"
              onClick={() => setAddonsOpen((o) => !o)}
              style={expandBtnStyle(item.addons.length > 0)}
            >
              <span>＋ Add-ons</span>
              <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                {item.addons.length > 0 && (
                  <span style={{ fontSize: 11, background: "var(--brand)", color: "#fff", borderRadius: 10, padding: "1px 7px", fontWeight: 700 }}>
                    {item.addons.length}
                  </span>
                )}
                <span style={{ fontSize: 12 }}>{addonsOpen ? "▲" : "▼"}</span>
              </span>
            </button>
            {addonsOpen && (
              <div style={{ marginTop: 8, padding: 10, background: "var(--bg-primary)", borderRadius: 8, border: "1px solid #e5d5c8" }}>
                {item.addons.map((addon, addonIdx) => (
                  <div key={addonIdx} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                    <input
                      value={addon.name}
                      onChange={(e) => handleAddonChange(addonIdx, "name", e.target.value)}
                      placeholder="e.g. Extra Cheese"
                      style={{ ...inputStyle(false), flex: 1, fontSize: 12 }}
                    />
                    <span style={{ color: "var(--text-muted)", fontSize: 12 }}>₹</span>
                    <input
                      type="number"
                      value={addon.price}
                      onChange={(e) => handleAddonChange(addonIdx, "price", e.target.value)}
                      placeholder="Price"
                      style={{ ...inputStyle(false), width: 72, fontSize: 12 }}
                    />
                    <button type="button" onClick={() => removeAddon(addonIdx)} style={removeSmallBtn}>✕</button>
                  </div>
                ))}
                <button type="button" onClick={addAddon} style={addSmallBtn}>+ Add Add-on</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Shared styles
const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "var(--text-muted)",
  marginBottom: 4,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const inputStyle = (filled) => ({
  width: "100%",
  boxSizing: "border-box",
  padding: "8px 10px",
  fontSize: 13,
  borderRadius: 8,
  border: `1.5px solid ${filled ? "var(--brand-soft)" : "#ddd0c4"}`,
  background: filled ? "rgba(164,0,93,0.02)" : "#fff",
  color: "var(--text-primary)",
  outline: "none",
  transition: "border-color 0.15s",
  fontFamily: "var(--font-sans)",
});

const expandBtnStyle = (hasItems) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 10px",
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 8,
  border: `1.5px solid ${hasItems ? "var(--brand)" : "#e5d5c8"}`,
  background: hasItems ? "rgba(164,0,93,0.05)" : "transparent",
  color: hasItems ? "var(--brand)" : "var(--text-muted)",
  cursor: "pointer",
  transition: "all 0.15s",
  textAlign: "left",
});

const removeSmallBtn = {
  padding: "4px 7px",
  fontSize: 11,
  borderRadius: 6,
  border: "1px solid #fca5a5",
  background: "transparent",
  color: "#dc2626",
  cursor: "pointer",
  flexShrink: 0,
};

const addSmallBtn = {
  marginTop: 4,
  fontSize: 12,
  fontWeight: 600,
  color: "var(--brand)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 0,
};

export default function BulkAddMenuPage() {
  const [items, setItems] = useState([EMPTY_ITEM()]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(0);

  const addRow = () => setItems((prev) => [...prev, EMPTY_ITEM()]);

  const duplicateRow = (idx) => {
    const copy = { ...items[idx], options: [...items[idx].options], addons: [...items[idx].addons], expanded: true };
    setItems((prev) => [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)]);
  };

  const removeRow = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleChange = (idx, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const completedCount = items.filter((i) => i.name && i.category && i.price).length;

  const handleSave = async () => {
    setSaving(true);
    try {
      const created = [];
      for (const item of items) {
        if (!item.name || !item.category || !item.price) continue;
        const res = await createMenuItem(item);
        created.push(res.item);
      }
      setSaved(created.length);
      alert(`${created.length} item${created.length !== 1 ? "s" : ""} added successfully!`);
      setItems([EMPTY_ITEM()]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg-primary)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #e5d5c8",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-serif)" }}>
              Bulk Add Menu Items
            </h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
              {items.length} item{items.length !== 1 ? "s" : ""} &nbsp;·&nbsp;{" "}
              <span style={{ color: completedCount === items.length && items.length > 0 ? "#16a34a" : "var(--brand)", fontWeight: 600 }}>
                {completedCount} ready to save
              </span>
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={addRow}
              style={{
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 8,
                border: "2px solid var(--brand)",
                background: "transparent",
                color: "var(--brand)",
                cursor: "pointer",
              }}
            >
              + Add Item
            </button>
            <button
              onClick={handleSave}
              disabled={saving || completedCount === 0}
              style={{
                padding: "8px 20px",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 8,
                border: "none",
                background: completedCount === 0 ? "#d4b8a8" : "var(--brand)",
                color: "#fff",
                cursor: completedCount === 0 ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {saving ? "Saving…" : `Save ${completedCount > 0 ? completedCount : ""} Item${completedCount !== 1 ? "s" : ""}`}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {items.length > 0 && (
          <div style={{ height: 3, background: "#e5d5c8" }}>
            <div
              style={{
                height: "100%",
                width: `${(completedCount / items.length) * 100}%`,
                background: "var(--brand)",
                transition: "width 0.3s",
              }}
            />
          </div>
        )}

        {/* Cards */}
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 24px 80px" }}>
          {/* Hint banner */}
          {items.length === 1 && !items[0].name && (
            <div
              style={{
                background: "rgba(164,0,93,0.06)",
                border: "1px dashed var(--brand-soft)",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 16,
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 20 }}>💡</span>
              <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>
                Fill in <strong>Name</strong>, <strong>Category</strong>, and <strong>Price</strong> to mark an item ready.
                Use <strong>⧉</strong> to duplicate an item, and <strong>+ Add Item</strong> for more rows.
              </p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {items.map((item, idx) => (
              <ItemCard
                key={idx}
                item={item}
                idx={idx}
                onChange={handleChange}
                onRemove={removeRow}
                onDuplicate={duplicateRow}
                total={items.length}
              />
            ))}
          </div>

          {/* Bottom Add button */}
          <button
            onClick={addRow}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "12px",
              borderRadius: 10,
              border: "2px dashed #c9b0a0",
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "var(--brand)";
              e.currentTarget.style.color = "var(--brand)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#c9b0a0";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            + Add Another Item
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}