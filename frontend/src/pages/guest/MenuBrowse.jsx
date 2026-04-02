import { useState, useEffect, useRef } from "react";
import { useGuestAuth } from "../../context/GuestAuthContext";
import { getGuestMenu, placeOrder } from "../../services/guest.service";
import {
  extractMenuImageValue,
  resolveMenuImageSrc,
} from "../../services/menuImage.service";
import { useNavigate } from "react-router-dom";
import GuestBottomNav from "../../components/guest/GuestBottomNav";

const NAV_HEIGHT = 76;
const OVERLAY_Z = 10050;

const asFiniteNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeText = (value) => String(value || "").trim();

const normalizeItemOptions = (item) => {
  if (!Array.isArray(item?.options)) return [];
  return item.options
    .map((option) => ({
      label: normalizeText(option?.label),
      price: asFiniteNumber(option?.price, NaN),
    }))
    .filter((option) => option.label && Number.isFinite(option.price) && option.price >= 0);
};

const normalizeItemAddons = (item) => {
  if (!Array.isArray(item?.addons)) return [];
  return item.addons
    .map((addon) => ({
      name: normalizeText(addon?.name),
      price: asFiniteNumber(addon?.price, NaN),
    }))
    .filter((addon) => addon.name && Number.isFinite(addon.price) && addon.price >= 0);
};

// Warm gradient placeholders by category
const categoryGradients = {
  ALL:       "linear-gradient(135deg,#c9a96e 0%,#a0522d 100%)",
  Starters:  "linear-gradient(135deg,#d4a853 0%,#8b6520 100%)",
  Mains:     "linear-gradient(135deg,#b5651d 0%,#7a3e1a 100%)",
  Desserts:  "linear-gradient(135deg,#c87b8a 0%,#8b3a5e 100%)",
  Beverages: "linear-gradient(135deg,#6b9ab8 0%,#2c5f7a 100%)",
  Breakfast: "linear-gradient(135deg,#e8b56a 0%,#b87333 100%)",
  Snacks:    "linear-gradient(135deg,#a8c57a 0%,#5a7a3a 100%)",
};

const categoryIcons = {
  ALL: "✦", Starters: "🥗", Mains: "🍽️",
  Desserts: "🍮", Beverages: "☕", Breakfast: "🌅", Snacks: "🥨",
};

const PlaceholderDish = ({ category, name }) => {
  const grad = categoryGradients[category] || categoryGradients.ALL;
  const initial = (name || "?")[0].toUpperCase();
  return (
    <div style={{
      width: "100%", height: "100%",
      background: grad,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", width: 120, height: 120,
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "50%", top: -30, right: -30,
      }} />
      <div style={{
        position: "absolute", width: 80, height: 80,
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "50%", bottom: -20, left: -20,
      }} />
      <span style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 32, fontWeight: 600, color: "rgba(255,255,255,0.85)",
        fontStyle: "italic", zIndex: 1,
      }}>{initial}</span>
    </div>
  );
};

export default function MenuBrowse() {
  const { guest } = useGuestAuth();
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
  const [orderNotes, setOrderNotes] = useState("");
  const [activeItem, setActiveItem] = useState(null);
  const [selectedOptionLabel, setSelectedOptionLabel] = useState("");
  const [selectedAddonNames, setSelectedAddonNames] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
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

  const getComputedPrice = (item, optionLabel, addonNames) => {
    const options = normalizeItemOptions(item);
    const addons = normalizeItemAddons(item);
    const selectedOption = options.find((o) => o.label === optionLabel);
    const basePrice = selectedOption ? selectedOption.price : asFiniteNumber(item?.price, 0);
    const addonTotal = addons
      .filter((a) => addonNames.includes(a.name))
      .reduce((sum, a) => sum + a.price, 0);
    return basePrice + addonTotal;
  };

  const getItemImageSrc = (item) => {
    if (imageErrors[item._id]) return "";
    return resolveMenuImageSrc(extractMenuImageValue(item));
  };

  const openItemDetails = (item) => {
    const options = normalizeItemOptions(item);
    setActiveItem(item);
    setSelectedOptionLabel(options[0]?.label || "");
    setSelectedAddonNames([]);
  };

  const closeItemDetails = () => {
    setActiveItem(null);
    setSelectedOptionLabel("");
    setSelectedAddonNames([]);
  };

  const toggleAddonSelection = (addonName) => {
    setSelectedAddonNames((prev) =>
      prev.includes(addonName) ? prev.filter((n) => n !== addonName) : [...prev, addonName]
    );
  };

  const addActiveItemToCart = () => {
    if (!activeItem) return;
    const options = normalizeItemOptions(activeItem);
    const addons = normalizeItemAddons(activeItem);
    const selectedOption = options.find((o) => o.label === selectedOptionLabel);
    const chosenAddonNames = addons
      .filter((a) => selectedAddonNames.includes(a.name))
      .map((a) => a.name).sort();

    const lineParts = [];
    if (selectedOption?.label) lineParts.push(selectedOption.label);
    if (chosenAddonNames.length > 0) lineParts.push(`+ ${chosenAddonNames.join(", ")}`);

    const displayName = lineParts.length > 0
      ? `${activeItem.name} (${lineParts.join(" | ")})`
      : activeItem.name;

    const cartKey = [activeItem._id, selectedOption?.label || "base", chosenAddonNames.join("|") || "no-addons"].join("::");
    const unitPrice = getComputedPrice(activeItem, selectedOption?.label || "", chosenAddonNames);

    setCart((prev) => {
      const existing = prev.find((e) => e.cartKey === cartKey);
      if (existing) {
        return prev.map((e) => e.cartKey === cartKey ? { ...e, quantity: e.quantity + 1 } : e);
      }
      return [...prev, {
        cartKey, _id: activeItem._id, name: displayName,
        menuItemName: activeItem.name, quantity: 1, price: unitPrice,
        selectedOptionLabel: selectedOption?.label || "",
        selectedAddonNames: chosenAddonNames,
      }];
    });
    closeItemDetails();
  };

  const updateQuantity = (cartKey, qty) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((e) => e.cartKey !== cartKey);
      return prev.map((e) => e.cartKey === cartKey ? { ...e, quantity: qty } : e);
    });
  };

  const getItemQty = (id) =>
    cart.filter((e) => e._id === id).reduce((sum, e) => sum + e.quantity, 0);

  const activeOptions = activeItem ? normalizeItemOptions(activeItem) : [];
  const activeAddons = activeItem ? normalizeItemAddons(activeItem) : [];
  const activeImageSrc = activeItem ? getItemImageSrc(activeItem) : "";
  const activePrice = activeItem ? getComputedPrice(activeItem, selectedOptionLabel, selectedAddonNames) : 0;

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
          qty: item.quantity,
          selectedOptionLabel: item.selectedOptionLabel || "",
          selectedAddonNames: Array.isArray(item.selectedAddonNames) ? item.selectedAddonNames : [],
        })),
        notes: String(orderNotes || "").trim(),
      });
      setCart([]);
      setOrderNotes("");
      setShowConfirmation(false);
      setSuccessMessage("Order placed successfully");
      setTimeout(() => setSuccessMessage(""), 3500);
    } finally {
      setSubmitting(false);
    }
  };

  const CART_BAR_H = cartItemCount > 0 ? 80 : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes pulseDot {
          0%,100% { box-shadow:0 0 0 0 rgba(196,74,135,0.5); }
          50%      { box-shadow:0 0 0 5px rgba(196,74,135,0); }
        }
        @keyframes popIn {
          0%   { transform: translate(-50%,-50%) scale(0.88); opacity:0; }
          65%  { transform: translate(-50%,-50%) scale(1.03); }
          100% { transform: translate(-50%,-50%) scale(1); opacity:1; }
        }
        @keyframes cartBounce {
          0%,100% { transform:translateY(0); }
          30%     { transform:translateY(-5px); }
          60%     { transform:translateY(-2px); }
        }
        @keyframes successSlide {
          0%   { opacity:0; transform:translate(-50%,-20px); }
          15%  { opacity:1; transform:translate(-50%,0); }
          80%  { opacity:1; transform:translate(-50%,0); }
          100% { opacity:0; transform:translate(-50%,-10px); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes badgePop {
          0%   { transform: scale(0.5); opacity:0; }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1); opacity:1; }
        }

        .menu-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(164,0,93,0.06);
          box-shadow: 0 2px 16px rgba(30,18,10,0.07), 0 1px 3px rgba(0,0,0,0.04);
          transition: transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s ease;
          animation: fadeUp 0.45s ease both;
          -webkit-tap-highlight-color: transparent;
        }
        .menu-card:active {
          transform: scale(0.975);
          box-shadow: 0 1px 8px rgba(30,18,10,0.08);
        }

        .cat-pill {
          transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
          flex-shrink: 0;
          white-space: nowrap;
          cursor: pointer;
          border: none;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .qty-btn {
          transition: transform 0.15s ease, opacity 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .qty-btn:active { transform: scale(0.85); }

        .add-btn {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .add-btn:active { transform: scale(0.95); }

        .cat-scroll::-webkit-scrollbar { display:none; }
        .cat-scroll { -ms-overflow-style:none; scrollbar-width:none; }

        .sheet-scroll::-webkit-scrollbar { width:3px; }
        .sheet-scroll::-webkit-scrollbar-track { background:transparent; }
        .sheet-scroll::-webkit-scrollbar-thumb { background:rgba(164,0,93,0.18); border-radius:2px; }

        .skeleton {
          background: linear-gradient(90deg, #f0e8dc 25%, #e8ddd0 50%, #f0e8dc 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        .custom-radio {
          width: 18px; height: 18px;
          border-radius: 50%;
          border: 2px solid rgba(164,0,93,0.3);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }
        .custom-radio.selected {
          border-color: #A4005D;
          background: #A4005D;
        }
        .custom-radio.selected::after {
          content: '';
          width: 6px; height: 6px;
          background: #fff;
          border-radius: 50%;
        }

        .custom-check {
          width: 18px; height: 18px;
          border-radius: 5px;
          border: 2px solid rgba(164,0,93,0.3);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }
        .custom-check.selected {
          border-color: #A4005D;
          background: #A4005D;
        }
        .custom-check.selected::after {
          content: '✓';
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          line-height: 1;
        }

        .option-row, .addon-row {
          display: flex; align-items: center;
          justify-content: space-between;
          border-radius: 12px; padding: 11px 14px;
          cursor: pointer;
          transition: all 0.18s ease;
          border: 1.5px solid transparent;
        }

        input[type="radio"], input[type="checkbox"] { display: none; }
      `}</style>

      {/* ROOT */}
      <div style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        background: "#F5EDE0",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}>

        {/* SUCCESS TOAST */}
        {successMessage && (
          <div style={{
            position: "fixed", top: 24, left: "50%",
            zIndex: 70,
            background: "linear-gradient(135deg,#1c8a5c,#22c47a)",
            color: "#fff", padding: "12px 24px",
            borderRadius: 50, boxShadow: "0 8px 28px rgba(28,138,92,0.35)",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, fontSize: 13, letterSpacing: "0.03em",
            animation: "successSlide 3.5s ease forwards",
            display: "flex", alignItems: "center", gap: 8,
            whiteSpace: "nowrap",
          }}>
            <span style={{
              width: 20, height: 20, borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 900,
            }}>✓</span>
            Order placed! Preparing your meal…
          </div>
        )}

        {/* ① HEADER */}
        <div style={{
          flexShrink: 0,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(164,0,93,0.08)",
          boxShadow: "0 1px 0 rgba(164,0,93,0.05), 0 4px 20px rgba(30,18,10,0.06)",
        }}>
          <div style={{
            display: "flex", alignItems: "center",
            padding: "14px 16px", gap: 12,
            maxWidth: 430, margin: "0 auto",
          }}>
            <button
              onClick={() => navigate("/guest/dashboard")}
              style={{
                width: 38, height: 38, borderRadius: 12,
                background: "rgba(164,0,93,0.07)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#A4005D", flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#A4005D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>

            <div style={{ flex: 1, textAlign: "center" }}>
              <p style={{
                fontSize: 9, color: "#A4005D", fontWeight: 600,
                letterSpacing: "0.22em", textTransform: "uppercase",
                margin: "0 0 2px 0",
                fontFamily: "'DM Sans', sans-serif",
                opacity: 0.7,
              }}>In-Room Dining</p>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22, fontWeight: 600, fontStyle: "italic",
                color: "#1A1008", margin: 0, lineHeight: 1,
              }}>Our Menu</h1>
            </div>

            {guest?.roomNumber ? (
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(164,0,93,0.07)", borderRadius: 10,
                padding: "6px 10px", flexShrink: 0,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#22c55e", flexShrink: 0,
                  animation: "pulseDot 2.2s ease-in-out infinite",
                }} />
                <span style={{
                  fontSize: 10, fontWeight: 700, color: "#A4005D",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif",
                }}>{guest.roomNumber}</span>
              </div>
            ) : <div style={{ width: 38 }} />}
          </div>
        </div>

        {/* ② SCROLLABLE BODY */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", background: "#F5EDE0" }}>
          <div style={{
            maxWidth: 430, margin: "0 auto",
            paddingBottom: NAV_HEIGHT + CART_BAR_H + 20,
          }}>

            {/* SEARCH */}
            <div style={{ padding: "16px 16px 0" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#fff", borderRadius: 14, padding: "11px 14px",
                border: "1px solid rgba(164,0,93,0.1)",
                boxShadow: "0 2px 12px rgba(164,0,93,0.06)",
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#A4005D" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ width: 16, height: 16, flexShrink: 0, opacity: 0.5 }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes, ingredients…"
                  style={{
                    flex: 1, border: "none", outline: "none", background: "transparent",
                    fontSize: 13.5, color: "#1A1008",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} style={{
                    background: "rgba(164,0,93,0.1)", border: "none", cursor: "pointer",
                    color: "#A4005D", fontSize: 10, padding: "3px 6px",
                    borderRadius: 6, lineHeight: 1, fontWeight: 700,
                  }}>✕</button>
                )}
              </div>
            </div>

            {/* CATEGORIES */}
            <div style={{ paddingTop: 16 }}>
              <div
                ref={categoryScrollRef}
                className="cat-scroll"
                style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 16px 4px" }}
              >
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      className="cat-pill"
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: "9px 16px", borderRadius: 12,
                        background: isActive ? "#A4005D" : "#fff",
                        color: isActive ? "#fff" : "#6B6060",
                        fontSize: 12.5,
                        fontWeight: isActive ? 600 : 400,
                        border: isActive ? "1px solid transparent" : "1px solid rgba(164,0,93,0.12)",
                        boxShadow: isActive ? "0 4px 16px rgba(164,0,93,0.3)" : "0 1px 4px rgba(0,0,0,0.05)",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      <span style={{ marginRight: 5, fontSize: 12 }}>{categoryIcons[cat] || "◆"}</span>
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION HEADER */}
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 16px 12px",
            }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 20, fontWeight: 600, fontStyle: "italic",
                color: "#1A1008", margin: 0,
              }}>
                {selectedCategory === "ALL" ? "All Dishes" : selectedCategory}
              </h2>
              {!loading && (
                <span style={{
                  fontSize: 11, color: "#A4005D", fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  background: "rgba(164,0,93,0.08)",
                  padding: "4px 10px", borderRadius: 8,
                }}>{filteredItems.length} dishes</span>
              )}
            </div>

            {/* MENU CARDS */}
            <div style={{ padding: "0 16px" }}>
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="skeleton" style={{
                      borderRadius: 20, height: 120,
                    }} />
                  ))}
                </div>
              ) : error ? (
                <div style={{
                  background: "#fff", borderRadius: 20, padding: 24, textAlign: "center",
                  border: "1px solid rgba(164,0,93,0.1)",
                }}>
                  <p style={{ fontSize: 13, color: "#A4005D", fontWeight: 500, margin: "0 0 12px 0", fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
                  <button onClick={fetchMenu} style={{
                    padding: "9px 20px", borderRadius: 10,
                    background: "#A4005D",
                    color: "#fff", border: "none", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  }}>Try Again</button>
                </div>
              ) : filteredItems.length === 0 ? (
                <div style={{
                  background: "#fff", borderRadius: 20, padding: "32px 20px", textAlign: "center",
                  border: "1px solid rgba(164,0,93,0.07)",
                }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🍽️</div>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20, color: "#6B6060", fontStyle: "italic", margin: "0 0 4px 0",
                  }}>Nothing found</p>
                  <p style={{
                    fontSize: 12, color: "#aaa", marginBottom: 0,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>Try a different category or search</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {filteredItems.map((item, i) => {
                    const qty = getItemQty(item._id);
                    const options = normalizeItemOptions(item);
                    const imageSrc = getItemImageSrc(item);
                    const hasImage = Boolean(imageSrc);
                    const fromPrice = options.length > 0
                      ? Math.min(...options.map((o) => o.price))
                      : asFiniteNumber(item.price, 0);

                    return (
                      <div
                        key={item._id}
                        className="menu-card"
                        role="button"
                        tabIndex={0}
                        onClick={() => openItemDetails(item)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openItemDetails(item); }
                        }}
                        style={{ animationDelay: `${Math.min(i, 7) * 50}ms` }}
                      >
                        <div style={{ display: "flex", alignItems: "stretch", minHeight: 110 }}>

                          {/* IMAGE / PLACEHOLDER */}
                          <div style={{
                            width: 110, flexShrink: 0,
                            position: "relative", overflow: "hidden",
                          }}>
                            {hasImage ? (
                              <img
                                src={imageSrc}
                                alt={item.name}
                                onError={() => setImageErrors((prev) => ({ ...prev, [item._id]: true }))}
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                              />
                            ) : (
                              <PlaceholderDish category={item.category} name={item.name} />
                            )}

                            {qty > 0 && (
                              <div style={{
                                position: "absolute", top: 8, left: 8,
                                width: 24, height: 24,
                                background: "#A4005D",
                                borderRadius: "50%",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 11, fontWeight: 800, color: "#fff",
                                boxShadow: "0 2px 8px rgba(164,0,93,0.4)",
                                animation: "badgePop 0.3s cubic-bezier(0.22,1,0.36,1)",
                                fontFamily: "'DM Sans', sans-serif",
                              }}>{qty}</div>
                            )}
                          </div>

                          {/* CONTENT */}
                          <div style={{
                            flex: 1, padding: "14px 14px 12px",
                            display: "flex", flexDirection: "column",
                            justifyContent: "space-between", minWidth: 0,
                          }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6, marginBottom: 4 }}>
                                <p style={{
                                  fontFamily: "'Cormorant Garamond', serif",
                                  fontSize: 17, fontWeight: 600, color: "#1A1008",
                                  margin: 0, lineHeight: 1.2, flex: 1,
                                }}>{item.name}</p>

                                {item.isVeg !== undefined && (
                                  <div style={{
                                    flexShrink: 0, marginTop: 2,
                                    width: 16, height: 16, borderRadius: 3,
                                    border: `1.5px solid ${item.isVeg ? "#22c55e" : "#ef4444"}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                  }}>
                                    <div style={{
                                      width: 8, height: 8, borderRadius: "50%",
                                      background: item.isVeg ? "#22c55e" : "#ef4444",
                                    }} />
                                  </div>
                                )}
                              </div>

                              {item.description && (
                                <p style={{
                                  fontSize: 11.5, color: "#8a7060",
                                  fontFamily: "'DM Sans', sans-serif",
                                  fontWeight: 300, margin: "0 0 8px 0", lineHeight: 1.5,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}>{item.description}</p>
                              )}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <div>
                                {options.length > 0 && (
                                  <p style={{
                                    fontSize: 9, color: "#aaa", margin: "0 0 1px 0",
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontWeight: 500, letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                  }}>from</p>
                                )}
                                <p style={{
                                  fontFamily: "'Cormorant Garamond', serif",
                                  fontSize: 18, fontWeight: 700, color: "#A4005D",
                                  margin: 0, lineHeight: 1,
                                }}>₹{fromPrice}</p>
                              </div>

                              <button
                                className="add-btn"
                                onClick={(e) => { e.stopPropagation(); openItemDetails(item); }}
                                style={{
                                  width: 32, height: 32, borderRadius: 10,
                                  background: qty > 0 ? "#A4005D" : "rgba(164,0,93,0.1)",
                                  border: "none", cursor: "pointer",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  boxShadow: qty > 0 ? "0 4px 12px rgba(164,0,93,0.35)" : "none",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <svg viewBox="0 0 24 24" fill="none"
                                  stroke={qty > 0 ? "#fff" : "#A4005D"}
                                  strokeWidth="2.5" strokeLinecap="round"
                                  style={{ width: 14, height: 14 }}>
                                  <path d="M12 5v14M5 12h14"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        {qty > 0 && (
                          <div style={{
                            height: 3,
                            background: "linear-gradient(90deg,#A4005D,#C44A87)",
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

        {/* ③ CART BAR */}
        {cartItemCount > 0 && (
          <div style={{
            position: "fixed",
            bottom: NAV_HEIGHT,
            left: 0, right: 0,
            zIndex: 9998,
            padding: "10px 16px",
            maxWidth: 430,
            margin: "0 auto",
          }}>
            <button
              onClick={() => setShowCart(true)}
              style={{
                width: "100%", padding: "14px 20px",
                background: "#A4005D",
                color: "#fff", border: "none", borderRadius: 16,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer",
                boxShadow: "0 6px 24px rgba(164,0,93,0.4)",
                animation: "cartBounce 0.45s ease",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 26, height: 26,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800,
                }}>{cartItemCount}</div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>View Cart</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 20, fontWeight: 700,
                }}>₹{cartTotal.toFixed(0)}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" style={{ width: 14, height: 14 }}>
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          </div>
        )}

        <GuestBottomNav />

        {/* ══ ITEM DETAILS SHEET ══ */}
        {activeItem && (
          <>
            <div style={{
              position: "fixed", inset: 0,
              background: "rgba(15,8,4,0.55)",
              zIndex: OVERLAY_Z,
              animation: "fadeIn 0.25s ease",
              backdropFilter: "blur(4px)",
            }} onClick={closeItemDetails} />

            <div className="sheet-scroll" style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              maxWidth: 430, margin: "0 auto",
              background: "#F5EDE0",
              borderRadius: "24px 24px 0 0",
              maxHeight: "88vh",
              overflowY: "auto",
              zIndex: OVERLAY_Z + 1,
              animation: "slideUp 0.32s cubic-bezier(0.22,1,0.36,1) both",
              paddingBottom: "env(safe-area-inset-bottom, 16px)",
            }}>
              {/* Hero image */}
              <div style={{
                width: "100%", height: 200,
                position: "relative", overflow: "hidden",
                borderRadius: "24px 24px 0 0",
              }}>
                {activeImageSrc ? (
                  <img
                    src={activeImageSrc}
                    alt={activeItem.name}
                    onError={() => setImageErrors((prev) => ({ ...prev, [activeItem._id]: true }))}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <PlaceholderDish category={activeItem.category} name={activeItem.name} />
                )}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
                  background: "linear-gradient(to top, rgba(245,237,224,0.95), transparent)",
                }} />
                <button
                  onClick={closeItemDetails}
                  style={{
                    position: "absolute", top: 14, right: 14,
                    width: 34, height: 34, borderRadius: "50%",
                    background: "rgba(0,0,0,0.35)",
                    border: "none", color: "#fff", fontSize: 14,
                    cursor: "pointer", backdropFilter: "blur(8px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >✕</button>
                {activeItem.isVeg !== undefined && (
                  <div style={{
                    position: "absolute", top: 14, left: 14,
                    background: "rgba(255,255,255,0.92)",
                    borderRadius: 8, padding: "4px 8px",
                    display: "flex", alignItems: "center", gap: 5,
                    backdropFilter: "blur(8px)",
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: activeItem.isVeg ? "#22c55e" : "#ef4444",
                    }} />
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: "#1A1008",
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                    }}>{activeItem.isVeg ? "Veg" : "Non-Veg"}</span>
                  </div>
                )}
              </div>

              <div style={{ padding: "4px 20px 24px" }}>
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 26, fontStyle: "italic",
                    fontWeight: 600, color: "#1A1008",
                    margin: "0 0 6px 0",
                  }}>{activeItem.name}</h3>
                  {activeItem.description && (
                    <p style={{
                      fontSize: 13, color: "#8a7060",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300, margin: 0, lineHeight: 1.6,
                    }}>{activeItem.description}</p>
                  )}
                </div>

                {activeOptions.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{
                      margin: "0 0 10px 0", fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      color: "#8a7060", fontFamily: "'DM Sans', sans-serif",
                    }}>Choose Portion</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {activeOptions.map((option) => {
                        const isSelected = selectedOptionLabel === option.label;
                        return (
                          <label
                            key={`${activeItem._id}-opt-${option.label}`}
                            className="option-row"
                            style={{
                              background: isSelected ? "rgba(164,0,93,0.07)" : "#fff",
                              borderColor: isSelected ? "rgba(164,0,93,0.3)" : "rgba(164,0,93,0.1)",
                              cursor: "pointer",
                            }}
                            onClick={() => setSelectedOptionLabel(option.label)}
                          >
                            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div className={`custom-radio ${isSelected ? "selected" : ""}`} />
                              <span style={{ fontSize: 14, color: "#1A1008", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
                                {option.label}
                              </span>
                            </span>
                            <span style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: 18, color: "#A4005D", fontWeight: 700,
                            }}>₹{option.price}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeAddons.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{
                      margin: "0 0 10px 0", fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      color: "#8a7060", fontFamily: "'DM Sans', sans-serif",
                    }}>Add-ons</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {activeAddons.map((addon) => {
                        const isChecked = selectedAddonNames.includes(addon.name);
                        return (
                          <label
                            key={`${activeItem._id}-addon-${addon.name}`}
                            className="addon-row"
                            style={{
                              background: isChecked ? "rgba(164,0,93,0.07)" : "#fff",
                              borderColor: isChecked ? "rgba(164,0,93,0.3)" : "rgba(164,0,93,0.1)",
                              cursor: "pointer",
                            }}
                            onClick={() => toggleAddonSelection(addon.name)}
                          >
                            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div className={`custom-check ${isChecked ? "selected" : ""}`} />
                              <span style={{ fontSize: 14, color: "#1A1008", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
                                {addon.name}
                              </span>
                            </span>
                            <span style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: 16, color: "#A4005D", fontWeight: 700,
                            }}>+₹{addon.price}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div style={{
                  background: "#fff", border: "1px solid rgba(164,0,93,0.1)",
                  borderRadius: 16, padding: "14px 16px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: 14,
                }}>
                  <div>
                    <p style={{
                      margin: 0, fontSize: 9, color: "#8a7060",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase",
                    }}>Total Price</p>
                    <p style={{
                      margin: "2px 0 0 0", fontSize: 9, color: "#aaa",
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                    }}>incl. all selections</p>
                  </div>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 30, fontWeight: 700, color: "#A4005D", lineHeight: 1,
                  }}>₹{activePrice}</span>
                </div>

                <button
                  className="add-btn"
                  onClick={addActiveItemToCart}
                  style={{
                    width: "100%", padding: "15px",
                    border: "none", borderRadius: 14,
                    background: "#A4005D",
                    color: "#fff",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700, fontSize: 15,
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(164,0,93,0.35)",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8,
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" style={{ width: 16, height: 16 }}>
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </>
        )}

        {/* ══ CART SHEET ══ */}
        {showCart && (
          <>
            <div style={{
              position: "fixed", inset: 0,
              background: "rgba(15,8,4,0.55)",
              zIndex: OVERLAY_Z,
              animation: "fadeIn 0.3s ease",
              backdropFilter: "blur(4px)",
            }} onClick={() => setShowCart(false)} />
            <div className="sheet-scroll" style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              maxWidth: 430, margin: "0 auto",
              background: "#F5EDE0",
              borderRadius: "24px 24px 0 0",
              maxHeight: "80vh", overflowY: "auto",
              zIndex: OVERLAY_Z + 1,
              animation: "slideUp 0.38s cubic-bezier(0.22,1,0.36,1) both",
              paddingBottom: "env(safe-area-inset-bottom, 16px)",
            }}>
              <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
                <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(164,0,93,0.2)" }} />
              </div>

              <div style={{ padding: "12px 20px 24px" }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: 20, paddingBottom: 16,
                  borderBottom: "1px solid rgba(164,0,93,0.1)",
                }}>
                  <div>
                    <p style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.18em",
                      textTransform: "uppercase", color: "#8a7060",
                      margin: "0 0 3px 0", fontFamily: "'DM Sans', sans-serif",
                    }}>Your Order</p>
                    <h2 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 24, fontWeight: 600, color: "#1A1008",
                      margin: 0, fontStyle: "italic",
                    }}>
                      {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
                    </h2>
                  </div>
                  <button onClick={() => setShowCart(false)} style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: "rgba(164,0,93,0.08)", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#A4005D" strokeWidth="2.5" strokeLinecap="round" style={{ width: 14, height: 14 }}>
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {cart.map((item) => (
                    <div key={item.cartKey || item._id} style={{
                      background: "#fff", borderRadius: 16, padding: "12px 14px",
                      border: "1px solid rgba(164,0,93,0.07)",
                      display: "flex", alignItems: "center", gap: 12,
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 15, fontWeight: 600, color: "#1A1008",
                          margin: "0 0 4px 0",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>{item.name}</p>
                        <p style={{
                          fontSize: 14, color: "#A4005D", fontWeight: 700, margin: 0,
                          fontFamily: "'Cormorant Garamond', serif",
                        }}>₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <button className="qty-btn" onClick={() => updateQuantity(item.cartKey || item._id, item.quantity - 1)}
                          style={{
                            width: 30, height: 30, borderRadius: 9,
                            background: "rgba(164,0,93,0.09)", border: "none",
                            color: "#A4005D", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                          {item.quantity === 1 ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="#A4005D" strokeWidth="2.2" style={{ width: 11, height: 11 }}>
                              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                            </svg>
                          ) : <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>−</span>}
                        </button>
                        <span style={{
                          fontSize: 14, fontWeight: 700, color: "#1A1008",
                          minWidth: 18, textAlign: "center",
                          fontFamily: "'DM Sans', sans-serif",
                        }}>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.cartKey || item._id, item.quantity + 1)}
                          style={{
                            width: 30, height: 30, borderRadius: 9,
                            background: "#A4005D",
                            border: "none", color: "#fff",
                            cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 18, fontWeight: 700,
                          }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  background: "#fff", borderRadius: 14,
                  padding: "14px 16px", border: "1px solid rgba(164,0,93,0.08)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: 16,
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: "#8a7060",
                    letterSpacing: "0.12em", fontFamily: "'DM Sans', sans-serif",
                    textTransform: "uppercase",
                  }}>Total</span>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 26, fontWeight: 700, color: "#A4005D",
                  }}>₹{cartTotal.toFixed(2)}</span>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label htmlFor="order-notes" style={{
                    display: "block", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.16em", textTransform: "uppercase",
                    color: "#8a7060", marginBottom: 8,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>Special Request</label>
                  <textarea
                    id="order-notes"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows={2}
                    maxLength={250}
                    placeholder="E.g. no onions, extra spicy, allergen note…"
                    style={{
                      width: "100%", borderRadius: 12,
                      border: "1px solid rgba(164,0,93,0.14)",
                      padding: "10px 12px", fontSize: 13, outline: "none",
                      background: "#fff", resize: "none",
                      fontFamily: "'DM Sans', sans-serif",
                      color: "#1A1008",
                    }}
                  />
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  style={{
                    width: "100%", padding: "15px",
                    background: "#A4005D",
                    color: "#fff", border: "none", borderRadius: 14,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20, fontWeight: 600, fontStyle: "italic",
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.65 : 1,
                    boxShadow: "0 6px 20px rgba(164,0,93,0.35)",
                  }}
                >
                  {submitting ? "Placing Order…" : "Place Order →"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ══ CONFIRMATION MODAL ══ */}
        {showConfirmation && (
          <>
            <div style={{
              position: "fixed", inset: 0,
              background: "rgba(15,8,4,0.6)",
              zIndex: OVERLAY_Z + 2,
              animation: "fadeIn 0.3s ease",
              backdropFilter: "blur(6px)",
            }} />
            <div style={{
              position: "fixed", top: "50%", left: "50%",
              background: "#F5EDE0", borderRadius: 24, padding: "28px 24px",
              maxWidth: 380, width: "90%",
              zIndex: OVERLAY_Z + 3,
              boxShadow: "0 30px 70px rgba(0,0,0,0.3)",
              animation: "popIn 0.38s cubic-bezier(0.22,1,0.36,1) both",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: "rgba(164,0,93,0.1)",
                margin: "0 auto 16px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#A4005D" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>

              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24, fontWeight: 700, color: "#1A1008",
                margin: "0 0 4px 0", textAlign: "center", fontStyle: "italic",
              }}>Confirm Order</h2>
              <p style={{
                fontSize: 12, color: "#8a7060", textAlign: "center",
                margin: "0 0 18px 0", fontFamily: "'DM Sans', sans-serif",
              }}>
                Delivering to Room <strong style={{ color: "#A4005D" }}>{guest?.roomNumber}</strong>
              </p>

              <div style={{
                background: "#fff", padding: "12px 14px", borderRadius: 14,
                marginBottom: 12, maxHeight: 180, overflowY: "auto",
                border: "1px solid rgba(164,0,93,0.08)",
              }}>
                {cart.map((item) => (
                  <div key={item.cartKey || item._id} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "7px 0", fontSize: 13, color: "#1A1008",
                    borderBottom: "1px solid rgba(164,0,93,0.05)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    <span style={{ flex: 1, paddingRight: 8 }}>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 700, color: "#A4005D", flexShrink: 0 }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 4 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: "#8a7060",
                    letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif",
                    textTransform: "uppercase",
                  }}>Total</span>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20, fontWeight: 700, color: "#A4005D",
                  }}>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {String(orderNotes || "").trim() && (
                <div style={{
                  background: "#fff", padding: "10px 14px", borderRadius: 14,
                  marginBottom: 12, border: "1px solid rgba(164,0,93,0.08)",
                }}>
                  <div style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.16em",
                    textTransform: "uppercase", color: "#8a7060",
                    marginBottom: 6, fontFamily: "'DM Sans', sans-serif",
                  }}>Special Request</div>
                  <div style={{
                    fontSize: 12, color: "#1A1008", whiteSpace: "pre-wrap",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>{String(orderNotes).trim()}</div>
                </div>
              )}

              <div style={{
                background: "rgba(164,0,93,0.06)", border: "1px solid rgba(164,0,93,0.12)",
                borderRadius: 12, padding: "10px 14px", marginBottom: 20,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 13, flexShrink: 0 }}>⚠️</span>
                <p style={{
                  fontSize: 11, color: "#A4005D", fontWeight: 500, margin: 0,
                  fontFamily: "'DM Sans', sans-serif",
                }}>Orders cannot be cancelled once confirmed</p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => { setShowConfirmation(false); setShowCart(true); }}
                  style={{
                    flex: 1, padding: "13px", borderRadius: 12,
                    background: "transparent",
                    border: "1.5px solid rgba(164,0,93,0.2)",
                    color: "#A4005D", fontWeight: 600, fontSize: 14,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  }}
                >Back</button>
                <button
                  onClick={confirmPlaceOrder}
                  disabled={submitting}
                  style={{
                    flex: 2, padding: "13px", borderRadius: 12,
                    background: "#A4005D",
                    color: "#fff", fontWeight: 700, fontSize: 14,
                    border: "none",
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.65 : 1,
                    boxShadow: "0 4px 16px rgba(164,0,93,0.35)",
                    fontFamily: "'DM Sans', sans-serif",
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