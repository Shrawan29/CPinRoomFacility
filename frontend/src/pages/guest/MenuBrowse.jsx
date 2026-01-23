import { useEffect, useState } from "react";
import { getGuestMenu } from "../../services/menu.service.js";
import { useNavigate } from "react-router-dom";

export default function MenuBrowse() {
    const navigate = useNavigate();

    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("");
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* ============================
       LOAD MENU FROM API
       ============================ */
    useEffect(() => {
        const loadMenu = async () => {
            try {
                const items = await getGuestMenu();

                setMenuItems(items);

                const uniqueCategories = [
                    ...new Set(items.map((item) => item.category)),
                ];

                setCategories(uniqueCategories);

                // ✅ Auto-select first category
                if (uniqueCategories.length > 0) {
                    setActiveCategory(uniqueCategories[0]);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load menu");
            } finally {
                setLoading(false);
            }
        };

        loadMenu();
    }, []);

    /* ============================
       FILTER BY CATEGORY
       ============================ */
    const filteredItems = menuItems.filter(
        (item) => item.category === activeCategory
    );

    /* ============================
       CART LOGIC
       ============================ */
    const addToCart = (item) => {
        const existing =
            JSON.parse(localStorage.getItem("guest_cart")) || [];

        const index = existing.findIndex((i) => i._id === item._id);

        if (index >= 0) {
            existing[index].qty += 1;
        } else {
            existing.push({ ...item, qty: 1 });
        }

        localStorage.setItem("guest_cart", JSON.stringify(existing));
    };


    return (
        <div
            className="min-h-screen pb-24"
            style={{ backgroundColor: "var(--bg-primary)" }}
        >
            {/* CATEGORY SCROLL */}
            <div className="px-4 pt-4 pb-2 flex gap-3 overflow-x-auto">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className="px-4 py-2 rounded-full text-sm whitespace-nowrap border transition"
                        style={{
                            backgroundColor:
                                activeCategory === cat ? "var(--brand)" : "white",
                            color:
                                activeCategory === cat ? "white" : "var(--text-primary)",
                            borderColor: "var(--bg-secondary)",
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* MENU LIST */}
            <div className="px-4 py-4 space-y-4">
                {filteredItems.length === 0 && (
                    <p style={{ color: "var(--text-muted)" }}>
                        No items available in this category
                    </p>
                )}

                {filteredItems.map((item) => (
                    <div
                        key={item._id}
                        className="flex justify-between items-start p-4 rounded-xl shadow bg-white"
                    >
                        <div className="pr-3">
                            <h3
                                className="font-semibold text-base"
                                style={{ color: "var(--text-primary)" }}
                            >
                                {item.name}
                            </h3>

                            <p
                                className="text-sm mt-1"
                                style={{ color: "var(--text-muted)" }}
                            >
                                ₹{item.price} • {item.isVeg ? "🌱 Veg" : "🍗 Non-Veg"}
                            </p>

                            {item.description && (
                                <p
                                    className="text-xs mt-1"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    {item.description}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={() => addToCart(item)}
                            className="px-4 py-2 rounded-lg text-sm font-medium active:scale-95 transition"
                            style={{
                                backgroundColor: "var(--brand-soft)",
                                color: "white",
                            }}
                        >
                            Add
                        </button>
                    </div>
                ))}
            </div>

            {/* STICKY CART BAR */}
            {cart.length > 0 && (
                <div
                    className="fixed bottom-0 left-0 right-0 px-4 py-3 shadow-lg flex justify-between items-center"
                    style={{ backgroundColor: "white" }}
                >
                    <div>
                        <p
                            className="text-sm font-semibold"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {cart.length} item(s)
                        </p>
                        <p
                            className="text-xs"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Total ₹{totalAmount}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/guest/cart")}
                        className="px-5 py-2 rounded-lg font-semibold text-sm"
                        style={{
                            backgroundColor: "var(--brand)",
                            color: "white",
                        }}
                    >
                        View Cart
                    </button>
                </div>
            )}
        </div>
    );
}
