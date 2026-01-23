import { useState } from "react";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import {
  createMenuItem,
  updateMenuItem,
} from "../../../services/menu.service";

export default function MenuFormModal({ item, onClose, onSaved }) {
  const { token } = useAdminAuth();

  const [form, setForm] = useState({
    name: item?.name || "",
    category: item?.category || "",
    price: item?.price || "",
    description: item?.description || "",
    isVeg: item?.isVeg ?? true,
  });

  const handleSubmit = async () => {
    try {
      const res = item
        ? await updateMenuItem(item._id, form)
        : await createMenuItem(form);

      onSaved(res.item);
      onClose();
    } catch (err) {
      alert("Failed to save menu item");
      console.error(err);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {item ? "Edit Menu Item" : "Add Menu Item"}
        </h2>

        <div className="space-y-3">
          <input
            placeholder="Item name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isVeg}
              onChange={(e) =>
                setForm({ ...form, isVeg: e.target.checked })
              }
            />
            Veg Item
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[var(--brand)] text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
