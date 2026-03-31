import { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { createMenuItem } from "../../../services/menu.service";

const EMPTY_ITEM = () => ({
  name: "", category: "", price: "", description: "",
  isVeg: true, image: "", options: [], addons: [],
});

const CATEGORIES = [
  "Starters", "Main Course", "Breads", "Rice & Biryani",
  "Desserts", "Beverages", "Sides", "Specials",
];

const VegDot = ({ isVeg }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 14, height: 14,
    border: `1.5px solid ${isVeg ? "#16a34a" : "#dc2626"}`,
    borderRadius: 3, flexShrink: 0,
  }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: isVeg ? "#16a34a" : "#dc2626" }} />
  </span>
);

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".05em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box",
  padding: "8px 10px", fontSize: 13, borderRadius: 6,
  border: "1.5px solid #ddd0c4",
  background: "#fff", color: "var(--text-primary)", outline: "none",
  fontFamily: "var(--font-sans)",
};

function CollapsibleSection({ label, icon, items, onAdd, onRemove, onChange, nameField }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 6,
        padding: "7px 10px", borderRadius: 6,
        border: "1.5px solid #ddd0c4",
        background: open ? "var(--bg-secondary)" : "#fff",
        color: "var(--text-muted)", fontSize: 12, fontWeight: 600,
        cursor: "pointer", fontFamily: "var(--font-sans)", textAlign: "left",
      }}>
        <span>{icon} {label}</span>
        {items.length > 0 && (
          <span style={{
            marginLeft: 4, fontSize: 10, background: "var(--brand)", color: "#fff",
            borderRadius: 10, padding: "1px 6px", fontWeight: 700,
          }}>{items.length}</span>
        )}
        <span style={{ marginLeft: "auto", fontSize: 10, opacity: .5 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{ marginTop: 4, padding: "10px", background: "var(--bg-secondary)", borderRadius: 6, border: "1px solid #ddd0c4" }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
              <input
                value={item[nameField]}
                onChange={e => onChange(i, nameField, e.target.value)}
                placeholder={nameField === "label" ? "e.g. Half / Full" : "e.g. Extra Cheese"}
                style={{ ...inputStyle, flex: 1 }}
              />
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>₹</span>
              <input
                type="number" value={item.price}
                onChange={e => onChange(i, "price", e.target.value)}
                placeholder="0"
                style={{ ...inputStyle, width: 70 }}
              />
              <button type="button" onClick={() => onRemove(i)} style={{
                padding: "4px 8px", fontSize: 11, borderRadius: 5,
                border: "1px solid #fca5a5", background: "transparent",
                color: "#dc2626", cursor: "pointer",
              }}>✕</button>
            </div>
          ))}
          <button type="button" onClick={onAdd} style={{
            fontSize: 12, fontWeight: 600, color: "var(--brand)",
            background: "transparent", border: "none", cursor: "pointer",
            padding: "2px 0", fontFamily: "var(--font-sans)",
          }}>+ Add</button>
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, idx, onChange, onRemove, onDuplicate, isOnly }) {
  const isReady = item.name && item.category && item.price;
  const mutateOptions = fn => onChange(idx, "options", fn(item.options));
  const mutateAddons  = fn => onChange(idx, "addons",  fn(item.addons));

  return (
    <div style={{
      background: "#fff",
      border: `1.5px solid ${isReady ? "rgba(164,0,93,.35)" : "#e0d0c4"}`,
      borderRadius: 10,
      overflow: "hidden",
    }}>
      {/* Card header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 14px",
        background: isReady ? "rgba(164,0,93,.04)" : "var(--bg-secondary)",
        borderBottom: `1px solid ${isReady ? "rgba(164,0,93,.12)" : "#e0d0c4"}`,
      }}>
        <span style={{
          width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
          background: isReady ? "var(--brand)" : "#c4afa2",
          color: "#fff", fontSize: 10, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{idx + 1}</span>

        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: item.name ? "var(--text-primary)" : "#bbaaa0" }}>
          {item.name || "Unnamed item"}
        </span>

        {item.category && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
            background: "rgba(164,0,93,.08)", color: "var(--brand)",
          }}>{item.category}</span>
        )}

        {item.price && (
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>₹{item.price}</span>
        )}

        <VegDot isVeg={item.isVeg} />

        <button type="button" onClick={() => onDuplicate(idx)} title="Duplicate" style={{
          padding: "3px 8px", fontSize: 11, borderRadius: 5,
          border: "1px solid #ddd0c4", background: "transparent",
          color: "var(--text-muted)", cursor: "pointer",
        }}>⧉</button>

        {!isOnly && (
          <button type="button" onClick={() => onRemove(idx)} title="Remove" style={{
            padding: "3px 8px", fontSize: 11, borderRadius: 5,
            border: "1px solid #fca5a5", background: "transparent",
            color: "#dc2626", cursor: "pointer",
          }}>✕</button>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: "14px 14px 12px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Name / Category / Price */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 90px", gap: 10 }}>
          <Field label="Item Name *">
            <input placeholder="e.g. Paneer Tikka" value={item.name}
              onChange={e => onChange(idx, "name", e.target.value)}
              style={{ ...inputStyle, borderColor: item.name ? "rgba(164,0,93,.4)" : "#ddd0c4" }} />
          </Field>
          <Field label="Category *">
            <select value={item.category} onChange={e => onChange(idx, "category", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer", borderColor: item.category ? "rgba(164,0,93,.4)" : "#ddd0c4" }}>
              <option value="">Select…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Price (₹) *">
            <input type="number" placeholder="0" value={item.price}
              onChange={e => onChange(idx, "price", e.target.value)}
              style={{ ...inputStyle, borderColor: item.price ? "rgba(164,0,93,.4)" : "#ddd0c4" }} />
          </Field>
        </div>

        {/* Description / Type */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "start" }}>
          <Field label="Description">
            <textarea placeholder="Short description…" value={item.description}
              onChange={e => onChange(idx, "description", e.target.value)}
              rows={2} style={{ ...inputStyle, resize: "none" }} />
          </Field>
          <Field label="Type">
            <div style={{ display: "flex", gap: 6 }}>
              {[true, false].map(v => (
                <button key={String(v)} type="button" onClick={() => onChange(idx, "isVeg", v)} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  padding: "6px 10px", borderRadius: 6, cursor: "pointer",
                  border: item.isVeg === v
                    ? `2px solid ${v ? "#16a34a" : "#dc2626"}`
                    : "2px solid #e0d0c4",
                  background: item.isVeg === v
                    ? v ? "rgba(22,163,74,.07)" : "rgba(220,38,38,.07)"
                    : "transparent",
                }}>
                  <VegDot isVeg={v} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: v ? "#16a34a" : "#dc2626" }}>
                    {v ? "Veg" : "Non-Veg"}
                  </span>
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* Image URL */}
        <Field label="Image URL">
          <input placeholder="https://…" value={item.image}
            onChange={e => onChange(idx, "image", e.target.value)} style={inputStyle} />
        </Field>

        {/* Portion Options / Add-ons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <CollapsibleSection
            label="Portion Options" icon="⚙"
            items={item.options}
            onAdd={() => mutateOptions(opts => [...opts, { label: "", price: "" }])}
            onRemove={i => mutateOptions(opts => opts.filter((_, j) => j !== i))}
            onChange={(i, f, v) => mutateOptions(opts => opts.map((o, j) => j === i ? { ...o, [f]: v } : o))}
            nameField="label"
          />
          <CollapsibleSection
            label="Add-ons" icon="＋"
            items={item.addons}
            onAdd={() => mutateAddons(ads => [...ads, { name: "", price: "" }])}
            onRemove={i => mutateAddons(ads => ads.filter((_, j) => j !== i))}
            onChange={(i, f, v) => mutateAddons(ads => ads.map((a, j) => j === i ? { ...a, [f]: v } : a))}
            nameField="name"
          />
        </div>
      </div>
    </div>
  );
}

export default function BulkAddMenuPage() {
  const [items, setItems] = useState([EMPTY_ITEM()]);
  const [saving, setSaving] = useState(false);

  const addRow       = () => setItems(p => [...p, EMPTY_ITEM()]);
  const duplicateRow = idx => setItems(p => [
    ...p.slice(0, idx + 1),
    { ...p[idx], options: [...p[idx].options], addons: [...p[idx].addons] },
    ...p.slice(idx + 1),
  ]);
  const removeRow    = idx => setItems(p => p.filter((_, i) => i !== idx));
  const handleChange = (idx, field, value) =>
    setItems(p => p.map((item, i) => i === idx ? { ...item, [field]: value } : item));

  const readyCount = items.filter(i => i.name && i.category && i.price).length;

  const handleSave = async () => {
    setSaving(true);
    try {
      const created = [];
      for (const item of items) {
        if (!item.name || !item.category || !item.price) continue;
        const res = await createMenuItem(item);
        created.push(res.item);
      }
      alert(`${created.length} item${created.length !== 1 ? "s" : ""} added!`);
      setItems([EMPTY_ITEM()]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", fontFamily: "var(--font-sans)" }}>

        {/* Sticky header */}
        <div style={{
          position: "sticky", top: 0, zIndex: 10,
          background: "#fff",
          borderBottom: "1px solid #e0d0c4",
          padding: "0 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 56,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>
              Bulk Add Menu Items
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>
              {items.length} item{items.length !== 1 ? "s" : ""}
              <span style={{ margin: "0 5px", opacity: .4 }}>·</span>
              <span style={{ color: readyCount > 0 ? "var(--brand)" : "var(--text-muted)", fontWeight: 600 }}>
                {readyCount} ready to save
              </span>
            </p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addRow} style={{
              padding: "7px 16px", fontSize: 13, fontWeight: 600, borderRadius: 7,
              border: "1.5px solid var(--brand)", background: "transparent",
              color: "var(--brand)", cursor: "pointer",
            }}>+ Add Item</button>

            <button onClick={handleSave} disabled={saving || readyCount === 0} style={{
              padding: "7px 18px", fontSize: 13, fontWeight: 700, borderRadius: 7,
              border: "none",
              background: readyCount === 0 ? "#cfc0b4" : "var(--brand)",
              color: "#fff",
              cursor: readyCount === 0 ? "not-allowed" : "pointer",
            }}>
              {saving ? "Saving…" : `Save ${readyCount > 0 ? readyCount + " " : ""}Item${readyCount !== 1 ? "s" : ""}`}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 2, background: "#e8d8c8" }}>
          <div style={{
            height: "100%",
            width: `${items.length ? (readyCount / items.length) * 100 : 0}%`,
            background: "var(--brand)", transition: "width .3s",
          }} />
        </div>

        {/* Body */}
        <div style={{ maxWidth: 740, margin: "0 auto", padding: "20px 20px 60px" }}>

          {items.length === 1 && !items[0].name && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 14,
              padding: "8px 12px", borderRadius: 7,
              background: "rgba(164,0,93,.04)", border: "1px dashed rgba(164,0,93,.22)",
            }}>
              <span style={{ fontSize: 14 }}>💡</span>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                Fill <strong>Name</strong>, <strong>Category</strong> and <strong>Price</strong> to mark an item ready.
                Use <strong>⧉</strong> to duplicate quickly.
              </p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((item, idx) => (
              <ItemCard key={idx} item={item} idx={idx}
                onChange={handleChange} onRemove={removeRow}
                onDuplicate={duplicateRow} isOnly={items.length === 1} />
            ))}
          </div>

          <button onClick={addRow} style={{
            marginTop: 10, width: "100%", padding: "11px",
            borderRadius: 8, border: "1.5px dashed #c9b0a0",
            background: "transparent", color: "var(--text-muted)",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "var(--font-sans)",
          }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.color = "var(--brand)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "#c9b0a0"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            + Add Another Item
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}