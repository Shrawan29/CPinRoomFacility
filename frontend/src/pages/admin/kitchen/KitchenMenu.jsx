import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import {
    getKitchenMenu,
    deleteMenuItem,
    updateMenuItem,
} from "../../../services/menu.service";
import MenuFormModal from "./MenuFormModal";

export default function KitchenMenu() {
    const { token, loading: authLoading } = useAdminAuth();
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (authLoading || !token) {
            setLoading(authLoading);
            return;
        }

        const fetchMenu = async () => {
            const items = await getKitchenMenu(); // ✅ already array
            setMenu(items);
            setLoading(false);
        };

        fetchMenu();
    }, [token, authLoading]);

    const categories = [
        "ALL",
        ...new Set(menu.map((item) => item.category)),
    ];

    const filteredMenu =
        selectedCategory === "ALL"
            ? menu
            : menu.filter((item) => item.category === selectedCategory);

    const toggleAvailability = async (item) => {
        const res = await updateMenuItem(
            item._id,
            { isAvailable: !item.isAvailable }
        );

        setMenu((prev) =>
            prev.map((i) => (i._id === res.data.item._id ? res.data.item : i))
        );
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this menu item?")) return;

        await deleteMenuItem(id);
        setMenu((prev) => prev.filter((i) => i._id !== id));
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
                    Menu Management
                </h1>

                <button
                    onClick={() => {
                        setEditingItem(null);
                        setShowModal(true);
                    }}
                    className="bg-[var(--brand)] text-white px-4 py-2 rounded-xl"
                >
                    + Add Item
                </button>
            </div>

            {loading ? (
                <p className="text-[var(--text-muted)]">Loading menu…</p>
            ) : (
                <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden">
                    {/* Category Filter */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`
        px-4 py-1 rounded-full text-sm transition
        ${selectedCategory === cat
                                        ? "bg-[var(--brand)] text-white"
                                        : "bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:bg-black/5"
                                    }
      `}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <table className="w-full">
                        <thead className="bg-black/5 text-sm text-[var(--text-muted)]">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Price</th>
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
                                    <td className="px-4 py-3">{item.name}</td>
                                    <td className="px-4 py-3 text-center">{item.category}</td>
                                    <td className="px-4 py-3 text-center">₹{item.price}</td>

                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={`text-xs font-medium px-2 py-1 rounded-full ${item.isVeg
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
                                            className={`text-xs font-medium ${item.isAvailable
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

                            {menu.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-4 py-6 text-center text-[var(--text-muted)]"
                                    >
                                        No menu items found
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
