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

/* ── tiny inline styles ── */
const css = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg,#0d0d0d 0%,#1a0a0a 50%,#0d0d0d 100%)",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#f0e6d3",
  },
  stickyBar: {
    position: "sticky", top: 0, zIndex: 20,
    background: "rgba(10,5,5,0.85)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    borderBottom: "1px solid rgba(212,163,115,0.18)",
    padding: "0 32px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    height: 64,
  },
  titleBlock: { display: "flex", flexDirection: "column", gap: 2 },
  h1: {
    margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-.02em",
    background: "linear-gradient(90deg,#e8c98a,#c8883a)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  subtitle: { margin: 0, fontSize: 11, color: "rgba(240,230,211,0.4)", letterSpacing: ".04em" },
  readyBadge: (n) => ({
    fontSize: 11, fontWeight: 700, letterSpacing: ".04em",
    color: n > 0 ? "#e8c98a" : "rgba(240,230,211,0.3)",
  }),
  btnAdd: {
    padding: "8px 18px", fontSize: 12, fontWeight: 700,
    letterSpacing: ".06em", textTransform: "uppercase",
    borderRadius: 6, border: "1.5px solid rgba(212,163,115,0.5)",
    background: "transparent", color: "#d4a373", cursor: "pointer",
    transition: "all .2s",
  },
  btnSave: (disabled) => ({
    padding: "8px 22px", fontSize: 12, fontWeight: 700,
    letterSpacing: ".06em", textTransform: "uppercase",
    borderRadius: 6, border: "none",
    background: disabled
      ? "rgba(255,255,255,0.06)"
      : "linear-gradient(135deg,#c8883a,#e8c98a)",
    color: disabled ? "rgba(255,255,255,0.2)" : "#1a0a0a",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all .2s",
    boxShadow: disabled ? "none" : "0 4px 18px rgba(200,136,58,0.35)",
  }),
  progressTrack: {
    height: 2, background: "rgba(212,163,115,0.1)",
  },
  progressBar: (pct) => ({
    height: "100%", width: `${pct}%`,
    background: "linear-gradient(90deg,#c8883a,#e8c98a)",
    transition: "width .4s cubic-bezier(.4,0,.2,1)",
  }),
  content: {
    maxWidth: 800, margin: "0 auto", padding: "24px 20px 80px",
  },
  hint: {
    display: "flex", alignItems: "flex-start", gap: 10,
    padding: "10px 14px", borderRadius: 8, marginBottom: 16,
    background: "rgba(212,163,115,0.06)",
    border: "1px dashed rgba(212,163,115,0.2)",
  },
  hintText: {
    margin: 0, fontSize: 12, color: "rgba(240,230,211,0.5)", lineHeight: 1.6,
  },
  card: (ready) => ({
    borderRadius: 12,
    border: `1px solid ${ready ? "rgba(212,163,115,0.4)" : "rgba(255,255,255,0.07)"}`,
    background: ready
      ? "linear-gradient(145deg,rgba(200,136,58,0.06),rgba(20,10,5,0.9))"
      : "rgba(255,255,255,0.03)",
    backdropFilter: "blur(8px)",
    overflow: "hidden",
    transition: "border-color .25s, box-shadow .25s",
    boxShadow: ready ? "0 0 0 1px rgba(212,163,115,0.1), 0 8px 32px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.3)",
    marginBottom: 12,
  }),
  cardHeader: (ready) => ({
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 16px",
    background: ready ? "rgba(200,136,58,0.08)" : "rgba(255,255,255,0.02)",
    borderBottom: `1px solid ${ready ? "rgba(212,163,115,0.15)" : "rgba(255,255,255,0.05)"}`,
  }),
  indexBadge: (ready) => ({
    width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
    background: ready ? "linear-gradient(135deg,#c8883a,#e8c98a)" : "rgba(255,255,255,0.08)",
    color: ready ? "#1a0a0a" : "rgba(240,230,211,0.3)",
    fontSize: 10, fontWeight: 800, letterSpacing: ".02em",
    display: "flex", alignItems: "center", justifyContent: "center",
  }),
  itemName: (has) => ({
    flex: 1, fontSize: 13, fontWeight: 600, letterSpacing: "-.01em",
    color: has ? "#f0e6d3" : "rgba(240,230,211,0.2)",
  }),
  catChip: {
    fontSize: 9, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase",
    padding: "3px 8px", borderRadius: 20,
    background: "rgba(212,163,115,0.12)", color: "#d4a373",
    border: "1px solid rgba(212,163,115,0.2)",
  },
  priceTag: {
    fontSize: 12, fontWeight: 700, color: "#e8c98a",
  },
  actionBtn: (danger) => ({
    padding: "4px 8px", fontSize: 11, borderRadius: 5,
    border: `1px solid ${danger ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`,
    background: "transparent",
    color: danger ? "#f87171" : "rgba(240,230,211,0.35)",
    cursor: "pointer", transition: "all .15s",
  }),
  cardBody: {
    padding: "14px 16px 12px",
    display: "flex", flexDirection: "column", gap: 12,
  },
  grid3: {
    display: "grid", gridTemplateColumns: "1fr 170px 90px", gap: 10,
  },
  grid2: {
    display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "start",
  },
  gridHalf: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
  },
  label: {
    display: "block", fontSize: 9, fontWeight: 800, letterSpacing: ".1em",
    textTransform: "uppercase", color: "rgba(212,163,115,0.6)", marginBottom: 4,
  },
  inp: (filled) => ({
    width: "100%", boxSizing: "border-box",
    padding: "8px 11px", fontSize: 13, borderRadius: 7,
    border: `1.5px solid ${filled ? "rgba(212,163,115,0.45)" : "rgba(255,255,255,0.09)"}`,
    background: filled ? "rgba(212,163,115,0.05)" : "rgba(255,255,255,0.03)",
    color: "#f0e6d3", outline: "none",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    transition: "border-color .15s, background .15s",
  }),
  vegBtn: (active, isVeg) => ({
    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    padding: "7px 12px", borderRadius: 7, cursor: "pointer",
    border: active
      ? `1.5px solid ${isVeg ? "#22c55e" : "#ef4444"}`
      : "1.5px solid rgba(255,255,255,0.09)",
    background: active
      ? isVeg ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)"
      : "rgba(255,255,255,0.02)",
    transition: "all .15s",
  }),
  vegDot: (isVeg) => ({
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 16, height: 16,
    border: `1.5px solid ${isVeg ? "#22c55e" : "#ef4444"}`,
    borderRadius: 3,
  }),
  dotInner: (isVeg) => ({
    width: 7, height: 7, borderRadius: "50%",
    background: isVeg ? "#22c55e" : "#ef4444",
  }),
  vegLabel: (isVeg) => ({
    fontSize: 9, fontWeight: 800, letterSpacing: ".06em",
    color: isVeg ? "#22c55e" : "#ef4444", textTransform: "uppercase",
  }),
  addAnotherBtn: {
    marginTop: 4, width: "100%", padding: "12px",
    borderRadius: 9, border: "1.5px dashed rgba(212,163,115,0.2)",
    background: "transparent", color: "rgba(212,163,115,0.35)",
    fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: ".06em",
    textTransform: "uppercase", fontFamily: "'DM Sans','Segoe UI',sans-serif",
    transition: "all .2s",
  },
  sectionBtn: (active) => ({
    width: "100%", display: "flex", alignItems: "center", gap: 7,
    padding: "7px 11px", borderRadius: 7,
    border: `1.5px solid ${active ? "rgba(212,163,115,0.4)" : "rgba(255,255,255,0.08)"}`,
    background: active ? "rgba(212,163,115,0.07)" : "transparent",
    color: active ? "#d4a373" : "rgba(240,230,211,0.3)",
    fontSize: 11, fontWeight: 700, cursor: "pointer",
    fontFamily: "'DM Sans','Segoe UI',sans-serif", textAlign: "left",
    letterSpacing: ".04em", textTransform: "uppercase",
    transition: "all .15s",
  }),
  sectionPanel: {
    marginTop: 7, padding: "10px 12px 8px",
    background: "rgba(0,0,0,0.3)", borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.06)",
  },
  subInp: {
    flex: 1, boxSizing: "border-box", padding: "6px 9px",
    fontSize: 12, borderRadius: 6,
    border: "1.5px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)", color: "#f0e6d3", outline: "none",
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
  },
  subRemove: {
    padding: "3px 7px", fontSize: 10, borderRadius: 5,
    border: "1px solid rgba(239,68,68,0.25)", background: "transparent",
    color: "#f87171", cursor: "pointer", flexShrink: 0,
  },
  addInline: {
    fontSize: 11, fontWeight: 700, color: "#d4a373",
    background: "transparent", border: "none", cursor: "pointer",
    padding: "2px 0", fontFamily: "'DM Sans','Segoe UI',sans-serif",
    textTransform: "uppercase", letterSpacing: ".06em",
  },
};

const VegDot = ({ isVeg }) => (
  <span style={css.vegDot(isVeg)}>
    <span style={css.dotInner(isVeg)} />
  </span>
);

function CollapsibleSection({ label, icon, items, onAdd, onRemove, onChange, nameField }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen(o => !o)} style={css.sectionBtn(items.length > 0)}>
        <span>{icon}</span>
        <span style={{ flex: 1 }}>{label}</span>
        {items.length > 0 && (
          <span style={{
            fontSize: 9, background: "#c8883a", color: "#1a0a0a",
            borderRadius: 10, padding: "1px 6px", fontWeight: 800,
          }}>{items.length}</span>
        )}
        <span style={{ fontSize: 9, opacity: .4 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={css.sectionPanel}>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
              <input
                value={item[nameField]}
                onChange={e => onChange(i, nameField, e.target.value)}
                placeholder={nameField === "label" ? "e.g. Half, Full" : "e.g. Extra Cheese"}
                style={css.subInp}
              />
              <span style={{ color: "rgba(212,163,115,0.5)", fontSize: 12, flexShrink: 0 }}>₹</span>
              <input
                type="number" value={item.price}
                onChange={e => onChange(i, "price", e.target.value)}
                placeholder="0"
                style={{ ...css.subInp, width: 64 }}
              />
              <button type="button" onClick={() => onRemove(i)} style={css.subRemove}>✕</button>
            </div>
          ))}
          <button type="button" onClick={onAdd} style={css.addInline}>+ Add</button>
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
    <div style={css.card(isReady)}>
      {/* Header */}
      <div style={css.cardHeader(isReady)}>
        <span style={css.indexBadge(isReady)}>{idx + 1}</span>
        <span style={css.itemName(!!item.name)}>{item.name || "Unnamed item"}</span>
        {item.category && <span style={css.catChip}>{item.category}</span>}
        {item.price && <span style={css.priceTag}>₹{item.price}</span>}
        <VegDot isVeg={item.isVeg} />
        <button type="button" onClick={() => onDuplicate(idx)} title="Duplicate"
          style={css.actionBtn(false)}>⧉</button>
        {!isOnly && (
          <button type="button" onClick={() => onRemove(idx)} title="Remove"
            style={css.actionBtn(true)}>✕</button>
        )}
      </div>

      {/* Body */}
      <div style={css.cardBody}>
        {/* Row 1: Name / Category / Price */}
        <div style={css.grid3}>
          <div>
            <label style={css.label}>Item Name *</label>
            <input placeholder="e.g. Paneer Tikka" value={item.name}
              onChange={e => onChange(idx, "name", e.target.value)} style={css.inp(!!item.name)} />
          </div>
          <div>
            <label style={css.label}>Category *</label>
            <select value={item.category} onChange={e => onChange(idx, "category", e.target.value)}
              style={{ ...css.inp(!!item.category), cursor: "pointer" }}>
              <option value="">Select…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={css.label}>Price (₹) *</label>
            <input type="number" placeholder="0" value={item.price}
              onChange={e => onChange(idx, "price", e.target.value)} style={css.inp(!!item.price)} />
          </div>
        </div>

        {/* Row 2: Description + Veg toggle */}
        <div style={css.grid2}>
          <div>
            <label style={css.label}>Description</label>
            <textarea placeholder="Short description…" value={item.description}
              onChange={e => onChange(idx, "description", e.target.value)}
              rows={2} style={{ ...css.inp(!!item.description), resize: "none" }} />
          </div>
          <div>
            <label style={css.label}>Type</label>
            <div style={{ display: "flex", gap: 6 }}>
              {[true, false].map(v => (
                <button key={String(v)} type="button" onClick={() => onChange(idx, "isVeg", v)}
                  style={css.vegBtn(item.isVeg === v, v)}>
                  <VegDot isVeg={v} />
                  <span style={css.vegLabel(v)}>{v ? "Veg" : "Non"}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Image URL */}
        <div>
          <label style={css.label}>Image URL</label>
          <input placeholder="https://…" value={item.image}
            onChange={e => onChange(idx, "image", e.target.value)} style={css.inp(!!item.image)} />
        </div>

        {/* Row 4: Options + Addons */}
        <div style={css.gridHalf}>
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

  const pct = items.length ? (readyCount / items.length) * 100 : 0;

  return (
    <AdminLayout>
      <div style={css.page}>

        {/* Sticky header */}
        <div style={css.stickyBar}>
          <div style={css.titleBlock}>
            <h1 style={css.h1}>Bulk Add Menu Items</h1>
            <p style={css.subtitle}>
              {items.length} item{items.length !== 1 ? "s" : ""}
              <span style={{ margin: "0 6px", opacity: .3 }}>·</span>
              <span style={css.readyBadge(readyCount)}>
                {readyCount} ready to save
              </span>
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addRow} style={css.btnAdd}>+ Add Item</button>
            <button onClick={handleSave} disabled={saving || readyCount === 0}
              style={css.btnSave(saving || readyCount === 0)}>
              {saving ? "Saving…" : `Save ${readyCount > 0 ? readyCount + " " : ""}Item${readyCount !== 1 ? "s" : ""}`}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={css.progressTrack}>
          <div style={css.progressBar(pct)} />
        </div>

        {/* Content */}
        <div style={css.content}>

          {items.length === 1 && !items[0].name && (
            <div style={css.hint}>
              <span style={{ fontSize: 14 }}>✦</span>
              <p style={css.hintText}>
                Fill <strong style={{ color: "#d4a373" }}>Name</strong>,{" "}
                <strong style={{ color: "#d4a373" }}>Category</strong> and{" "}
                <strong style={{ color: "#d4a373" }}>Price</strong> to mark an item ready.
                Use <strong style={{ color: "#d4a373" }}>⧉</strong> to duplicate quickly.
              </p>
            </div>
          )}

          {items.map((item, idx) => (
            <ItemCard key={idx} item={item} idx={idx}
              onChange={handleChange} onRemove={removeRow}
              onDuplicate={duplicateRow} isOnly={items.length === 1} />
          ))}

          <button
            onClick={addRow}
            style={css.addAnotherBtn}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = "rgba(212,163,115,0.5)";
              e.currentTarget.style.color = "#d4a373";
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = "rgba(212,163,115,0.2)";
              e.currentTarget.style.color = "rgba(212,163,115,0.35)";
            }}
          >
            + Add Another Item
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}