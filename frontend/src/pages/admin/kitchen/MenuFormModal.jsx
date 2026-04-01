import { useState } from "react";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import {
  createMenuItem,
  updateMenuItem,
} from "../../../services/menu.service";
import {
  MENU_IMAGE_MAX_SIZE_MB,
  readMenuImageFileAsDataUrl,
} from "../../../services/menuImage.service";

export default function MenuFormModal({ item, onClose, onSaved }) {
  const { token } = useAdminAuth();

  const [form, setForm] = useState({
    name: item?.name || "",
    category: item?.category || "",
    price: item?.price || "",
    description: item?.description || "",
    isVeg: item?.isVeg ?? true,
    image: item?.image || "",
    options: item?.options || [],
    addons: item?.addons || [],
  });

  // For new option/addon fields
  const [newOption, setNewOption] = useState({ label: "", price: "" });
  const [newAddon, setNewAddon] = useState({ name: "", price: "" });
  const [imageUploadError, setImageUploadError] = useState("");

  const handleImagePick = async (file) => {
    if (!file) return;

    try {
      const imageData = await readMenuImageFileAsDataUrl(file);
      setForm((prev) => ({ ...prev, image: imageData }));
      setImageUploadError("");
    } catch (err) {
      setImageUploadError(
        err?.message ||
        `Unable to read image file. Please select an image up to ${MENU_IMAGE_MAX_SIZE_MB}MB.`
      );
    }
  };

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
                    {/* Image URL */}
                    <input
                      placeholder="Image URL (optional)"
                      value={form.image}
                      onChange={e => {
                        setForm({ ...form, image: e.target.value });
                        setImageUploadError("");
                      }}
                      className="w-full border rounded px-3 py-2"
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="inline-flex items-center gap-2 px-3 py-2 border rounded text-sm cursor-pointer bg-gray-50">
                        Upload from Desktop
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            handleImagePick(e.target.files?.[0]);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      {form.image && (
                        <button
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({ ...prev, image: "" }));
                            setImageUploadError("");
                          }}
                          className="px-3 py-2 border rounded text-sm text-red-600 border-red-300"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                    {imageUploadError && (
                      <p className="text-xs text-red-600">{imageUploadError}</p>
                    )}
                    {/* Options (Half/Full) */}
                    <div className="border rounded px-3 py-2">
                      <div className="font-semibold text-sm mb-1">Options (Half/Full etc)</div>
                      {form.options.map((opt, idx) => (
                        <div key={idx} className="flex gap-2 items-center mb-1">
                          <input
                            value={opt.label}
                            onChange={e => {
                              const options = [...form.options];
                              options[idx].label = e.target.value;
                              setForm({ ...form, options });
                            }}
                            placeholder="Label"
                            className="border rounded px-2 py-1 w-24"
                          />
                          <input
                            type="number"
                            value={opt.price}
                            onChange={e => {
                              const options = [...form.options];
                              options[idx].price = e.target.value;
                              setForm({ ...form, options });
                            }}
                            placeholder="Price"
                            className="border rounded px-2 py-1 w-20"
                          />
                          <button type="button" onClick={() => setForm({ ...form, options: form.options.filter((_, i) => i !== idx) })} className="text-red-500 text-xs">Remove</button>
                        </div>
                      ))}
                      <div className="flex gap-2 mt-2">
                        <input
                          value={newOption.label}
                          onChange={e => setNewOption({ ...newOption, label: e.target.value })}
                          placeholder="Label"
                          className="border rounded px-2 py-1 w-24"
                        />
                        <input
                          type="number"
                          value={newOption.price}
                          onChange={e => setNewOption({ ...newOption, price: e.target.value })}
                          placeholder="Price"
                          className="border rounded px-2 py-1 w-20"
                        />
                        <button type="button" onClick={() => {
                          if (newOption.label && newOption.price) {
                            setForm({ ...form, options: [...form.options, { ...newOption }] });
                            setNewOption({ label: "", price: "" });
                          }
                        }} className="text-green-600 text-xs">Add</button>
                      </div>
                    </div>

                    {/* Add-ons */}
                    <div className="border rounded px-3 py-2">
                      <div className="font-semibold text-sm mb-1">Add-ons</div>
                      {form.addons.map((addon, idx) => (
                        <div key={idx} className="flex gap-2 items-center mb-1">
                          <input
                            value={addon.name}
                            onChange={e => {
                              const addons = [...form.addons];
                              addons[idx].name = e.target.value;
                              setForm({ ...form, addons });
                            }}
                            placeholder="Name"
                            className="border rounded px-2 py-1 w-24"
                          />
                          <input
                            type="number"
                            value={addon.price}
                            onChange={e => {
                              const addons = [...form.addons];
                              addons[idx].price = e.target.value;
                              setForm({ ...form, addons });
                            }}
                            placeholder="Price"
                            className="border rounded px-2 py-1 w-20"
                          />
                          <button type="button" onClick={() => setForm({ ...form, addons: form.addons.filter((_, i) => i !== idx) })} className="text-red-500 text-xs">Remove</button>
                        </div>
                      ))}
                      <div className="flex gap-2 mt-2">
                        <input
                          value={newAddon.name}
                          onChange={e => setNewAddon({ ...newAddon, name: e.target.value })}
                          placeholder="Name"
                          className="border rounded px-2 py-1 w-24"
                        />
                        <input
                          type="number"
                          value={newAddon.price}
                          onChange={e => setNewAddon({ ...newAddon, price: e.target.value })}
                          placeholder="Price"
                          className="border rounded px-2 py-1 w-20"
                        />
                        <button type="button" onClick={() => {
                          if (newAddon.name && newAddon.price) {
                            setForm({ ...form, addons: [...form.addons, { ...newAddon }] });
                            setNewAddon({ name: "", price: "" });
                          }
                        }} className="text-green-600 text-xs">Add</button>
                      </div>
                    </div>
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
