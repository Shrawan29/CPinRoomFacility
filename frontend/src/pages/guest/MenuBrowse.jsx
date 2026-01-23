import { useState, useEffect } from "react";
import { useGuestAuth } from "../../context/GuestAuthContext";
import { getGuestMenu, placeOrder } from "../../services/guest.service";

export default function MenuBrowse() {
    const { token } = useGuestAuth();

    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cart, setCart] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            setLoading(true);
            const res = await getGuestMenu();
            setMenuItems(Array.isArray(res) ? res : res.items || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load menu");
        } finally {
            setLoading(false);
        }
    };

    const categories = ["ALL", ...new Set(menuItems.map((i) => i.category))];

    const filteredItems =
        selectedCategory === "ALL"
            ? menuItems
            : menuItems.filter((i) => i.category === selectedCategory);

    const addToCart = (item) => {
        const existing = cart.find((c) => c._id === item._id);
        if (existing) {
            setCart(
                cart.map((c) =>
                    c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
                )
            );
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, qty) => {
        if (qty <= 0) {
            setCart(cart.filter((c) => c._id !== id));
        } else {
            setCart(cart.map((c) => (c._id === id ? { ...c, quantity: qty } : c)));
        }
    };

    const cartTotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            setError("Please add items to your cart");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            await placeOrder({
                items: cart.map((item) => ({
                    menuItemId: item._id,
                    quantity: item.quantity,
                    price: item.price,
                })),
            });

            setSuccessMessage("✅ Order placed successfully");
            setCart([]);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to place order");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen p-6"
            style={{
                background:
                    "linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))",
                color: "var(--text-primary)",
            }}
        >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* MENU */}
                <div className="lg:col-span-3">
                    {/* CATEGORIES */}
                    <div className="sticky top-0 z-10 mb-6 flex gap-3 flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className="px-5 py-2 rounded-full text-sm font-semibold transition"
                                style={{
                                    backgroundColor:
                                        selectedCategory === cat
                                            ? "var(--brand)"
                                            : "var(--bg-secondary)",
                                    color:
                                        selectedCategory === cat
                                            ? "#fff"
                                            : "var(--text-primary)",
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 text-red-600">
                            {error}
                        </div>
                    )}

                    {/* SUCCESS */}
                    {successMessage && (
                        <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 text-green-600">
                            {successMessage}
                        </div>
                    )}

                    {/* MENU ITEMS */}
                    {loading ? (
                        <p className="text-center py-20 animate-pulse" style={{ color: "var(--text-muted)" }}>
                            Loading menu...
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden"
                                >
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-44 object-cover"
                                        />
                                    )}

                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold mb-1">
                                            {item.name}
                                        </h3>

                                        <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                                            {item.description}
                                        </p>

                                        <div className="flex justify-between items-center">
                                            <span
                                                className="text-2xl font-bold"
                                                style={{ color: "var(--brand)" }}
                                            >
                                                ₹{item.price}
                                            </span>

                                            <button
                                                onClick={() => addToCart(item)}
                                                disabled={!item.isAvailable}
                                                className="px-4 py-2 rounded-lg text-white font-semibold transition active:scale-95"
                                                style={{
                                                    backgroundColor: item.isAvailable
                                                        ? "var(--brand)"
                                                        : "#ccc",
                                                }}
                                            >
                                                Add +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CART */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 sticky top-6">
                        <h2 className="text-xl font-bold mb-4">
                            🛒 Cart ({cartItemCount})
                        </h2>

                        {cart.length === 0 ? (
                            <p className="text-center py-10" style={{ color: "var(--text-muted)" }}>
                                Your cart is empty
                            </p>
                        ) : (
                            <>
                                <div className="space-y-4 max-h-80 overflow-y-auto mb-6">
                                    {cart.map((item) => (
                                        <div key={item._id} className="border-b pb-3">
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="font-semibold text-sm">
                                                        {item.name}
                                                    </p>
                                                    <p style={{ color: "var(--brand)" }}>
                                                        ₹{item.price}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        setCart(cart.filter((c) => c._id !== item._id))
                                                    }
                                                    className="text-red-500"
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-3 mt-2 rounded-xl px-2 py-1 w-fit"
                                                style={{ backgroundColor: "var(--bg-secondary)" }}
                                            >
                                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                                                <span className="w-6 text-center font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={submitting}
                                    className="w-full py-3 rounded-lg text-white font-bold transition"
                                    style={{
                                        backgroundColor: "var(--brand-soft)",
                                        opacity: submitting ? 0.6 : 1,
                                    }}
                                >
                                    {submitting ? "Placing Order..." : "Place Order"}
                                </button>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
