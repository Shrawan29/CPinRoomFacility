import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import {
  getKitchenMenu,
  deleteMenuItem,
  updateMenuItem,
} from "../../../services/menu.service.js";
import MenuFormModal from "./MenuFormModal";
import { exportMenuToExcel, importMenuFromExcel } from "../../../services/excelMenu.service";
import api from "../../../services/api";

const summarizeList = (list, field) => {
  if (!Array.isArray(list) || list.length === 0) return "";
  const values = list
    .map((entry) => (entry?.[field] ? String(entry[field]).trim() : ""))
    .filter(Boolean);

  if (values.length === 0) return "";
  if (values.length <= 3) return values.join(", ");
  return `${values.slice(0, 3).join(", ")} +${values.length - 3} more`;
};

export default function KitchenMenu() {
  const { token, loading: authLoading } = useAdminAuth();

  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  /* ============================
     FETCH MENU
     ============================ */
  useEffect(() => {
    if (authLoading || !token) {
      setLoading(authLoading);
      return;
    }

    const fetchMenu = async () => {
      try {
        const items = await getKitchenMenu(); // ✅ array

        setMenu(items);

        const uniqueCategories = [
          ...new Set(items.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);

        // ✅ Auto-select first category
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [token, authLoading]);

  /* ============================
     FILTER MENU
     ============================ */
  const filteredMenu =
    selectedCategory === "All" || !selectedCategory
      ? menu
      : menu.filter((item) => item.category === selectedCategory);

  /* ============================
     ACTIONS
     ============================ */
  const toggleAvailability = async (item) => {
    const res = await updateMenuItem(item._id, {
      isAvailable: !item.isAvailable,
    });

    setMenu((prev) =>
      prev.map((i) => (i._id === res.item._id ? res.item : i))
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;

    await deleteMenuItem(id);
    setMenu((prev) => prev.filter((i) => i._id !== id));
  };

  /* ============================
     RENDER
     ============================ */
  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Menu Management
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.href = "/admin/kitchen/bulk-add"}
            className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
          >
            + Bulk Add
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowModal(true);
            }}
            className="bg-[var(--brand)] text-white px-4 py-2 rounded-xl"
          >
            + Add Item
          </button>
          <button
            onClick={() => exportMenuToExcel(menu)}
            className="bg-green-600 text-white px-4 py-2 rounded-xl"
          >
            Export Excel
          </button>
          <label className="bg-blue-600 text-white px-4 py-2 rounded-xl cursor-pointer">
            Import Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={async e => {
                const file = e.target.files[0];
                if (file) {
                  importMenuFromExcel(file, async (json) => {
                    // Optionally validate json structure here
                    setMenu(json);
                    // Bulk upload to backend
                    try {
                      await api.post("/menu/kitchen/bulk", { items: json });
                      alert("Menu items uploaded successfully.");
                    } catch (err) {
                      alert("Bulk upload failed: " + (err.response?.data?.message || err.message));
                    }
                  });
                }
              }}
            />
          </label>
        </div>
      </div>

      {loading ? (
        <p className="text-[var(--text-muted)]">Loading menu…</p>
      ) : (
        <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden">
          {/* CATEGORY FILTER */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              key="All"
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-1 rounded-full text-sm transition ${
                selectedCategory === "All"
                  ? "bg-[var(--brand)] text-white"
                  : "bg-white text-[var(--text-muted)] hover:bg-black/5"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1 rounded-full text-sm transition ${
                  selectedCategory === cat
                    ? "bg-[var(--brand)] text-white"
                    : "bg-white text-[var(--text-muted)] hover:bg-black/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* TABLE */}
          <table className="w-full">
            <thead className="bg-black/5 text-sm text-[var(--text-muted)]">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 text-left">Customizations</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMenu.map((item) => (
                <tr
                  key={item._id}
                  className="border-t border-black/10 hover:bg-black/5"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                          className="h-12 w-12 rounded-lg object-cover border border-black/10 bg-white"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg border border-dashed border-black/15 bg-black/5 flex items-center justify-center text-[10px] text-[var(--text-muted)]">
                          No Img
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="font-medium text-[var(--text-primary)]">
                          {item.name}
                        </div>
                        {item.description && (
                          <div className="text-xs text-[var(--text-muted)] mt-0.5">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{item.category}</td>
                  <td className="px-4 py-3 text-center">₹{item.price}</td>

                  <td className="px-4 py-3 text-left">
                    <div className="text-xs text-[var(--text-muted)] leading-5">
                      <div>
                        Portions: {summarizeList(item.options, "label") || "None"}
                      </div>
                      <div>
                        Add-ons: {summarizeList(item.addons, "name") || "None"}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.isVeg
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isVeg ? "Veg" : "Non-Veg"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleAvailability(item)}
                      className={`text-xs font-medium ${
                        item.isAvailable
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </button>
                  </td>

                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setShowModal(true);
                      }}
                      className="text-[var(--brand)] hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredMenu.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-6 text-center text-[var(--text-muted)]"
                  >
                    No items in this category
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <MenuFormModal
          item={editingItem}
          onClose={() => setShowModal(false)}
          onSaved={(saved) => {
            setMenu((prev) =>
              editingItem
                ? prev.map((i) => (i._id === saved._id ? saved : i))
                : [saved, ...prev]
            );
            setShowModal(false);
          }}
        />
      )}
    </AdminLayout>
  );
}
