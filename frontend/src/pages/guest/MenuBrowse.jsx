import { useState, useEffect, useRef } from "react";
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
  const [fadeIn, setFadeIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const categoryScrollRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { fetchMenu(); }, []);

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

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item) => {
    const existing = cart.find((c) => c._id === item._id);
    if (existing) {
      setCart(cart.map((c) => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) setCart(cart.filter((c) => c._id !== id));
    else setCart(cart.map((c) => (c._id === id ? { ...c, quantity: qty } : c)));
  };

  const getItemQty = (id) => cart.find((c) => c._id === id)?.quantity || 0;

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setShowCart(false);
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
      setShowConfirmation(false);
      setSuccessMessage("Order placed successfully");
      setTimeout(() => setSuccessMessage(""), 3500);
    } finally {
      setSubmitting(false);
    }
  };

  const categoryIcons = {
    ALL: "✦", Starters: "🥗", Mains: "🍽️",
    Desserts: "🍮", Beverages: "☕", Breakfast: "🌅", Snacks: "🥨",
  };

  const navItems = [
    {
      key: "home", label: "Home", route: "/guest/dashboard",
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
      ),
    },
    {
      key: "orders", label: "Orders", route: "/guest/orders",
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6" /><path d="M9 16h4" />
        </svg>
      ),
    },
    {
      key: "support", label: "Support", route: "/guest/support",
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <circle cx="12" cy="17" r=".5" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&display=swap');

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulseDot {
          0%,100% { box-shadow:0 0 0 0 rgba(164,0,93,0.5); }
          50%      { box-shadow:0 0 0 5px rgba(164,0,93,0); }
        }
        @keyframes scaleIn {
          0%   { transform: scale(0.85); opacity: 0; }
          60%  { transform: scale(1.06); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.88); }
          60%  { transform: translate(-50%, -50%) scale(1.03); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes cartBounce {
          0%,100% { transform: translateY(0); }
          30%     { transform: translateY(-4px); }
          60%     { transform: translateY(-2px); }
        }
        @keyframes successSlide {
          0%   { opacity:0; transform:translate(-50%, -20px); }
          15%  { opacity:1; transform:translate(-50%, 0); }
          80%  { opacity:1; transform:translate(-50%, 0); }
          100% { opacity:0; transform:translate(-50%, -10px); }
        }

        .card-item {
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(164,0,93,0.07);
          box-shadow: 0 2px 14px rgba(164,0,93,0.06);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          overflow: hidden;
        }
        .card-item:active { transform: scale(0.98); }

        .cat-pill {
          transition: all 0.22s cubic-bezier(0.22,1,0.36,1);
          flex-shrink: 0;
          white-space: nowrap;
          cursor: pointer;
          border: none;
          outline: none;
        }

        .qty-btn { transition: transform 0.15s ease, background 0.15s ease; }
        .qty-btn:active { transform: scale(0.88); }

        .nav-btn { transition: background 0.2s ease, transform 0.15s ease; }
        .nav-btn:active { transform: scale(0.93); }

        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        .cart-sheet::-webkit-scrollbar { width: 4px; }
        .cart-sheet::-webkit-scrollbar-track { background: transparent; }
        .cart-sheet::-webkit-scrollbar-thumb { background: rgba(164,0,93,0.2); border-radius: 2px; }
      `}</style>

      {/* ══ ROOT: fixed full-screen flex column ══ */}
      <div style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        background: "#EFE1CF",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>

        {/* SUCCESS TOAST */}
        {successMessage && (
          <div style={{
            position: "fixed", top: 24, left: "50%",
            zIndex: 200,
            background: "linear-gradient(135deg,#1c8a5c,#22c47a)",
            color: "#fff", padding: "12px 22px",
            borderRadius: 50, boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
            fontWeight: 700, fontSize: 13, letterSpacing: "0.04em",
            animation: "successSlide 3.5s ease forwards",
            display: "flex", alignItems: "center", gap: 8,
            whiteSpace: "nowrap",
          }}>
            <span style={{ fontSize: 16 }}>✓</span>
            {successMessage}
          </div>
        )}

        {/* ① HEADER — flexShrink:0 */}
        <div style={{
          flexShrink: 0,
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(164,0,93,0.1)",
          boxShadow: "0 2px 12px rgba(30,21,16,0.06)",
        }}>
          <div style={{
            display: "flex", alignItems: "center",
            padding: "12px 16px", gap: 12,
            maxWidth: 430, margin: "0 auto",
          }}>
            <button
              onClick={() => navigate("/guest/dashboard")}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(164,0,93,0.07)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#A4005D", fontSize: 18, flexShrink: 0,
              }}
            >←</button>

            <div style={{ flex: 1, textAlign: "center" }}>
              <p style={{
                fontSize: 9, color: "#6B6B6B", fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase",
                margin: "0 0 1px 0",
              }}>In-Room Dining</p>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22, fontWeight: 600, fontStyle: "italic",
                color: "#1F1F1F", margin: 0, lineHeight: 1,
              }}>Order Food</h1>
            </div>

            {guest?.roomNumber ? (
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(164,0,93,0.07)", borderRadius: 20,
                padding: "5px 10px", flexShrink: 0,
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: "#86efac", flexShrink: 0,
                  animation: "pulseDot 2.2s ease-in-out infinite",
                }} />
                <span style={{
                  fontSize: 9, fontWeight: 700, color: "#A4005D",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                }}>{guest.roomNumber}</span>
              </div>
            ) : (
              <div style={{ width: 36 }} />
            )}
          </div>
        </div>

        {/* ② SCROLLABLE BODY — flex:1, overflows */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", background: "#EFE1CF" }}>
          <div style={{ maxWidth: 430, margin: "0 auto", paddingBottom: 24 }}>

            {/* SEARCH */}
            <div style={{ padding: "16px 20px 0" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#fff", borderRadius: 16, padding: "10px 14px",
                border: "1px solid rgba(164,0,93,0.1)",
                boxShadow: "0 2px 10px rgba(164,0,93,0.05)",
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#A4005D" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ width: 18, height: 18, flexShrink: 0, opacity: 0.6 }}>
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes…"
                  style={{
                    flex: 1, border: "none", outline: "none", background: "transparent",
                    fontSize: 14, color: "#1F1F1F",
                    fontFamily: "'Cormorant Garamond', serif", fontWeight: 400,
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#6B6B6B", fontSize: 16, padding: 0, lineHeight: 1,
                  }}>✕</button>
                )}
              </div>
            </div>

            {/* CATEGORIES */}
            <div style={{ paddingTop: 14 }}>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "#6B6B6B",
                marginBottom: 10, paddingLeft: 20,
              }}>Categories</p>
              <div
                ref={categoryScrollRef}
                className="cat-scroll"
                style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 20px 10px" }}
              >
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      className="cat-pill"
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: "8px 14px", borderRadius: 50,
                        background: isActive ? "linear-gradient(90deg,#A4005D,#C44A87)" : "#fff",
                        color: isActive ? "#fff" : "#6B6B6B",
                        fontSize: 12, fontWeight: isActive ? 700 : 500,
                        border: isActive ? "none" : "1px solid rgba(164,0,93,0.12)",
                        boxShadow: isActive ? "0 4px 14px rgba(164,0,93,0.28)" : "0 1px 6px rgba(0,0,0,0.05)",
                      }}
                    >
                      <span style={{ marginRight: 4, fontSize: 11 }}>{categoryIcons[cat] || "◆"}</span>
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DIVIDER */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
              <div style={{ width: 5, height: 5, background: "rgba(164,0,93,0.3)", transform: "rotate(45deg)", flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
            </div>

            {/* MENU ITEMS */}
            <div style={{ padding: "16px 20px 0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <p style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "#6B6B6B", margin: 0,
                }}>
                  {selectedCategory === "ALL" ? "All Dishes" : selectedCategory}
                </p>
                {!loading && (
                  <span style={{
                    fontSize: 10, color: "rgba(164,0,93,0.6)", fontWeight: 600,
                    background: "rgba(164,0,93,0.07)", padding: "3px 10px", borderRadius: 20,
                  }}>{filteredItems.length} items</span>
                )}
              </div>

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[1, 2, 3].map((n) => (
                    <div key={n} style={{
                      background: "rgba(255,255,255,0.6)", borderRadius: 20, padding: 16,
                      border: "1px solid rgba(164,0,93,0.06)",
                      animation: `fadeUp 0.5s ease ${n * 80}ms both`,
                    }}>
                      <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ height: 14, width: "55%", borderRadius: 6, background: "rgba(164,0,93,0.08)", marginBottom: 8 }} />
                          <div style={{ height: 10, width: "80%", borderRadius: 6, background: "rgba(0,0,0,0.05)", marginBottom: 4 }} />
                          <div style={{ height: 10, width: "40%", borderRadius: 6, background: "rgba(0,0,0,0.04)" }} />
                        </div>
                        <div style={{ width: 60, height: 34, borderRadius: 10, background: "rgba(164,0,93,0.1)", alignSelf: "center" }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div style={{
                  background: "#fff", borderRadius: 18, padding: 20, textAlign: "center",
                  border: "1px solid rgba(164,0,93,0.1)",
                }}>
                  <p style={{ fontSize: 13, color: "#A4005D", fontWeight: 500, margin: "0 0 10px 0" }}>{error}</p>
                  <button onClick={fetchMenu} style={{
                    padding: "8px 18px", borderRadius: 10,
                    background: "linear-gradient(90deg,#A4005D,#C44A87)",
                    color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}>Retry</button>
                </div>
              ) : filteredItems.length === 0 ? (
                <div style={{
                  background: "#fff", borderRadius: 18, padding: "28px 20px", textAlign: "center",
                  border: "1px solid rgba(164,0,93,0.07)",
                }}>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#6B6B6B",
                    fontStyle: "italic", margin: 0,
                  }}>No dishes found</p>
                  <p style={{ fontSize: 11, color: "#aaa", marginTop: 4, marginBottom: 0 }}>
                    Try a different category or search term
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {filteredItems.map((item, i) => {
                    const qty = getItemQty(item._id);
                    return (
                      <div
                        key={item._id}
                        className="card-item"
                        style={{ animation: `fadeUp 0.45s ease ${Math.min(i, 6) * 55}ms both` }}
                      >
                        <div style={{ padding: "16px 16px 14px" }}>
                          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                {item.isVeg !== undefined && (
                                  <div style={{
                                    width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                                    border: `1.5px solid ${item.isVeg ? "#22c55e" : "#ef4444"}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                  }}>
                                    <div style={{
                                      width: 7, height: 7, borderRadius: "50%",
                                      background: item.isVeg ? "#22c55e" : "#ef4444",
                                    }} />
                                  </div>
                                )}
                                <p style={{
                                  fontFamily: "'Cormorant Garamond', serif",
                                  fontSize: 16, fontWeight: 600, color: "#1F1F1F",
                                  margin: 0, lineHeight: 1.2,
                                }}>{item.name}</p>
                              </div>
                              {item.description && (
                                <p style={{
                                  fontSize: 11.5, color: "#7a6a60", fontWeight: 300,
                                  margin: "0 0 8px 0", lineHeight: 1.45,
                                  display: "-webkit-box", WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical", overflow: "hidden",
                                }}>{item.description}</p>
                              )}
                              <p style={{
                                fontSize: 15, fontWeight: 700, color: "#A4005D",
                                margin: 0, fontFamily: "'Cormorant Garamond', serif",
                              }}>₹{item.price}</p>
                            </div>

                            <div style={{ flexShrink: 0, display: "flex", alignItems: "flex-end", paddingTop: 2 }}>
                              {qty === 0 ? (
                                <button
                                  onClick={() => addToCart(item)}
                                  style={{
                                    background: "linear-gradient(90deg,#A4005D,#C44A87)",
                                    color: "#fff", border: "none", borderRadius: 12,
                                    padding: "9px 16px", fontSize: 13, fontWeight: 700,
                                    cursor: "pointer", letterSpacing: "0.04em",
                                    boxShadow: "0 3px 10px rgba(164,0,93,0.25)",
                                    animation: "scaleIn 0.3s ease",
                                  }}
                                  onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.94)"; }}
                                  onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                                >Add +</button>
                              ) : (
                                <div style={{
                                  display: "flex", alignItems: "center", gap: 8,
                                  background: "rgba(164,0,93,0.07)", borderRadius: 12,
                                  padding: "4px 6px", border: "1px solid rgba(164,0,93,0.14)",
                                  animation: "scaleIn 0.25s ease",
                                }}>
                                  <button
                                    className="qty-btn"
                                    onClick={() => updateQuantity(item._id, qty - 1)}
                                    style={{
                                      width: 28, height: 28, borderRadius: 8,
                                      background: "rgba(164,0,93,0.12)", border: "none",
                                      color: "#A4005D", cursor: "pointer",
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                    }}
                                  >
                                    {qty === 1 ? (
                                      <svg viewBox="0 0 24 24" fill="none" stroke="#A4005D" strokeWidth="2.5" style={{ width: 12, height: 12 }}>
                                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                                      </svg>
                                    ) : <span style={{ fontSize: 16, fontWeight: 700 }}>−</span>}
                                  </button>
                                  <span style={{
                                    fontSize: 14, fontWeight: 700, color: "#A4005D",
                                    minWidth: 16, textAlign: "center",
                                  }}>{qty}</span>
                                  <button
                                    className="qty-btn"
                                    onClick={() => updateQuantity(item._id, qty + 1)}
                                    style={{
                                      width: 28, height: 28, borderRadius: 8,
                                      background: "linear-gradient(90deg,#A4005D,#C44A87)",
                                      border: "none", color: "#fff", fontSize: 18, fontWeight: 700,
                                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                      boxShadow: "0 2px 6px rgba(164,0,93,0.2)",
                                    }}
                                  >+</button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {qty > 0 && (
                          <div style={{
                            height: 3,
                            background: "linear-gradient(90deg,#A4005D,#C44A87)",
                            borderRadius: "0 0 20px 20px",
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
        {/* end scrollable body */}

        {/* ③ CART BAR — flexShrink:0, only when cart has items */}
        {cartItemCount > 0 && (
          <div style={{
            flexShrink: 0,
            background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(164,0,93,0.15)",
            padding: "10px 20px",
          }}>
            <div style={{ maxWidth: 430, margin: "0 auto" }}>
              <button
                onClick={() => setShowCart(true)}
                style={{
                  width: "100%", padding: "13px 20px",
                  background: "linear-gradient(90deg,#A4005D,#C44A87)",
                  color: "#fff", border: "none", borderRadius: 16,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  cursor: "pointer",
                  boxShadow: "0 4px 18px rgba(164,0,93,0.35)",
                  animation: "cartBounce 0.5s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    background: "rgba(255,255,255,0.25)", borderRadius: 8,
                    padding: "3px 9px", fontSize: 12, fontWeight: 700,
                  }}>{cartItemCount}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>View Cart</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 18, fontWeight: 700,
                  }}>₹{cartTotal}</span>
                  <span style={{ opacity: 0.8 }}>↑</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ④ BOTTOM NAV — flexShrink:0, always visible */}
        <div style={{
          flexShrink: 0,
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(164,0,93,0.1)",
          boxShadow: "0 -2px 20px rgba(30,21,16,0.07)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-around",
            padding: "6px 8px", maxWidth: 430, margin: "0 auto",
          }}>
            {navItems.map((item) => {
              const isActive = item.key === "orders";
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.route)}
                  className="nav-btn"
                  style={{
                    position: "relative",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    padding: "6px 24px", borderRadius: 14,
                    background: isActive ? "rgba(164,0,93,0.07)" : "transparent",
                    border: "none", cursor: "pointer",
                  }}
                >
                  <span style={{ color: isActive ? "#A4005D" : "#6B6B6B", transition: "color 0.2s ease" }}>
                    {item.icon(isActive)}
                  </span>
                  <span style={{
                    fontSize: 7, fontWeight: 700, letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: isActive ? "#A4005D" : "#6B6B6B",
                    transition: "color 0.2s ease",
                  }}>{item.label}</span>
                  {isActive && (
                    <div style={{
                      position: "absolute", bottom: -1, left: "50%",
                      transform: "translateX(-50%)",
                      width: 4, height: 4, borderRadius: "50%", background: "#A4005D",
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ══ CART SHEET (fixed overlay) ══ */}
        {showCart && (
          <>
            <div style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100,
              animation: "fadeIn 0.3s ease",
            }} onClick={() => setShowCart(false)} />
            <div
              className="cart-sheet"
              style={{
                position: "fixed", bottom: 0, left: 0, right: 0,
                maxWidth: 430, margin: "0 auto",
                background: "#EFE1CF",
                borderRadius: "24px 24px 0 0",
                maxHeight: "80vh", overflowY: "auto",
                zIndex: 101,
                animation: "slideUp 0.38s cubic-bezier(0.22,1,0.36,1) both",
                paddingBottom: "env(safe-area-inset-bottom, 0px)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 0" }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(164,0,93,0.2)" }} />
              </div>
              <div style={{ padding: "10px 20px 20px" }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: 16, paddingBottom: 14,
                  borderBottom: "1px solid rgba(164,0,93,0.12)",
                }}>
                  <div>
                    <p style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.18em",
                      textTransform: "uppercase", color: "#6B6B6B", margin: "0 0 2px 0",
                    }}>Your Order</p>
                    <h2 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 22, fontWeight: 600, color: "#1F1F1F",
                      margin: 0, fontStyle: "italic",
                    }}>
                      {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
                    </h2>
                  </div>
                  <button onClick={() => setShowCart(false)} style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(164,0,93,0.08)", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", fontSize: 14, color: "#A4005D", fontWeight: 700,
                  }}>✕</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {cart.map((item) => (
                    <div key={item._id} style={{
                      background: "#fff", borderRadius: 16, padding: "12px 14px",
                      border: "1px solid rgba(164,0,93,0.07)",
                      display: "flex", alignItems: "center", gap: 12,
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 15, fontWeight: 600, color: "#1F1F1F", margin: "0 0 4px 0",
                        }}>{item.name}</p>
                        <p style={{ fontSize: 12, color: "#A4005D", fontWeight: 700, margin: 0 }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: "rgba(164,0,93,0.1)", border: "none",
                            color: "#A4005D", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                          {item.quantity === 1 ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="#A4005D" strokeWidth="2.5" style={{ width: 12, height: 12 }}>
                              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                            </svg>
                          ) : <span style={{ fontSize: 16, fontWeight: 700 }}>−</span>}
                        </button>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#1F1F1F", minWidth: 16, textAlign: "center" }}>
                          {item.quantity}
                        </span>
                        <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: "linear-gradient(90deg,#A4005D,#C44A87)",
                            border: "none", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  background: "#fff", borderRadius: 16, padding: "14px 16px",
                  border: "1px solid rgba(164,0,93,0.1)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: 16,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#6B6B6B", letterSpacing: "0.05em" }}>TOTAL</span>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22, fontWeight: 700, color: "#A4005D",
                  }}>₹{cartTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  style={{
                    width: "100%", padding: "15px",
                    background: "linear-gradient(90deg,#A4005D,#C44A87)",
                    color: "#fff", border: "none", borderRadius: 16,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 18, fontWeight: 600, fontStyle: "italic",
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.65 : 1,
                    boxShadow: "0 6px 20px rgba(164,0,93,0.3)",
                  }}
                >
                  {submitting ? "Placing Order…" : "Place Order"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ══ CONFIRMATION MODAL (fixed overlay) ══ */}
        {showConfirmation && (
          <>
            <div style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 110,
              animation: "fadeIn 0.3s ease",
            }} />
            <div style={{
              position: "fixed", top: "50%", left: "50%",
              background: "#EFE1CF", borderRadius: 24, padding: "24px",
              maxWidth: 380, width: "90%", zIndex: 111,
              boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
              animation: "popIn 0.38s cubic-bezier(0.22,1,0.36,1) both",
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "rgba(164,0,93,0.1)", margin: "0 auto 14px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#A4005D" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>

              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22, fontWeight: 700, color: "#1F1F1F",
                margin: "0 0 4px 0", textAlign: "center", fontStyle: "italic",
              }}>Confirm Order</h2>
              <p style={{ fontSize: 11, color: "#6B6B6B", textAlign: "center", margin: "0 0 16px 0" }}>
                Your order will be delivered to Room {guest?.roomNumber}
              </p>

              <div style={{
                background: "#fff", padding: "12px 14px", borderRadius: 16,
                marginBottom: 12, maxHeight: 180, overflowY: "auto",
                border: "1px solid rgba(164,0,93,0.08)",
              }}>
                {cart.map((item) => (
                  <div key={item._id} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "6px 0", fontSize: 13, color: "#1F1F1F",
                    borderBottom: "1px solid rgba(164,0,93,0.05)",
                  }}>
                    <span>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 700, color: "#A4005D" }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  paddingTop: 8, marginTop: 4,
                }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#6B6B6B", letterSpacing: "0.05em" }}>TOTAL</span>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 18, fontWeight: 700, color: "#A4005D",
                  }}>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div style={{
                background: "rgba(164,0,93,0.07)", border: "1px solid rgba(164,0,93,0.14)",
                borderRadius: 12, padding: "10px 14px", marginBottom: 18,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <p style={{ fontSize: 11, color: "#A4005D", fontWeight: 600, margin: 0 }}>
                  Orders cannot be cancelled once placed
                </p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => { setShowConfirmation(false); setShowCart(true); }}
                  style={{
                    flex: 1, padding: "13px", borderRadius: 14,
                    background: "transparent", border: "1.5px solid rgba(164,0,93,0.25)",
                    color: "#A4005D", fontWeight: 700, fontSize: 14, cursor: "pointer",
                  }}
                >Back</button>
                <button
                  onClick={confirmPlaceOrder}
                  disabled={submitting}
                  style={{
                    flex: 2, padding: "13px", borderRadius: 14,
                    background: "linear-gradient(90deg,#A4005D,#C44A87)",
                    color: "#fff", fontWeight: 700, fontSize: 14,
                    border: "none", cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.65 : 1,
                    boxShadow: "0 4px 14px rgba(164,0,93,0.3)",
                  }}
                >
                  {submitting ? "Processing…" : "Confirm & Order"}
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </>
  );
}