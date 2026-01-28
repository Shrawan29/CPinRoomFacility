import { useState, useEffect } from "react";
import { useGuestAuth } from "../../context/GuestAuthContext";
import { getGuestMenu, placeOrder } from "../../services/guest.service";
import GuestHeader from "../../components/guest/GuestHeader"; // ✅ same header as dashboard

export default function MenuBrowse() {
    const { token } = useGuestAuth();

    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cart, setCart] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [showCart, setShowCart] = useState(false); // ✅ bottom cart toggle
    const [showConfirmation, setShowConfirmation] = useState(false);

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
        if (cart.length === 0) return;
        setShowConfirmation(true);
    };

    const confirmPlaceOrder = async () => {
        try {
            setSubmitting(true);
            await placeOrder({
                items: cart.map((item) => ({
                    menuItemId: item._id,
                    quantity: item.quantity,
                    price: item.price,
                })),
            });

            setCart([]);
            setShowCart(false);
            setShowConfirmation(false);
            setSuccessMessage("✅ Order placed successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {/* ✅ SAME HEADER AS DASHBOARD */}
            <GuestHeader />

            <div
                className="min-h-screen p-6 pb-28"
                style={{
                    background:
                        "linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))",
                    color: "var(--text-primary)",
                }}
            >
                {/* SUCCESS MESSAGE */}
                {successMessage && (
                    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-semibold">
                        {successMessage}
                    </div>
                )}
                {/* CATEGORIES */}
                <div className="sticky top-16 z-10 mb-6 flex gap-3 flex-wrap">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className="px-5 py-2 rounded-full text-sm font-semibold"
                            style={{
                                backgroundColor:
                                    selectedCategory === cat
                                        ? "var(--brand)"
                                        : "var(--bg-secondary)",
                                color:
                                    selectedCategory === cat ? "#fff" : "var(--text-primary)",
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* MENU */}
                {loading ? (
                    <p className="text-center py-20">Loading menu...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredItems.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-2xl shadow-lg p-5"
                            >
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
                                    {item.description}
                                </p>

                                <div className="flex justify-between items-center">
                                    <span
                                        className="text-xl font-bold"
                                        style={{ color: "var(--brand)" }}
                                    >
                                        ₹{item.price}
                                    </span>

                                    <button
                                        onClick={() => addToCart(item)}
                                        className="px-4 py-2 rounded-lg text-white font-semibold"
                                        style={{ backgroundColor: "var(--brand)" }}
                                    >
                                        Add +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 🧾 FIXED BOTTOM CART BAR */}
            <div
                className="fixed bottom-0 left-0 right-0 p-4 shadow-xl flex justify-between items-center z-40"
                style={{ backgroundColor: "var(--brand)" }}
            >
                <span className="text-white font-semibold">
                    {cartItemCount} items · ₹{cartTotal}
                </span>

                <button
                    onClick={() => setShowCart(true)}
                    className="text-white font-bold"
                >
                    View Cart ↑
                </button>
            </div>
            {/* 🧾 CART SLIDE-UP */}
            {showCart && (
                <div className="fixed inset-0 bg-black/40 z-50">
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-lg font-bold">Your Cart</h2>
                            <button onClick={() => setShowCart(false)}>✕</button>
                        </div>

                        {cart.map((item) => (
                            <div key={item._id} className="mb-4">
                                <p className="font-semibold">{item.name}</p>
                                <div className="flex gap-3 mt-1">
                                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={handlePlaceOrder}
                            disabled={submitting}
                            className="w-full py-3 mt-4 rounded-lg text-white font-bold"
                            style={{ backgroundColor: "var(--brand-soft)" }}
                        >
                            {submitting ? "Placing Order..." : `Place Order · ₹${cartTotal}`}
                        </button>
                    </div>
                </div>
            )}

            {/* CONFIRMATION MODAL */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Confirm Order</h2>
                        
                        <div className="mb-4 bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                            {cart.map((item) => (
                                <div key={item._id} className="flex justify-between mb-2 text-sm">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                                <span>Total</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-xs text-red-700 font-semibold">⚠️ Once ordered, it cannot be cancelled</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1 py-2 rounded-lg border-2 font-semibold"
                                style={{
                                    borderColor: "var(--text-muted)",
                                    color: "var(--text-primary)",
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmPlaceOrder}
                                disabled={submitting}
                                className="flex-1 py-2 rounded-lg text-white font-semibold"
                                style={{ backgroundColor: "var(--brand)" }}
                            >
                                {submitting ? "Processing..." : "Confirm Order"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            )}
        </>
    );
}
