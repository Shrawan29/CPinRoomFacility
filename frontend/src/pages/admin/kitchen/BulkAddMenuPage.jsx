import { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { createMenuItem } from "../../../services/menu.service";

export default function BulkAddMenuPage() {
  const [items, setItems] = useState([
    { name: "", category: "", price: "", description: "", isVeg: true, image: "", options: [], addons: [] }
  ]);
  const [saving, setSaving] = useState(false);

  const addRow = () => setItems([...items, { name: "", category: "", price: "", description: "", isVeg: true, image: "", options: [], addons: [] }]);
  const removeRow = idx => setItems(items.filter((_, i) => i !== idx));

  const handleChange = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = value;
    setItems(updated);
  };

  // For options/addons
  const handleOptionChange = (idx, optIdx, field, value) => {
    const updated = [...items];
    updated[idx].options[optIdx][field] = value;
    setItems(updated);
  };
  const addOption = idx => {
    const updated = [...items];
    updated[idx].options = [...(updated[idx].options || []), { label: "", price: "" }];
    setItems(updated);
  };
  const removeOption = (idx, optIdx) => {
    const updated = [...items];
    updated[idx].options = updated[idx].options.filter((_, i) => i !== optIdx);
    setItems(updated);
  };
  const handleAddonChange = (idx, addonIdx, field, value) => {
    const updated = [...items];
    updated[idx].addons[addonIdx][field] = value;
    setItems(updated);
  };
  const addAddon = idx => {
    const updated = [...items];
    updated[idx].addons = [...(updated[idx].addons || []), { name: "", price: "" }];
    setItems(updated);
  };
  const removeAddon = (idx, addonIdx) => {
    const updated = [...items];
    updated[idx].addons = updated[idx].addons.filter((_, i) => i !== addonIdx);
    setItems(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const created = [];
      for (const item of items) {
        if (!item.name || !item.category || !item.price) continue;
        const res = await createMenuItem(item);
        created.push(res.item);
      }
      alert(`${created.length} items added successfully!`);
      setItems([{ name: "", category: "", price: "", description: "", isVeg: true, image: "", options: [], addons: [] }]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Bulk Add Menu Items</h2>
        <div className="space-y-6">
          {items.map((item, idx) => (
            <div key={idx} className="border rounded p-4 mb-2">
              <div className="flex gap-2 mb-2 flex-wrap">
                <input placeholder="Name" value={item.name} onChange={e => handleChange(idx, "name", e.target.value)} className="border rounded px-2 py-1 w-32" />
                <input placeholder="Category" value={item.category} onChange={e => handleChange(idx, "category", e.target.value)} className="border rounded px-2 py-1 w-24" />
                <input type="number" placeholder="Price" value={item.price} onChange={e => handleChange(idx, "price", e.target.value)} className="border rounded px-2 py-1 w-20" />
                <input placeholder="Image URL" value={item.image} onChange={e => handleChange(idx, "image", e.target.value)} className="border rounded px-2 py-1 w-32" />
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={item.isVeg} onChange={e => handleChange(idx, "isVeg", e.target.checked)} />Veg</label>
                <button type="button" onClick={() => removeRow(idx)} className="text-red-500 text-xs ml-2">Remove</button>
              </div>
              <textarea placeholder="Description" value={item.description} onChange={e => handleChange(idx, "description", e.target.value)} className="border rounded px-2 py-1 w-full mb-2" />
              {/* Options */}
              <div className="mb-2">
                <div className="font-semibold text-xs mb-1">Options (Half/Full etc)</div>
                {(item.options || []).map((opt, optIdx) => (
                  <div key={optIdx} className="flex gap-2 items-center mb-1">
                    <input value={opt.label} onChange={e => handleOptionChange(idx, optIdx, "label", e.target.value)} placeholder="Label" className="border rounded px-2 py-1 w-20" />
                    <input type="number" value={opt.price} onChange={e => handleOptionChange(idx, optIdx, "price", e.target.value)} placeholder="Price" className="border rounded px-2 py-1 w-16" />
                    <button type="button" onClick={() => removeOption(idx, optIdx)} className="text-red-500 text-xs">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => addOption(idx)} className="text-green-600 text-xs mt-1">+ Add Option</button>
              </div>
              {/* Addons */}
              <div>
                <div className="font-semibold text-xs mb-1">Add-ons</div>
                {(item.addons || []).map((addon, addonIdx) => (
                  <div key={addonIdx} className="flex gap-2 items-center mb-1">
                    <input value={addon.name} onChange={e => handleAddonChange(idx, addonIdx, "name", e.target.value)} placeholder="Name" className="border rounded px-2 py-1 w-20" />
                    <input type="number" value={addon.price} onChange={e => handleAddonChange(idx, addonIdx, "price", e.target.value)} placeholder="Price" className="border rounded px-2 py-1 w-16" />
                    <button type="button" onClick={() => removeAddon(idx, addonIdx)} className="text-red-500 text-xs">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => addAddon(idx)} className="text-green-600 text-xs mt-1">+ Add Add-on</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={addRow} className="px-4 py-2 bg-yellow-500 text-white rounded">+ Add Row</button>
          <button onClick={handleSave} className="px-4 py-2 bg-[var(--brand)] text-white rounded" disabled={saving}>{saving ? "Saving..." : "Save All"}</button>
        </div>
      </div>
    </AdminLayout>
  );
}
