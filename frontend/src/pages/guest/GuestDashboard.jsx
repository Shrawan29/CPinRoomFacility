import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";
import GuestHeader from "../../components/guest/GuestHeader";
import GlassCard from "../../components/guest/GlassCard";
import { useEffect, useState } from "react";

// ─── Inline styles (no new dependencies) ────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');

  .gd-root {
    --rose:       #8B1A4A;
    --rose-dark:  #6e1039;
    --gold:       #c9a96e;
    --gold-light: #e8d5b0;
    --cream:      #f5ede3;
    --warm:       #faf6f1;
    --text:       #1e1510;
    --text-mid:   #5c4a3e;
    --text-muted: #9e8276;
    --border:     rgba(180,148,110,0.18);
    --card:       #ffffff;
    --shadow-rose: 0 4px 20px rgba(139,26,74,0.13);
    --shadow-card: 0 2px 16px rgba(30,21,16,0.06);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Hero ───────────────────────────────────────────── */
  .gd-hero {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
    border-radius: 0 0 28px 28px;
  }
  .gd-hero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .gd-hero-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.02) 0%,
      rgba(0,0,0,0.08) 40%,
      rgba(245,237,227,0.85) 80%,
      rgba(245,237,227,1.00) 100%
    );
    border-radius: 0 0 28px 28px;
  }
  .gd-hero-pill {
    position: absolute;
    top: 14px;
    right: 14px;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.32);
    border-radius: 20px;
    padding: 5px 13px;
    font-size: 11px;
    font-weight: 500;
    color: white;
    letter-spacing: 0.06em;
  }

  /* ── Welcome ─────────────────────────────────────────── */
  .gd-welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 6px 20px 0;
    animation: gd-rise 0.6s cubic-bezier(.4,0,.2,1) both;
  }
  .gd-welcome h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px;
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 1.05;
    color: var(--text);
    margin-bottom: 10px;
  }
  .gd-room-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--rose);
    color: white;
    border-radius: 30px;
    padding: 5px 15px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.07em;
    margin-bottom: 8px;
  }
  .gd-welcome-sub {
    font-size: 13px;
    color: var(--text-muted);
    font-weight: 300;
    letter-spacing: 0.03em;
  }

  /* ── Gold Divider ────────────────────────────────────── */
  .gd-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 22px 20px 16px;
  }
  .gd-divider::before,
  .gd-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
    opacity: 0.45;
  }
  .gd-divider span {
    font-family: 'Cormorant Garamond', serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--gold);
    white-space: nowrap;
  }

  /* ── Section label ───────────────────────────────────── */
  .gd-section-label {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 12px;
    padding-left: 2px;
  }

  /* ── Service Cards ───────────────────────────────────── */
  .gd-service-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 18px;
    border-radius: 20px;
    background: var(--card);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-card);
    cursor: pointer;
    transition: transform 0.22s ease, box-shadow 0.22s ease;
    position: relative;
    overflow: hidden;
    margin-bottom: 11px;
    text-decoration: none;
  }
  .gd-service-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2.5px;
    background: linear-gradient(90deg, var(--rose), var(--gold));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  .gd-service-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-rose);
  }
  .gd-service-card:hover::before {
    transform: scaleX(1);
  }
  .gd-service-card:active {
    transform: scale(0.98);
  }

  .gd-icon-wrap {
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    border-radius: 15px;
    background: var(--cream);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--rose);
  }
  .gd-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 3px;
    line-height: 1.2;
  }
  .gd-card-sub {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 300;
    line-height: 1.4;
  }
  .gd-card-arrow {
    margin-left: auto;
    color: var(--gold);
    font-size: 20px;
    opacity: 0.7;
    flex-shrink: 0;
  }

  /* ── Orders Card ─────────────────────────────────────── */
  .gd-orders-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 26px 20px;
    text-align: center;
    box-shadow: var(--shadow-card);
    margin-bottom: 4px;
  }
  .gd-orders-icon {
    width: 54px;
    height: 54px;
    background: var(--cream);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin: 0 auto 14px;
    border: 1px solid var(--border);
  }
  .gd-orders-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 5px;
  }
  .gd-orders-sub {
    font-size: 12.5px;
    color: var(--text-muted);
    font-weight: 300;
    margin-bottom: 20px;
    line-height: 1.5;
  }
  .gd-order-btn {
    display: block;
    width: 100%;
    background: var(--rose);
    color: white;
    border: none;
    border-radius: 30px;
    padding: 13px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.07em;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    margin-bottom: 13px;
  }
  .gd-order-btn:hover {
    background: var(--rose-dark);
    box-shadow: 0 6px 20px rgba(139,26,74,0.28);
    transform: translateY(-1px);
  }
  .gd-order-btn:active {
    transform: scale(0.98);
  }
  .gd-history-link {
    font-size: 12px;
    color: var(--text-muted);
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
    letter-spacing: 0.03em;
    background: none;
    border: none;
    padding: 0;
    transition: color 0.2s;
  }
  .gd-history-link:hover {
    color: var(--rose);
  }

  /* ── Ornament ─────────────────────────────────────────── */
  .gd-ornament {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 24px 0 0;
    opacity: 0.32;
  }
  .gd-orn-line {
    width: 36px;
    height: 1px;
    background: var(--gold);
  }
  .gd-orn-diamond {
    width: 5px;
    height: 5px;
    background: var(--gold);
    transform: rotate(45deg);
  }

  /* ── Explore Items ───────────────────────────────────── */
  .gd-explore-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    cursor: pointer;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    margin-bottom: 10px;
  }
  .gd-explore-item:hover {
    transform: translateX(4px);
    border-color: var(--gold-light);
    box-shadow: 0 4px 14px rgba(201,169,110,0.13);
  }
  .gd-explore-item:active {
    transform: scale(0.98);
  }
  .gd-explore-icon {
    width: 42px;
    height: 42px;
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--rose);
    flex-shrink: 0;
  }
  .gd-explore-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16.5px;
    font-weight: 600;
    color: var(--text);
    flex: 1;
  }
  .gd-explore-chevron {
    color: var(--gold);
    font-size: 20px;
    opacity: 0.65;
  }

  /* ── Animations ──────────────────────────────────────── */
  @keyframes gd-rise {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .gd-anim-1 { animation: gd-rise 0.55s cubic-bezier(.4,0,.2,1) 0.05s both; }
  .gd-anim-2 { animation: gd-rise 0.55s cubic-bezier(.4,0,.2,1) 0.12s both; }
  .gd-anim-3 { animation: gd-rise 0.55s cubic-bezier(.4,0,.2,1) 0.20s both; }
  .gd-anim-4 { animation: gd-rise 0.55s cubic-bezier(.4,0,.2,1) 0.28s both; }
`;

export default function GuestDashboard() {
  const { guest } = useGuestAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Icons (unchanged from original)
  const icons = {
    food: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M6 18h12" />
        <path d="M7 18v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1" />
        <path d="M8 12h8" />
        <path d="M5 12a7 7 0 0 1 14 0" />
        <path d="M12 9v-1" />
      </svg>
    ),
    housekeeping: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M6 3l12 12" />
        <path d="M10 7l-2 2" />
        <path d="M14 11l-2 2" />
        <path d="M4 20h7" />
        <path d="M4 20c1.2-3.4 3.6-5.8 7-7" />
        <path d="M11 13c1.2 0 2.7 1.1 3.6 2.1" />
      </svg>
    ),
    events: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M8 3v3" />
        <path d="M16 3v3" />
        <path d="M4 7h16" />
        <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
        <path d="M8 11h4" />
      </svg>
    ),
    amenities: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
      </svg>
    ),
  };

  // Service cards (unchanged)
  const services = [
    {
      icon: icons.food,
      title: "Food Order",
      subtitle: "Order from curated in-room menu",
      onClick: () => navigate("/guest/menu"),
    },
    {
      icon: icons.housekeeping,
      title: "Housekeeping",
      subtitle: "Request essentials anytime",
      onClick: () => navigate("/guest/housekeeping"),
    },
  ];

  // Explore cards (unchanged)
  const explore = [
    {
      icon: icons.events,
      title: "Events",
      onClick: () => navigate("/guest/events"),
    },
    {
      icon: icons.amenities,
      title: "Amenities",
      onClick: () => navigate("/guest/hotel-info"),
    },
  ];

  // Orders section placeholder (unchanged)
  const hasActiveOrder = false; // TODO: Replace with real check
  const activeOrder = {
    items: [
      { name: "Veg Sandwich", qty: 1 },
      { name: "Mineral Water", qty: 1 },
    ],
    status: "Preparing",
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[--bg-primary] transition-opacity duration-700 ${fadeIn ? "opacity-100" : "opacity-0"} gd-root`}
      style={{ maxWidth: 420, margin: "0 auto", padding: "0 0 32px" }}
    >
      {/* Inject scoped styles */}
      <style>{styles}</style>

      {/* Header (unchanged component) */}
      <GuestHeader />

      {/* ── Hero Image ──────────────────────────────────────── */}
      <div className="gd-hero" style={{ margin: "0 0 0 0" }}>
        <img src={hotelbg} alt="Hotel Hero" />
        <div className="gd-hero-gradient" />
      </div>

      {/* ── Welcome ─────────────────────────────────────────── */}
      <div className="gd-welcome gd-anim-1">
        <h2>Welcome</h2>
        <div className="gd-room-chip">
          ✦ &nbsp;Room {guest?.roomNumber || "207"}
        </div>
        <p className="gd-welcome-sub">Enjoy your stay with us</p>
      </div>

      {/* ── Gold Divider ─────────────────────────────────────── */}
      <div className="gd-divider gd-anim-2">
        <span>Our Services</span>
      </div>

      {/* ── Service Cards ─────────────────────────────────────── */}
      <div style={{ padding: "0 16px" }} className="gd-anim-2">
        {services.map((svc) => (
          <div
            key={svc.title}
            className="gd-service-card"
            onClick={svc.onClick}
          >
            <div className="gd-icon-wrap">{svc.icon}</div>
            <div style={{ flex: 1 }}>
              <div className="gd-card-title">{svc.title}</div>
              <div className="gd-card-sub">{svc.subtitle}</div>
            </div>
            <div className="gd-card-arrow">›</div>
          </div>
        ))}
      </div>

      {/* ── Your Orders ───────────────────────────────────────── */}
      <div style={{ padding: "0 16px" }} className="gd-anim-3">
        <p className="gd-section-label">Your Orders</p>

        {hasActiveOrder ? (
          /* Active order state — same logic, improved card */
          <div className="gd-orders-card" style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)" }}>
                Current Order
              </span>
              <span style={{
                background: "var(--cream)",
                color: "var(--rose)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                padding: "3px 12px",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.05em"
              }}>
                {activeOrder.status}
              </span>
            </div>
            {activeOrder.items.map((item) => (
              <div key={item.name} style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: "var(--text-mid)",
                marginBottom: 6,
                fontWeight: 300
              }}>
                <span>{item.name}</span>
                <span style={{ color: "var(--text-muted)" }}>×{item.qty}</span>
              </div>
            ))}
          </div>
        ) : (
          /* Empty order state */
          <div className="gd-orders-card">
            <div className="gd-orders-title">No current orders</div>
            <button
              className="gd-history-link"
              onClick={() => navigate("/guest/orders")}
            >
              View Order History &nbsp;→
            </button>
          </div>
        )}
      </div>

      {/* ── Ornament ─────────────────────────────────────────── */}
      <div className="gd-ornament">
        <div className="gd-orn-line" />
        <div className="gd-orn-diamond" />
        <div className="gd-orn-line" />
      </div>

      {/* ── Explore ───────────────────────────────────────────── */}
      <div style={{ padding: "22px 16px 0" }} className="gd-anim-4">
        <p className="gd-section-label">Explore</p>
        {explore.map((item) => (
          <div
            key={item.title}
            className="gd-explore-item"
            onClick={item.onClick}
          >
            <div className="gd-explore-icon">{item.icon}</div>
            <div className="gd-explore-title">{item.title}</div>
            <div className="gd-explore-chevron">›</div>
          </div>
        ))}
      </div>
    </div>
  );
}