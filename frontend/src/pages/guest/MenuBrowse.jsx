import { useState, useEffect } from "react";
import { useGuestAuth } from "../../context/GuestAuthContext";
import { getGuestMenu, placeOrder } from "../../services/guest.service";
import { useNavigate } from "react-router-dom";

export default function MenuBrowse() {
    const { token, guest } = useGuestAuth();
    const navigate = useNavigate();

    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cart, setCart] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [showCart, setShowCart] = useState(false);
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
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

                @keyframes fadeUp {
                    from { opacity:0; transform:translateY(12px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to   { transform: translateY(0); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                .card-hover { transition: transform 0.22s ease, box-shadow 0.22s ease; }
                .card-hover:hover { transform:translateY(-3px); box-shadow:0 12px 28px rgba(164,0,93,0.14)!important; }
            `}</style>

            <div style={{
                position: "fixed", inset: 0,
                display: "flex", flexDirection: "column",
                background: "#EFE1CF",
            }}>
                {/* SUCCESS MESSAGE */}
                {successMessage && (
                    <div style={{
                        position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
                        zIndex: 50, background: "#10b981", color: "#fff",
                        padding: "12px 20px", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                        fontWeight: 600, fontSize: 14, animation: "fadeIn 0.3s ease",
                    }}>
                        {successMessage}
                    </div>
                )}

                {/* HEADER */}
                <div style={{
                    background: "#fff", borderBottom: "1px solid rgba(164,0,93,0.1)",
                    padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                    maxWidth: 430, width: "100%", margin: "0 auto",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}>
                    <button onClick={() => navigate("/guest/dashboard")} style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: 20, color: "#A4005D",
                    }}>
                        ←
                    </button>
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 22, fontWeight: 600, color: "#1F1F1F",
                        margin: 0, flex: 1, textAlign: "center",
                    }}>
                        Order Food
                    </h1>
                    <div style={{ width: 24 }} />
                </div>

                {/* CONTENT */}
                <div style={{
                    flex: 1, overflowY: "auto", overflowX: "hidden",
                    maxWidth: 430, width: "100%", margin: "0 auto",
                    paddingBottom: 80,
                }}>
                    <div style={{ padding: "16px 20px" }}>
                        {/* CATEGORIES */}
                        <div style={{
                            display: "flex", gap: 8, overflowX: "auto", marginBottom: 20,
                            scrollBehavior: "smooth", paddingBottom: 8,
                        }}>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        padding: "8px 16px", borderRadius: 20, border: "none",
                                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                                        background: selectedCategory === cat ? "#A4005D" : "rgba(164,0,93,0.08)",
                                        color: selectedCategory === cat ? "#fff" : "#6B6B6B",
                                        transition: "all 0.2s ease", flexShrink: 0,
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* MENU ITEMS */}
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B6B6B" }}>
                                Loading menu...
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {filteredItems.map((item, i) => (
                                    <div
                                        key={item._id}
                                        className="card-hover"
                                        style={{
                                            background: "#fff", borderRadius: 18, padding: 16,
                                            border: "1px solid rgba(164,0,93,0.07)",
                                            boxShadow: "0 2px 14px rgba(164,0,93,0.06)",
                                            animation: `fadeUp 0.5s ease ${i * 50}ms both`,
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                                            <div style={{ flex: 1 }}>
                                                <p style={{
                                                    fontFamily: "'Cormorant Garamond', serif",
                                                    fontSize: 16, fontWeight: 600, color: "#1F1F1F",
                                                    margin: "0 0 6px 0",
                                                }}>
                                                    {item.name}
                                                </p>
                                                <p style={{
                                                    fontSize: 12, color: "#6B6B6B", fontWeight: 300,
                                                    margin: 0, lineHeight: 1.4,
                                                }}>
                                                    {item.description}
                                                </p>
                                                <p style={{
                                                    fontSize: 14, fontWeight: 700, color: "#A4005D",
                                                    margin: "8px 0 0 0",
                                                }}>
                                                    ₹{item.price}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => addToCart(item)}
                                                style={{
                                                    background: "linear-gradient(90deg,#A4005D,#C44A87)",
                                                    color: "#fff", border: "none", borderRadius: 10,
                                                    padding: "8px 14px", fontSize: 13, fontWeight: 600,
                                                    cursor: "pointer", whiteSpace: "nowrap",
                                                    transition: "transform 0.2s ease",
                                                }}
                                                onMouseDown={(e) => e.target.style.transform = "scale(0.95)"}
                                                onMouseUp={(e) => e.target.style.transform = "scale(1)"}
                                            >
                                                Add +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* FIXED BOTTOM CART BAR */}
                {cartItemCount > 0 && (
                    <div style={{
                        position: "fixed", bottom: 0, left: 0, right: 0,
                        padding: "12px 20px", background: "linear-gradient(90deg,#A4005D,#C44A87)",
                        boxShadow: "0 -2px 20px rgba(164,0,93,0.2)",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        maxWidth: 430, margin: "0 auto", left: "50%", transform: "translateX(-50%)",
                    }}>
                        <span style={{
                            color: "#fff", fontWeight: 600, fontSize: 14,
                        }}>
                            {cartItemCount} items · ₹{cartTotal}
                        </span>
                        <button
                            onClick={() => setShowCart(true)}
                            style={{
                                background: "rgba(255,255,255,0.25)", color: "#fff", border: "none",
                                padding: "8px 16px", borderRadius: 8, fontWeight: 700, fontSize: 13,
                                cursor: "pointer", transition: "background 0.2s ease",
                            }}
                            onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.35)"}
                            onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.25)"}
                        >
                            View Cart ↑
                        </button>
                    </div>
                )}

                {/* CART SLIDE-UP */}
                {showCart && (
                    <>
                        <div style={{
                            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50,
                            animation: "fadeIn 0.3s ease",
                        }} onClick={() => setShowCart(false)} />
                        <div style={{
                            position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 430,
                            background: "#fff", borderRadius: "24px 24px 0 0",
                            padding: "20px", maxHeight: "80vh", overflowY: "auto", zIndex: 51,
                            animation: "slideUp 0.3s ease",
                            margin: "0 auto", left: "50%", transform: "translateX(-50%)",
                        }}>
                            <div style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(164,0,93,0.1)",
                            }}>
                                <h2 style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: 18, fontWeight: 700, color: "#1F1F1F", margin: 0,
                                }}>
                                    Your Cart
                                </h2>
                                <button onClick={() => setShowCart(false)} style={{
                                    background: "none", border: "none", fontSize: 20, cursor: "pointer",
                                    color: "#6B6B6B",
                                }}>
                                    ✕
                                </button>
                            </div>

                            {/* Cart Items */}
                            <div style={{ marginBottom: 20 }}>
                                {cart.map((item) => (
                                    <div key={item._id} style={{
                                        padding: "12px 0", borderBottom: "1px solid rgba(164,0,93,0.08)",
                                    }}>
                                        <div style={{
                                            display: "flex", justifyContent: "space-between", alignItems: "center",
                                            marginBottom: 8,
                                        }}>
                                            <p style={{
                                                fontWeight: 600, color: "#1F1F1F", fontSize: 14, margin: 0,
                                            }}>
                                                {item.name}
                                            </p>
                                            <p style={{
                                                color: "#A4005D", fontWeight: 700, fontSize: 14, margin: 0,
                                            }}>
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                        <div style={{
                                            display: "flex", alignItems: "center", gap: 10,
                                        }}>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                style={{
                                                    background: "rgba(164,0,93,0.1)", border: "none",
                                                    width: 28, height: 28, borderRadius: 6, fontSize: 16,
                                                    cursor: "pointer", color: "#A4005D", fontWeight: 700,
                                                }}
                                            >
                                                −
                                            </button>
                                            <span style={{
                                                fontSize: 14, fontWeight: 600, color: "#1F1F1F",
                                                minWidth: 20, textAlign: "center",
                                            }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                style={{
                                                    background: "rgba(164,0,93,0.1)", border: "none",
                                                    width: 28, height: 28, borderRadius: 6, fontSize: 16,
                                                    cursor: "pointer", color: "#A4005D", fontWeight: 700,
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div style={{
                                padding: "12px 0", marginBottom: 16, borderTop: "2px solid rgba(164,0,93,0.2)",
                                paddingTop: 12,
                            }}>
                                <div style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1F1F1F" }}>
                                        Total
                                    </span>
                                    <span style={{
                                        fontSize: 18, fontWeight: 700, color: "#A4005D",
                                    }}>
                                        ₹{cartTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={submitting}
                                style={{
                                    width: "100%", padding: "14px", borderRadius: 14,
                                    background: "linear-gradient(90deg,#A4005D,#C44A87)",
                                    color: "#fff", border: "none", fontWeight: 700, fontSize: 15,
                                    cursor: submitting ? "not-allowed" : "pointer",
                                    opacity: submitting ? 0.65 : 1,
                                    transition: "opacity 0.2s ease",
                                }}
                            >
                                {submitting ? "Placing Order..." : `Place Order · ₹${cartTotal}`}
                            </button>
                        </div>
                    </>
                )}

                {/* CONFIRMATION MODAL */}
                {showConfirmation && (
                    <>
                        <div style={{
                            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            animation: "fadeIn 0.3s ease",
                        }} />
                        <div style={{
                            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                            background: "#fff", borderRadius: 20, padding: "24px",
                            maxWidth: 380, width: "90%", zIndex: 51, boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                        }}>
                            <h2 style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: 18, fontWeight: 700, color: "#1F1F1F", marginBottom: 16, margin: "0 0 16px 0",
                            }}>
                                Confirm Order
                            </h2>

                            {/* Order Summary */}
                            <div style={{
                                background: "#F6EADB", padding: 14, borderRadius: 12,
                                marginBottom: 16, maxHeight: 200, overflowY: "auto",
                            }}>
                                {cart.map((item) => (
                                    <div key={item._id} style={{
                                        display: "flex", justifyContent: "space-between",
                                        marginBottom: 8, fontSize: 13, color: "#1F1F1F",
                                    }}>
                                        <span>{item.name} × {item.quantity}</span>
                                        <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div style={{
                                    borderTop: "1px solid rgba(164,0,93,0.2)", paddingTop: 8, marginTop: 8,
                                    display: "flex", justifyContent: "space-between", fontWeight: 700,
                                    color: "#A4005D",
                                }}>
                                    <span>Total</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Warning */}
                            <div style={{
                                background: "rgba(164,0,93,0.1)", border: "1px solid rgba(164,0,93,0.2)",
                                borderRadius: 10, padding: 12, marginBottom: 16,
                            }}>
                                <p style={{
                                    fontSize: 11, color: "#A4005D", fontWeight: 600, margin: 0,
                                }}>
                                    ⚠️ Once ordered, it cannot be cancelled
                                </p>
                            </div>

                            {/* Buttons */}
                            <div style={{ display: "flex", gap: 12 }}>
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    style={{
                                        flex: 1, padding: "12px", borderRadius: 12,
                                        background: "transparent", border: "2px solid #A4005D",
                                        color: "#A4005D", fontWeight: 700, fontSize: 14,
                                        cursor: "pointer", transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = "rgba(164,0,93,0.05)"}
                                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmPlaceOrder}
                                    disabled={submitting}
                                    style={{
                                        flex: 1, padding: "12px", borderRadius: 12,
                                        background: "linear-gradient(90deg,#A4005D,#C44A87)",
                                        color: "#fff", fontWeight: 700, fontSize: 14,
                                        border: "none", cursor: submitting ? "not-allowed" : "pointer",
                                        opacity: submitting ? 0.65 : 1,
                                    }}
                                >
                                    {submitting ? "Processing..." : "Confirm Order"}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}