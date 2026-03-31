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
});

const CATEGORIES = [
  "Starters", "Main Course", "Breads", "Rice & Biryani",
  "Desserts", "Beverages", "Sides", "Specials",
];

const VegDot = ({ isVeg }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 16, height: 16, border: `1.5px solid ${isVeg ? "#16a34a" : "#dc2626"}`,
    borderRadius: 3, flexShrink: 0,
  }}>
    <span style={{
      width: 7, height: 7, borderRadius: "50%",
      background: isVeg ? "#16a34a" : "#dc2626",
    }} />
  </span>
);

function CollapsibleSection({ label, icon, items, onAdd, onRemove, onChange, nameField }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 6,
        padding: "6px 10px", borderRadius: 7,
        border: `1.5px solid ${items.length ? "var(--brand)" : "#ddd0c4"}`,
        background: items.length ? "rgba(164,0,93,.04)" : "transparent",
        color: items.length ? "var(--brand)" : "var(--text-muted)",
        fontSize: 12, fontWeight: 600, cursor: "pointer",
        fontFamily: "var(--font-sans)", textAlign: "left",
      }}>
        <span>{icon} {label}</span>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
          {items.length > 0 && (
            <span style={{
              fontSize: 10, background: "var(--brand)", color: "#fff",
              borderRadius: 10, padding: "1px 6px", fontWeight: 700,
            }}>{items.length}</span>
          )}
          <span style={{ fontSize: 10, opacity: .5 }}>{open ? "▲" : "▼"}</span>
        </span>
      </button>
      {open && (
        <div style={{ marginTop: 6, padding: "10px 10px 6px", background: "#f9f3ec", borderRadius: 8, border: "1px solid #e5d5c8" }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
              <input
                value={item[nameField]}
                onChange={e => onChange(i, nameField, e.target.value)}
                placeholder={nameField === "label" ? "e.g. Half, Full" : "e.g. Extra Cheese"}
                style={subInp}
              />
              <span style={{ color: "var(--text-muted)", fontSize: 12, flexShrink: 0 }}>₹</span>
              <input
                type="number" value={item.price}
                onChange={e => onChange(i, "price", e.target.value)}
                placeholder="0"
                style={{ ...subInp, width: 64 }}
              />
              <button type="button" onClick={() => onRemove(i)} style={removeBtn}>✕</button>
            </div>
          ))}
          <button type="button" onClick={onAdd} style={addInlineBtn}>+ Add</button>
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, idx, onChange, onRemove, onDuplicate, isOnly }) {
  const isReady = item.name && item.category && item.price;

  const mutateOptions = fn => onChange(idx, "options", fn(item.options));
  const mutateAddons = fn => onChange(idx, "addons", fn(item.addons));

  return (
    <div style={{
      background: "#fff",
      border: `1.5px solid ${isReady ? "rgba(164,0,93,.3)" : "#e5d5c8"}`,
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: isReady ? "0 2px 10px rgba(164,0,93,.06)" : "0 1px 3px rgba(0,0,0,.04)",
      transition: "border-color .2s, box-shadow .2s",
    }}>

      {/* Header row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "9px 12px",
        background: isReady ? "rgba(164,0,93,.03)" : "var(--bg-secondary)",
        borderBottom: `1px solid ${isReady ? "rgba(164,0,93,.1)" : "#ede0d4"}`,
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
            fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
            background: "rgba(164,0,93,.08)", color: "var(--brand)",
          }}>{item.category}</span>
        )}

        {item.price && (
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>₹{item.price}</span>
        )}

        <VegDot isVeg={item.isVeg} />

        <button type="button" onClick={() => onDuplicate(idx)} title="Duplicate"
          style={{ ...actionBtn, color: "var(--text-muted)", borderColor: "#ddd0c4" }}>⧉</button>
        {!isOnly && (
          <button type="button" onClick={() => onRemove(idx)} title="Remove"
            style={{ ...actionBtn, color: "#dc2626", borderColor: "#fca5a5" }}>✕</button>
        )}
      </div>

      {/* Fields */}
      <div style={{ padding: "12px 14px 10px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Name + Category + Price */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 170px 90px", gap: 8 }}>
          <Field label="Item Name *">
            <input placeholder="e.g. Paneer Tikka" value={item.name}
              onChange={e => onChange(idx, "name", e.target.value)} style={inp(!!item.name)} />
          </Field>
          <Field label="Category *">
            <select value={item.category} onChange={e => onChange(idx, "category", e.target.value)}
              style={{ ...inp(!!item.category), cursor: "pointer" }}>
              <option value="">Select…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Price (₹) *">
            <input type="number" placeholder="0" value={item.price}
              onChange={e => onChange(idx, "price", e.target.value)} style={inp(!!item.price)} />
          </Field>
        </div>

        {/* Description + Veg/Non-Veg */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "start" }}>
          <Field label="Description">
            <textarea placeholder="Short description…" value={item.description}
              onChange={e => onChange(idx, "description", e.target.value)}
              rows={2} style={{ ...inp(!!item.description), resize: "none" }} />
          </Field>
          <Field label="Type">
            <div style={{ display: "flex", gap: 5 }}>
              {[true, false].map(v => (
                <button key={String(v)} type="button" onClick={() => onChange(idx, "isVeg", v)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                    padding: "6px 10px", borderRadius: 7,
                    border: item.isVeg === v
                      ? `2px solid ${v ? "#16a34a" : "#dc2626"}`
                      : "2px solid #e5d5c8",
                    background: item.isVeg === v
                      ? v ? "rgba(22,163,74,.07)" : "rgba(220,38,38,.07)"
                      : "transparent",
                    cursor: "pointer",
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
            onChange={e => onChange(idx, "image", e.target.value)} style={inp(!!item.image)} />
        </Field>

        {/* Options + Addons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <CollapsibleSection
            label="Portion Options" icon="⚙"
            items={item.options}
            onAdd={() => mutateOptions(opts => [...opts, { label: "", price: "" }])}
            onRemove={i => mutateOptions(opts => opts.filter((_, j) => j !== i))}
            onChange={(i, field, val) => mutateOptions(opts => opts.map((o, j) => j === i ? { ...o, [field]: val } : o))}
            nameField="label"
          />
          <CollapsibleSection
            label="Add-ons" icon="＋"
            items={item.addons}
            onAdd={() => mutateAddons(ads => [...ads, { name: "", price: "" }])}
            onRemove={i => mutateAddons(ads => ads.filter((_, j) => j !== i))}
            onChange={(i, field, val) => mutateAddons(ads => ads.map((a, j) => j === i ? { ...a, [field]: val } : a))}
            nameField="name"
          />
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, children }) => (
  <div>
    <label style={{
      display: "block", fontSize: 10, fontWeight: 700, color: "var(--text-muted)",
      marginBottom: 3, textTransform: "uppercase", letterSpacing: ".06em",
    }}>{label}</label>
    {children}
  </div>
);

const inp = filled => ({
  width: "100%", boxSizing: "border-box",
  padding: "7px 9px", fontSize: 13, borderRadius: 7,
  border: `1.5px solid ${filled ? "rgba(164,0,93,.4)" : "#ddd0c4"}`,
  background: filled ? "rgba(164,0,93,.02)" : "#fff",
  color: "var(--text-primary)", outline: "none",
  fontFamily: "var(--font-sans)", transition: "border-color .15s",
});

const subInp = {
  flex: 1, boxSizing: "border-box", padding: "5px 8px",
  fontSize: 12, borderRadius: 6, border: "1.5px solid #ddd0c4",
  background: "#fff", color: "var(--text-primary)", outline: "none",
  fontFamily: "var(--font-sans)",
};

const actionBtn = {
  padding: "3px 7px", fontSize: 11, borderRadius: 5,
  border: "1px solid", background: "transparent", cursor: "pointer",
};

const removeBtn = {
  padding: "3px 6px", fontSize: 10, borderRadius: 5,
  border: "1px solid #fca5a5", background: "transparent",
  color: "#dc2626", cursor: "pointer", flexShrink: 0,
};

const addInlineBtn = {
  fontSize: 11, fontWeight: 600, color: "var(--brand)",
  background: "transparent", border: "none", cursor: "pointer",
  padding: "2px 0", fontFamily: "var(--font-sans)",
};

export default function BulkAddMenuPage() {
  const [items, setItems] = useState([EMPTY_ITEM()]);
  const [saving, setSaving] = useState(false);

  const addRow = () => setItems(p => [...p, EMPTY_ITEM()]);
  const duplicateRow = idx => setItems(p => [
    ...p.slice(0, idx + 1),
    { ...p[idx], options: [...p[idx].options], addons: [...p[idx].addons] },
    ...p.slice(idx + 1),
  ]);
  const removeRow = idx => setItems(p => p.filter((_, i) => i !== idx));
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
          background: "#fff", borderBottom: "1px solid #e5d5c8",
          padding: "0 28px", display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 58,
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-serif)" }}>
              Bulk Add Menu Items
            </h1>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
              {items.length} item{items.length !== 1 ? "s" : ""}
              <span style={{ margin: "0 5px", opacity: .4 }}>·</span>
              <span style={{ color: readyCount > 0 ? "var(--brand)" : "var(--text-muted)", fontWeight: 600 }}>
                {readyCount} ready to save
              </span>
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addRow} style={{
              padding: "7px 14px", fontSize: 13, fontWeight: 600, borderRadius: 7,
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
        <div style={{ height: 2, background: "#ead9c9" }}>
          <div style={{
            height: "100%",
            width: `${items.length ? (readyCount / items.length) * 100 : 0}%`,
            background: "var(--brand)", transition: "width .3s",
          }} />
        </div>

        {/* Content */}
        <div style={{ maxWidth: 740, margin: "0 auto", padding: "18px 20px 60px" }}>

          {items.length === 1 && !items[0].name && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12,
              padding: "8px 12px", borderRadius: 8,
              background: "rgba(164,0,93,.04)", border: "1px dashed rgba(164,0,93,.25)",
            }}>
              <span style={{ fontSize: 14 }}>💡</span>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                Fill <strong>Name</strong>, <strong>Category</strong> and <strong>Price</strong> to mark an item ready.
                Use <strong>⧉</strong> to duplicate an item quickly.
              </p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map((item, idx) => (
              <ItemCard key={idx} item={item} idx={idx}
                onChange={handleChange} onRemove={removeRow}
                onDuplicate={duplicateRow} isOnly={items.length === 1} />
            ))}
          </div>

          <button
            onClick={addRow}
            style={{
              marginTop: 12, width: "100%", padding: "10px",
              borderRadius: 9, border: "1.5px dashed #c9b0a0",
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