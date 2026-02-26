import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";
import logo from "../../assets/logo.png";
import { useEffect, useState } from "react";

export default function GuestDashboard() {
  const { guest, loading } = useGuestAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [cardsVisible, setCardsVisible] = useState(false);
  const [exploreVisible, setExploreVisible] = useState(false);

  useEffect(() => {
    // Staggered entrance
    const t1 = setTimeout(() => setFadeIn(true), 50);
    const t2 = setTimeout(() => setCardsVisible(true), 300);
    const t3 = setTimeout(() => setExploreVisible(true), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    if (!loading && !guest) navigate("/guest/login");
  }, [guest, loading, navigate]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  // ── Icons ──────────────────────────────────────────────────────────────
  const FoodIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M6 18h12" /><path d="M7 18v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1" />
      <path d="M8 12h8" /><path d="M5 12a7 7 0 0 1 14 0" /><path d="M12 9v-1" />
    </svg>
  );
  const HouseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M6 3l12 12" /><path d="M10 7l-2 2" /><path d="M14 11l-2 2" />
      <path d="M4 20h7" /><path d="M4 20c1.2-3.4 3.6-5.8 7-7" />
      <path d="M11 13c1.2 0 2.7 1.1 3.6 2.1" />
    </svg>
  );
  const EventsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
      <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
      <path d="M8 11h4" />
    </svg>
  );
  const AmenitiesIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" />
    </svg>
  );
  const OrdersNavIcon = ({ active }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6" /><path d="M9 16h4" />
    </svg>
  );
  const SupportNavIcon = ({ active }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r=".5" fill="currentColor" />
    </svg>
  );
  const HomeNavIcon = ({ active }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );

  const quickActions = [
    { icon: <FoodIcon />,      label: "Food Order",   sub: "In-room dining",     route: "/guest/menu" },
    { icon: <HouseIcon />,     label: "Housekeeping", sub: "Room essentials",    route: "/guest/housekeeping" },
    { icon: <EventsIcon />,    label: "Events",       sub: "Hotel activities",   route: "/guest/events" },
    { icon: <AmenitiesIcon />, label: "Amenities",    sub: "Explore facilities", route: "/guest/hotel-info" },
  ];

  const hasActiveOrder = false;
  const activeOrder = {
    items: [{ name: "Veg Sandwich", qty: 1 }, { name: "Mineral Water", qty: 1 }],
    status: "Preparing",
  };

  const navItems = [
    { key: "home",    label: "Home",    icon: (a) => <HomeNavIcon active={a} />,    route: "/guest/dashboard" },
    { key: "orders",  label: "Orders",  icon: (a) => <OrdersNavIcon active={a} />,  route: "/guest/orders" },
    { key: "support", label: "Support", icon: (a) => <SupportNavIcon active={a} />, route: "/guest/support" },
  ];

  return (
    <>
      {/* ── Keyframe styles injected once ─────────────────────────── */}
      <style>{`
        @keyframes heroSlideDown {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(12px, -10px) scale(1.08); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-10px, 12px) scale(1.06); }
        }
        @keyframes stripe {
          from { background-position: 200% center; }
          to   { background-position: -200% center; }
        }
        @keyframes pulseDot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(164, 0, 93, 0.4); }
          50%       { box-shadow: 0 0 0 5px rgba(164, 0, 93, 0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rowIn {
          from { opacity: 0; transform: translateX(-14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(164,0,93,0.13);
        }
        .row-hover:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 18px rgba(164,0,93,0.09);
        }
        .nav-btn:active { transform: scale(0.94); }
      `}</style>

      <div
        className="fixed inset-0 flex flex-col overflow-hidden"
        style={{
          background: "#0e0008",
          transition: "opacity 0.5s ease",
          opacity: fadeIn ? 1 : 0,
        }}
      >
        {/* ── SCROLLABLE BODY ─────────────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ maxWidth: 430, width: "100%", margin: "0 auto", paddingBottom: 80 }}
        >

          {/* ── DARK HERO SECTION ──────────────────────────────────── */}
          <div
            style={{
              background: "#0e0008",
              paddingBottom: 32,
              position: "relative",
              overflow: "hidden",
              animation: "heroSlideDown 0.6s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            {/* Animated brand stripe at top */}
            <div style={{
              height: 2,
              background: "linear-gradient(90deg, transparent, #A4005D, #C44A87, #A4005D, transparent)",
              backgroundSize: "300% 100%",
              animation: "stripe 4s linear infinite",
            }} />

            {/* Animated blobs */}
            <div style={{
              position: "absolute", top: -50, right: -50,
              width: 220, height: 220, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(164,0,93,0.22), transparent 65%)",
              animation: "blob1 7s ease-in-out infinite",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: -30, left: -40,
              width: 180, height: 180, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(196,74,135,0.13), transparent 65%)",
              animation: "blob2 9s ease-in-out infinite",
              pointerEvents: "none",
            }} />

            {/* Header row */}
            <div className="flex items-start justify-between px-5 pt-8 pb-4" style={{ position: "relative", zIndex: 2 }}>
              <div className="flex-1">
                <p style={{
                  fontSize: 10, color: "rgba(196,74,135,0.65)",
                  fontWeight: 400, letterSpacing: "0.22em",
                  textTransform: "uppercase", marginBottom: 4,
                }}>
                  {greeting}
                </p>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 30, fontWeight: 300, fontStyle: "italic",
                  color: "#fff", lineHeight: 1, marginBottom: 10,
                }}>
                  {guest?.name || "Valued Guest"}
                </h1>
                {/* Room badge */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  border: "1px solid rgba(164,0,93,0.3)",
                  borderRadius: 20, padding: "5px 12px",
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#A4005D", flexShrink: 0,
                    animation: "pulseDot 2.2s ease-in-out infinite",
                  }} />
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: "#C44A87",
                    letterSpacing: "0.14em", textTransform: "uppercase",
                  }}>
                    ROOM {guest?.roomNumber}
                  </span>
                </div>
              </div>

              <img
                src={logo}
                alt="Hotel Logo"
                className="w-12 h-12 object-contain flex-shrink-0 mt-1"
                style={{ filter: "brightness(0) invert(1)", opacity: 0.55 }}
              />
            </div>

            {/* Hero banner image */}
            <div style={{
              marginInline: 20, borderRadius: 18, overflow: "hidden",
              position: "relative", height: 130,
              border: "1px solid rgba(164,0,93,0.2)",
              boxShadow: "0 8px 32px rgba(164,0,93,0.18)",
              zIndex: 2,
            }}>
              <img src={hotelbg} alt="Hotel" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(135deg, rgba(164,0,93,0.55) 0%, rgba(164,0,93,0.2) 50%, rgba(0,0,0,0.35) 100%)",
              }} />
              <div style={{ position: "absolute", bottom: 14, left: 16, zIndex: 1 }}>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 8, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 3 }}>
                  Welcome to
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fff", fontSize: 20, fontWeight: 600, lineHeight: 1 }}>
                  Grand Luxe Hotel
                </p>
              </div>
              <div style={{
                position: "absolute", top: 12, right: 12,
                background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 20, padding: "5px 12px",
              }}>
                <p style={{ color: "#fff", fontSize: 8, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Enjoy Your Stay
                </p>
              </div>
            </div>

            {/* Wave SVG transition into cream */}
            <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, zIndex: 3, lineHeight: 0 }}>
              <svg viewBox="0 0 430 38" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 38 }}>
                <path d="M0 0 Q107 38 215 19 Q323 0 430 30 L430 38 L0 38 Z" fill="#EFE1CF" />
              </svg>
            </div>
          </div>

          {/* ── CREAM BODY ─────────────────────────────────────────── */}
          <div style={{ background: "#EFE1CF" }}>

            {/* ── QUICK ACTIONS ──────────────────────────────────── */}
            <div className="px-5 pt-5">
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "#6B6B6B", marginBottom: 14,
                animation: cardsVisible ? "fadeUp 0.5s ease both" : "none",
              }}>
                Quick Actions
              </p>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, i) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.route)}
                    className="card-hover"
                    style={{
                      background: "#fff",
                      borderRadius: 20,
                      padding: "18px 14px 14px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      border: "1px solid rgba(164,0,93,0.07)",
                      boxShadow: "0 2px 14px rgba(164,0,93,0.06)",
                      cursor: "pointer",
                      minHeight: 128,
                      textAlign: "left",
                      transition: "transform 0.22s ease, box-shadow 0.22s ease",
                      // staggered card entrance
                      animation: cardsVisible
                        ? `cardIn 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms both`
                        : "none",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Top colour strip on hover handled by ::before — use inline workaround */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 3,
                      borderRadius: "20px 20px 0 0",
                      background: "linear-gradient(90deg, #A4005D, #C44A87)",
                      opacity: 0,
                      transition: "opacity 0.22s",
                    }} className="card-stripe" />

                    <div style={{
                      width: 44, height: 44, borderRadius: 13,
                      background: "#F6EADB",
                      border: "1.5px solid rgba(164,0,93,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#A4005D", marginBottom: 14,
                    }}>
                      {action.icon}
                    </div>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 16, fontWeight: 600, color: "#1F1F1F",
                      lineHeight: 1.1, marginBottom: 3,
                    }}>
                      {action.label}
                    </p>
                    <p style={{ fontSize: 10, color: "#6B6B6B", fontWeight: 300 }}>
                      {action.sub}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* ── YOUR ORDERS ────────────────────────────────────── */}
            <div className="px-5 mt-6">
              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <p style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "#6B6B6B",
                }}>
                  Your Orders
                </p>
                <button
                  onClick={() => navigate("/guest/orders")}
                  style={{
                    fontSize: 10, color: "#A4005D", fontWeight: 600,
                    background: "none", border: "none", cursor: "pointer", letterSpacing: "0.04em",
                  }}
                >
                  View All →
                </button>
              </div>

              {hasActiveOrder ? (
                <div style={{
                  background: "#fff", borderRadius: 18,
                  border: "1px solid rgba(164,0,93,0.08)",
                  boxShadow: "0 2px 14px rgba(30,21,16,0.05)", padding: 18,
                  animation: "fadeUp 0.5s ease both",
                }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: "#1F1F1F" }}>
                      Current Order
                    </span>
                    <span style={{
                      background: "rgba(164,0,93,0.08)", color: "#A4005D",
                      border: "1px solid rgba(164,0,93,0.12)",
                      borderRadius: 20, padding: "4px 12px",
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                    }}>
                      {activeOrder.status.toUpperCase()}
                    </span>
                  </div>
                  {activeOrder.items.map((item) => (
                    <div key={item.name} className="flex justify-between" style={{
                      fontSize: 13, color: "#5c4a3e", fontWeight: 300,
                      padding: "8px 0", borderBottom: "1px solid rgba(164,0,93,0.06)",
                    }}>
                      <span>{item.name}</span>
                      <span style={{ color: "#6B6B6B" }}>×{item.qty}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  background: "#fff", borderRadius: 18,
                  border: "1px solid rgba(164,0,93,0.07)",
                  boxShadow: "0 2px 12px rgba(30,21,16,0.04)",
                  padding: "16px 18px",
                  display: "flex", alignItems: "center", gap: 14,
                  animation: "fadeUp 0.55s ease 0.1s both",
                }}>
                  <div style={{
                    width: 44, height: 44, flexShrink: 0, borderRadius: 13,
                    background: "#F6EADB", border: "1.5px solid rgba(164,0,93,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#A4005D",
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                      <rect x="9" y="3" width="6" height="4" rx="1" />
                      <path d="M9 12h6" /><path d="M9 16h4" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 15, fontWeight: 600, color: "#1F1F1F", marginBottom: 2,
                    }}>
                      No active orders
                    </p>
                    <p style={{ fontSize: 11, color: "#6B6B6B", fontWeight: 300 }}>
                      Your requests will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── DIVIDER ────────────────────────────────────────── */}
            <div className="flex items-center gap-3 mx-5 my-6">
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
              <div style={{ width: 5, height: 5, background: "rgba(164,0,93,0.3)", transform: "rotate(45deg)", flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
            </div>

            {/* ── EXPLORE ────────────────────────────────────────── */}
            <div className="px-5 pb-4">
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "#6B6B6B", marginBottom: 12,
              }}>
                Explore
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: <EventsIcon />,    label: "Events",    route: "/guest/events" },
                  { icon: <AmenitiesIcon />, label: "Amenities", route: "/guest/hotel-info" },
                ].map((item, i) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.route)}
                    className="row-hover"
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      width: "100%", background: "#fff",
                      borderRadius: 16, padding: "14px 16px",
                      border: "1px solid rgba(164,0,93,0.07)",
                      boxShadow: "0 2px 10px rgba(30,21,16,0.04)",
                      cursor: "pointer", textAlign: "left",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      animation: exploreVisible
                        ? `rowIn 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms both`
                        : "none",
                    }}
                  >
                    <div style={{
                      width: 42, height: 42, flexShrink: 0, borderRadius: 12,
                      background: "#F6EADB", border: "1.5px solid rgba(164,0,93,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#A4005D",
                    }}>
                      {item.icon}
                    </div>
                    <span style={{
                      flex: 1,
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 16, fontWeight: 600, color: "#1F1F1F",
                    }}>
                      {item.label}
                    </span>
                    <span style={{ color: "#A4005D", fontSize: 18, opacity: 0.4 }}>›</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
          {/* end cream body */}

        </div>
        {/* end scroll area */}

        {/* ── BOTTOM NAV ─────────────────────────────────────────────── */}
        <div
          style={{
            flexShrink: 0,
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(164,0,93,0.1)",
            boxShadow: "0 -2px 20px rgba(30,21,16,0.07)",
            maxWidth: 430, width: "100%", margin: "0 auto",
          }}
        >
          <div className="flex items-center justify-around px-2 py-2.5">
            {navItems.map((item) => {
              const isActive = activeNav === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => { setActiveNav(item.key); navigate(item.route); }}
                  className="nav-btn"
                  style={{
                    position: "relative",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                    padding: "8px 28px", borderRadius: 14,
                    background: isActive ? "rgba(164,0,93,0.07)" : "transparent",
                    border: "none", cursor: "pointer",
                    transition: "background 0.2s ease, transform 0.15s ease",
                  }}
                >
                  <span style={{
                    color: isActive ? "#A4005D" : "#6B6B6B",
                    transition: "color 0.2s ease",
                  }}>
                    {item.icon(isActive)}
                  </span>
                  <span style={{
                    fontSize: 8, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: isActive ? "#A4005D" : "#6B6B6B",
                    transition: "color 0.2s ease",
                  }}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div style={{
                      position: "absolute", bottom: -1,
                      left: "50%", transform: "translateX(-50%)",
                      width: 4, height: 4, borderRadius: "50%",
                      background: "#A4005D",
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
}