import { useState } from "react";
import { createMenuItem } from "../../../services/menu.service";

const CATEGORIES = ["Starters", "Main Course", "Breads", "Rice & Biryani", "Soups", "Salads", "Desserts", "Beverages", "Snacks", "Other"];

const emptyItem = () => ({
  name: "", category: "", price: "", description: "",
  isVeg: true, image: "", options: [], addons: []
});

function VegIcon({ isVeg }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 18, height: 18, borderRadius: 3,
      border: `2px solid ${isVeg ? "#16a34a" : "#dc2626"}`,
      flexShrink: 0,
    }}>
      <span style={{
        width: 9, height: 9, borderRadius: "50%",
        background: isVeg ? "#16a34a" : "#dc2626",
      }} />
    </span>
  );
}

function ItemCard({ item, idx, total, onChange, onOptionChange, addOption, removeOption, onAddonChange, addAddon, removeAddon, onRemove }) {
  const [expanded, setExpanded] = useState(true);
  const isComplete = item.name && item.category && item.price;

  return (
    <div style={{
      border: `1.5px solid ${isComplete ? "rgba(164,0,93,0.18)" : "rgba(220,38,38,0.18)"}`,
      borderRadius: 16,
      background: "linear-gradient(to bottom, rgba(255,251,248,0.98), rgba(250,244,235,0.95))",
      boxShadow: "0 2px 12px rgba(26,20,16,0.06)",
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}>

      {/* Card Header */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px",
          cursor: "pointer",
          background: expanded ? "rgba(164,0,93,0.04)" : "transparent",
          borderBottom: expanded ? "1px solid rgba(164,0,93,0.08)" : "none",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: isComplete ? "rgba(164,0,93,0.1)" : "rgba(220,38,38,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700,
            color: isComplete ? "#A4005D" : "#dc2626",
            flexShrink: 0,
          }}>
            {idx + 1}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1410" }}>
              {item.name || <span style={{ color: "#aaa", fontWeight: 400 }}>Untitled item</span>}
            </div>
            {item.name && (
              <div style={{ fontSize: 11, color: "#8a7a70", marginTop: 1 }}>
                {[item.category, item.price && `₹${item.price}`].filter(Boolean).join(" · ") || "Fill details below"}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!isComplete && (
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",
              color: "#dc2626", background: "rgba(220,38,38,0.08)",
              border: "1px solid rgba(220,38,38,0.2)",
              borderRadius: 6, padding: "2px 7px",
            }}>Incomplete</span>
          )}
          {isComplete && (
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",
              color: "#16a34a", background: "rgba(22,163,74,0.08)",
              border: "1px solid rgba(22,163,74,0.2)",
              borderRadius: 6, padding: "2px 7px",
            }}>Ready</span>
          )}
          {total > 1 && (
            <button
              onClick={e => { e.stopPropagation(); onRemove(); }}
              style={{
                background: "none", border: "1px solid rgba(220,38,38,0.25)",
                color: "#dc2626", borderRadius: 8, width: 28, height: 28,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: 15, flexShrink: 0,
              }}
              title="Remove item"
            >×</button>
          )}
          <span style={{ color: "#A4005D", fontSize: 16, transition: "transform 0.2s", display: "inline-block", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
        </div>
      </div>

      {/* Card Body */}
      {expanded && (
        <div style={{ padding: "18px 16px 16px" }}>

          {/* Row 1: Core Fields */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: "#A4005D", marginBottom: 8, opacity: 0.8 }}>
              Basic Info <span style={{ color: "#dc2626" }}>*</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 1fr", gap: 10 }}>
              <div>
                <label style={labelStyle}>Item Name <span style={{ color: "#dc2626" }}>*</span></label>
                <input
                  placeholder="e.g. Paneer Butter Masala"
                  value={item.name}
                  onChange={e => onChange("name", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Category <span style={{ color: "#dc2626" }}>*</span></label>
                <select value={item.category} onChange={e => onChange("category", e.target.value)} style={inputStyle}>
                  <option value="">Select…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Price (₹) <span style={{ color: "#dc2626" }}>*</span></label>
                <input
                  type="number" placeholder="0"
                  value={item.price}
                  onChange={e => onChange("price", e.target.value)}
                  style={inputStyle}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Description + Veg toggle + Image */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: "#8a7a70", marginBottom: 8 }}>
              Details
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "start" }}>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  placeholder="Short description of the dish…"
                  value={item.description}
                  onChange={e => onChange("description", e.target.value)}
                  rows={2}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 18 }}>
                {/* Veg / Non-Veg toggle */}
                <button
                  type="button"
                  onClick={() => onChange("isVeg", !item.isVeg)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 14px", borderRadius: 10, cursor: "pointer",
                    border: `1.5px solid ${item.isVeg ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)"}`,
                    background: item.isVeg ? "rgba(22,163,74,0.06)" : "rgba(220,38,38,0.06)",
                    transition: "all 0.2s", whiteSpace: "nowrap",
                  }}
                >
                  <VegIcon isVeg={item.isVeg} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: item.isVeg ? "#16a34a" : "#dc2626" }}>
                    {item.isVeg ? "Veg" : "Non-Veg"}
                  </span>
                </button>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={labelStyle}>Image URL <span style={{ color: "#8a7a70", fontWeight: 400 }}>(optional)</span></label>
              <input
                placeholder="https://…"
                value={item.image}
                onChange={e => onChange("image", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Options */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: "#8a7a70" }}>Size Options</span>
                <span style={{ fontSize: 10, color: "#aaa", marginLeft: 6 }}>e.g. Half / Full / Large</span>
              </div>
              <button type="button" onClick={addOption} style={smallAddBtn}>+ Add Option</button>
            </div>
            {item.options.length === 0 ? (
              <div style={{ fontSize: 11, color: "#aaa", fontStyle: "italic", padding: "8px 0" }}>No options added — item has a single fixed price.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {item.options.map((opt, optIdx) => (
                  <div key={optIdx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <input
                        placeholder="Label (e.g. Half)"
                        value={opt.label}
                        onChange={e => onOptionChange(optIdx, "label", e.target.value)}
                        style={{ ...inputStyle, marginBottom: 0 }}
                      />
                    </div>
                    <div style={{ width: 90 }}>
                      <input
                        type="number" placeholder="₹ Price"
                        value={opt.price}
                        onChange={e => onOptionChange(optIdx, "price", e.target.value)}
                        style={{ ...inputStyle, marginBottom: 0 }}
                      />
                    </div>
                    <button onClick={() => removeOption(optIdx)} style={removeBtn} title="Remove">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Addons */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: "#8a7a70" }}>Add-ons</span>
                <span style={{ fontSize: 10, color: "#aaa", marginLeft: 6 }}>e.g. Extra Cheese, Sauce</span>
              </div>
              <button type="button" onClick={addAddon} style={smallAddBtn}>+ Add Add-on</button>
            </div>
            {item.addons.length === 0 ? (
              <div style={{ fontSize: 11, color: "#aaa", fontStyle: "italic", padding: "8px 0" }}>No add-ons for this item.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {item.addons.map((addon, addonIdx) => (
                  <div key={addonIdx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <input
                        placeholder="Name (e.g. Extra Cheese)"
                        value={addon.name}
                        onChange={e => onAddonChange(addonIdx, "name", e.target.value)}
                        style={{ ...inputStyle, marginBottom: 0 }}
                      />
                    </div>
                    <div style={{ width: 90 }}>
                      <input
                        type="number" placeholder="₹ Price"
                        value={addon.price}
                        onChange={e => onAddonChange(addonIdx, "price", e.target.value)}
                        style={{ ...inputStyle, marginBottom: 0 }}
                      />
                    </div>
                    <button onClick={() => removeAddon(addonIdx)} style={removeBtn} title="Remove">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

// Shared styles
const labelStyle = {
  display: "block", fontSize: 10, fontWeight: 600,
  color: "#6b5a50", marginBottom: 4, letterSpacing: ".02em",
};
const inputStyle = {
  width: "100%", fontSize: 13, color: "#1a1410",
  border: "1.2px solid rgba(164,0,93,0.14)",
  borderRadius: 10, padding: "8px 11px",
  background: "rgba(255,255,255,0.85)",
  outline: "none", fontFamily: "inherit",
  transition: "border-color 0.18s",
  marginBottom: 0,
};
const smallAddBtn = {
  fontSize: 11, fontWeight: 600, color: "#A4005D",
  background: "rgba(164,0,93,0.07)",
  border: "1px solid rgba(164,0,93,0.18)",
  borderRadius: 8, padding: "5px 12px",
  cursor: "pointer", whiteSpace: "nowrap",
};
const removeBtn = {
  width: 28, height: 28, borderRadius: 8,
  border: "1px solid rgba(220,38,38,0.25)",
  background: "rgba(220,38,38,0.05)",
  color: "#dc2626", fontSize: 16, lineHeight: 1,
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", flexShrink: 0,
};

export default function BulkAddMenuModal({ onClose, onSaved }) {
  const [items, setItems] = useState([emptyItem()]);
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const addRow = () => setItems(prev => [...prev, emptyItem()]);
  const removeRow = idx => setItems(prev => prev.filter((_, i) => i !== idx));

  const handleChange = (idx, field, value) => {
    setItems(prev => {
      const u = [...prev];
      u[idx] = { ...u[idx], [field]: value };
      return u;
    });
  };

  const handleOptionChange = (idx, optIdx, field, value) => {
    setItems(prev => {
      const u = [...prev];
      const opts = [...u[idx].options];
      opts[optIdx] = { ...opts[optIdx], [field]: value };
      u[idx] = { ...u[idx], options: opts };
      return u;
    });
  };
  const addOption = idx => {
    setItems(prev => {
      const u = [...prev];
      u[idx] = { ...u[idx], options: [...u[idx].options, { label: "", price: "" }] };
      return u;
    });
  };
  const removeOption = (idx, optIdx) => {
    setItems(prev => {
      const u = [...prev];
      u[idx] = { ...u[idx], options: u[idx].options.filter((_, i) => i !== optIdx) };
      return u;
    });
  };

  const handleAddonChange = (idx, addonIdx, field, value) => {
    setItems(prev => {
      const u = [...prev];
      const ads = [...u[idx].addons];
      ads[addonIdx] = { ...ads[addonIdx], [field]: value };
      u[idx] = { ...u[idx], addons: ads };
      return u;
    });
  };
  const addAddon = idx => {
    setItems(prev => {
      const u = [...prev];
      u[idx] = { ...u[idx], addons: [...u[idx].addons, { name: "", price: "" }] };
      return u;
    });
  };
  const removeAddon = (idx, addonIdx) => {
    setItems(prev => {
      const u = [...prev];
      u[idx] = { ...u[idx], addons: u[idx].addons.filter((_, i) => i !== addonIdx) };
      return u;
    });
  };

  const readyCount = items.filter(i => i.name && i.category && i.price).length;

  const handleSave = async () => {
    setSaving(true);
    setSavedCount(0);
    try {
      const created = [];
      for (const item of items) {
        if (!item.name || !item.category || !item.price) continue;
        const res = await createMenuItem(item);
        created.push(res.item);
        setSavedCount(c => c + 1);
      }
      onSaved(created);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .bam-input:focus { border-color: rgba(164,0,93,0.45) !important; box-shadow: 0 0 0 3px rgba(164,0,93,0.08); }
        .bam-overlay { animation: bamFadeIn .18s ease; }
        @keyframes bamFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .bam-modal { animation: bamSlideUp .24s cubic-bezier(.22,1,.36,1); }
        @keyframes bamSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Overlay */}
      <div className="bam-overlay" style={{
        position: "fixed", inset: 0,
        background: "rgba(20,10,5,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 50, padding: "16px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        <div className="bam-modal" style={{
          width: "100%", maxWidth: 680,
          maxHeight: "92vh",
          display: "flex", flexDirection: "column",
          background: "linear-gradient(160deg, #f7ede0 0%, #eddfc5 100%)",
          borderRadius: 22,
          boxShadow: "0 24px 64px rgba(20,10,5,0.28), 0 4px 16px rgba(20,10,5,0.14)",
          overflow: "hidden",
        }}>

          {/* ── HEADER ── */}
          <div style={{
            padding: "20px 24px 18px",
            background: "linear-gradient(135deg, #A4005D, #7B2D8B)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-.01em" }}>
                  Bulk Add Menu Items
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.72)" }}>
                  Fill in each item below. Name, Category &amp; Price are required.
                </p>
              </div>
              <button onClick={onClose} style={{
                background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff", borderRadius: 10, width: 34, height: 34,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: 18, flexShrink: 0, marginLeft: 12,
              }}>×</button>
            </div>

            {/* Progress pills */}
            <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center" }}>
              <div style={{
                flex: 1, height: 6, borderRadius: 4,
                background: "rgba(255,255,255,0.2)", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: 4,
                  width: `${items.length === 0 ? 0 : (readyCount / items.length) * 100}%`,
                  background: "#86efac",
                  transition: "width 0.4s cubic-bezier(.22,1,.36,1)",
                }} />
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: 600, whiteSpace: "nowrap" }}>
                {readyCount} / {items.length} ready
              </span>
            </div>
          </div>

          {/* ── SCROLLABLE ITEMS ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px 8px", display: "flex", flexDirection: "column", gap: 12 }}>

            {items.map((item, idx) => (
              <ItemCard
                key={idx}
                item={item}
                idx={idx}
                total={items.length}
                onChange={(field, value) => handleChange(idx, field, value)}
                onOptionChange={(optIdx, field, value) => handleOptionChange(idx, optIdx, field, value)}
                addOption={() => addOption(idx)}
                removeOption={(optIdx) => removeOption(idx, optIdx)}
                onAddonChange={(addonIdx, field, value) => handleAddonChange(idx, addonIdx, field, value)}
                addAddon={() => addAddon(idx)}
                removeAddon={(addonIdx) => removeAddon(idx, addonIdx)}
                onRemove={() => removeRow(idx)}
              />
            ))}

            {/* Add another item */}
            <button onClick={addRow} style={{
              width: "100%", padding: "13px",
              border: "1.5px dashed rgba(164,0,93,0.28)",
              borderRadius: 14, background: "rgba(164,0,93,0.03)",
              color: "#A4005D", fontSize: 13, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 6,
              transition: "background 0.18s, border-color 0.18s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(164,0,93,0.07)"; e.currentTarget.style.borderColor = "rgba(164,0,93,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(164,0,93,0.03)"; e.currentTarget.style.borderColor = "rgba(164,0,93,0.28)"; }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
              Add Another Item
            </button>

          </div>

          {/* ── FOOTER ── */}
          <div style={{
            padding: "14px 20px 18px",
            borderTop: "1px solid rgba(164,0,93,0.1)",
            background: "rgba(245,232,210,0.7)",
            backdropFilter: "blur(8px)",
            flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <div style={{ fontSize: 11, color: "#8a7a70" }}>
              {readyCount === 0
                ? "Fill at least one item to save"
                : `${readyCount} item${readyCount > 1 ? "s" : ""} will be saved`}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{
                padding: "9px 20px", borderRadius: 10,
                border: "1.2px solid rgba(164,0,93,0.2)",
                background: "transparent", color: "#5a4040",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
              }}>Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || readyCount === 0}
                style={{
                  padding: "9px 24px", borderRadius: 10,
                  background: readyCount === 0 ? "rgba(164,0,93,0.3)" : "linear-gradient(135deg, #A4005D, #7B2D8B)",
                  color: "#fff", border: "none",
                  fontSize: 13, fontWeight: 600,
                  cursor: readyCount === 0 ? "not-allowed" : "pointer",
                  boxShadow: readyCount > 0 ? "0 4px 14px rgba(164,0,93,0.28)" : "none",
                  transition: "all 0.18s",
                  display: "flex", alignItems: "center", gap: 7,
                }}
              >
                {saving ? (
                  <>
                    <span style={{
                      width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)",
                      borderTop: "2px solid #fff", borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin .7s linear infinite",
                    }} />
                    Saving {savedCount}/{readyCount}…
                  </>
                ) : (
                  <>Save {readyCount > 0 ? `${readyCount} ` : ""}Item{readyCount !== 1 ? "s" : ""}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}