import { memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ─── ICONS ──────────────────────────────────────────────────────────── */
const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 20, height: 20 }}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const OrdersIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 20, height: 20 }}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6" /><path d="M9 16h4" />
  </svg>
);

const EventsIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 20, height: 20 }}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h8M8 14h5" />
  </svg>
);

const HotelIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 20, height: 20 }}>
    <path d="M3 21h18" />
    <path d="M6 21V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14" />
    <path d="M10 7h4" /><path d="M10 11h4" /><path d="M10 15h4" />
  </svg>
);

const AiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 21, height: 21 }}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <circle cx="9.5"  cy="11.5" r="0.65" fill="rgba(255,255,255,0.95)" stroke="none" />
    <circle cx="14.5" cy="11.5" r="0.65" fill="rgba(255,255,255,0.95)" stroke="none" />
  </svg>
);

/* ─── ROUTE → KEY MAP (unchanged) ───────────────────────────────────── */
const routeToKey = {
  "/guest/dashboard":    "home",
  "/guest/orders":       "orders",
  "/guest/support":      "ai",
  "/guest/complaints":   "events",
  "/guest/hotel-info":   "hotel",
  "/guest/menu":         "orders",
  "/guest/housekeeping": "home",
  "/guest/cart":         "orders",
};

/* ─── NAV ITEMS ──────────────────────────────────────────────────────── */
const LEFT_ITEMS = [
  { key: "home",   label: "Home",       route: "/guest/dashboard",  Icon: HomeIcon },
  { key: "orders", label: "Orders",     route: "/guest/orders",     Icon: OrdersIcon },
];
const RIGHT_ITEMS = [
  { key: "events", label: "Feedbacks",  route: "/guest/complaints", Icon: EventsIcon },
  { key: "hotel",  label: "Hotel Info", route: "/guest/hotel-info", Icon: HotelIcon },
];

/* ─── CONSTANTS ─────────────────────────────────────────────────────── */
const HALF_H  = 62;
const ORB_SZ  = 52;
const SIDE_M  = 12;
const GAP     = 10;

function GuestBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  /* active key resolution — identical logic to original */
  let activeKey = routeToKey[location.pathname] || "";
  if (!activeKey) {
    if (location.pathname.startsWith("/guest/complaints"))  activeKey = "events";
    else if (location.pathname.startsWith("/guest/orders")) activeKey = "orders";
    else                                                     activeKey = "home";
  }
  const isAiActive = activeKey === "ai";

  /* ─── SHARED TAB BUTTON ── */
  const Tab = ({ item, delay }) => {
    const on = activeKey === item.key;
    const IC = item.Icon;
    return (
      <button
        onClick={() => navigate(item.route)}
        style={{
          flex: 1, height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 4,
          background: "transparent", border: "none", cursor: "pointer", padding: 0,
          WebkitTapHighlightColor: "transparent",
          animation: `gbnTab 0.34s ease ${delay}s both`,
          transition: "transform 0.14s ease",
          position: "relative", zIndex: 1,
        }}
        onMouseDown={e => e.currentTarget.style.transform = "scale(0.84)"}
        onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        onTouchStart={e => e.currentTarget.style.transform = "scale(0.84)"}
        onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {/* active underline indicator */}
        {on && (
          <span style={{
            position: "absolute", bottom: 9, left: "50%",
            transform: "translateX(-50%)",
            width: 20, height: 2, borderRadius: 1,
            background: "linear-gradient(90deg,#C94490,#A4005D)",
          }} />
        )}
        <span style={{ color: on ? "#A4005D" : "#bfaa96", transition: "color 0.22s", display: "flex" }}>
          <IC active={on} />
        </span>
        <span style={{
          fontSize: 9, lineHeight: 1,
          fontWeight: on ? 600 : 500,
          color: on ? "#A4005D" : "#bfaa96",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          letterSpacing: "0.01em",
          transition: "color 0.22s",
        }}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes gbnUp {
          from { opacity:0; transform:translateY(70px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes gbnTab {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes orbPop {
          0%   { opacity:0; transform:scale(0.5); }
          65%  { transform:scale(1.08); }
          100% { opacity:1; transform:scale(1); }
        }
        @keyframes orbGlow {
          0%,100% {
            box-shadow:
              0 6px 22px rgba(164,0,93,0.50),
              0 2px 6px rgba(0,0,0,0.18),
              inset 0 1px 0 rgba(255,255,255,0.28);
          }
          50% {
            box-shadow:
              0 9px 30px rgba(164,0,93,0.80),
              0 2px 6px rgba(0,0,0,0.18),
              inset 0 1px 0 rgba(255,255,255,0.28);
          }
        }
        @keyframes rippleOut {
          0%   { transform:scale(1);   opacity:0.48; }
          100% { transform:scale(2.4); opacity:0; }
        }
        @keyframes shimmer {
          0%   { background-position:-200% center; }
          100% { background-position: 200% center; }
        }

        .gbn-root  { animation: gbnUp 0.46s cubic-bezier(0.22,1,0.36,1) both; }
        .gbn-orb   { animation: orbPop 0.44s cubic-bezier(0.22,1,0.36,1) 0.08s both; }
        .orb-core  { animation: orbGlow 3s ease-in-out 0.5s infinite; }
        .orb-core:active { transform:scale(0.88)!important; }
        .rpl  { animation: rippleOut 2.9s ease-out 0.5s infinite; }
        .rpl2 { animation: rippleOut 2.9s ease-out 1.95s infinite; }

        .half-gloss::after {
          content:''; position:absolute; top:0; left:0; right:0; height:44%;
          background:linear-gradient(180deg,rgba(255,255,255,0.56) 0%,transparent 100%);
          border-radius:31px 31px 0 0; pointer-events:none;
        }
      `}</style>

      {/* ── ROOT CONTAINER ── */}
      <div
        className="gbn-root"
        style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          zIndex: 9999,
          maxWidth: 430,
          margin: "0 auto",
          paddingBottom: "max(14px, env(safe-area-inset-bottom, 14px))",
          overflow: "visible",
        }}
      >
        {/* ── SPLIT DECK LAYOUT ── */}
        <div style={{
          margin: `0 ${SIDE_M}px`,
          display: "flex",
          alignItems: "flex-end",
          gap: GAP,
          position: "relative",
        }}>

          {/* ── LEFT HALF ── */}
          <div
            className="half-gloss"
            style={{
              flex: 1,
              height: HALF_H,
              borderRadius: 31,
              background: "linear-gradient(170deg, rgba(255,249,241,0.95) 0%, rgba(244,231,211,0.89) 100%)",
              border: "1px solid rgba(255,255,255,0.56)",
              boxShadow: `
                0 2px 0 rgba(255,255,255,0.76) inset,
                0 -1px 0 rgba(180,130,90,0.16) inset,
                0 18px 40px rgba(12,6,2,0.20),
                0 4px 10px rgba(12,6,2,0.10)
              `,
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {LEFT_ITEMS.map((item, i) => (
              <Tab key={item.key} item={item} delay={0.08 + i * 0.05} />
            ))}
          </div>

          {/* ── CENTER ORB (floats between halves) ── */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            flexShrink: 0,
            paddingBottom: 4,
          }}>
            <button
              className="gbn-orb"
              onClick={() => navigate("/guest/support")}
              style={{
                width: ORB_SZ, height: ORB_SZ,
                background: "none", border: "none",
                cursor: "pointer", padding: 0,
                position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {/* ripple rings */}
              <div className="rpl" style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: "1.5px solid rgba(164,0,93,0.42)", pointerEvents: "none",
              }} />
              <div className="rpl2" style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: "1px solid rgba(164,0,93,0.22)", pointerEvents: "none",
              }} />

              {/* orb */}
              <div
                className="orb-core"
                style={{
                  width: ORB_SZ, height: ORB_SZ, borderRadius: "50%",
                  background: "linear-gradient(148deg, #D95A9A 0%, #A4005D 50%, #6e0038 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1.5px solid rgba(255,255,255,0.26)",
                  position: "relative", overflow: "hidden",
                  transition: "transform 0.18s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                {/* gem-cut inner highlight */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "46%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.30) 0%, transparent 100%)",
                  borderRadius: "50% 50% 0 0",
                  pointerEvents: "none",
                }} />
                <AiIcon />
              </div>
            </button>

            <span style={{
              fontSize: 9, lineHeight: 1,
              fontWeight: isAiActive ? 600 : 500,
              color: isAiActive ? "#A4005D" : "#bfaa96",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              letterSpacing: "0.01em",
              transition: "color 0.22s",
            }}>
              AI Chat
            </span>
          </div>

          {/* ── RIGHT HALF ── */}
          <div
            className="half-gloss"
            style={{
              flex: 1,
              height: HALF_H,
              borderRadius: 31,
              background: "linear-gradient(170deg, rgba(255,249,241,0.95) 0%, rgba(244,231,211,0.89) 100%)",
              border: "1px solid rgba(255,255,255,0.56)",
              boxShadow: `
                0 2px 0 rgba(255,255,255,0.76) inset,
                0 -1px 0 rgba(180,130,90,0.16) inset,
                0 18px 40px rgba(12,6,2,0.20),
                0 4px 10px rgba(12,6,2,0.10)
              `,
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {RIGHT_ITEMS.map((item, i) => (
              <Tab key={item.key} item={item} delay={0.18 + i * 0.05} />
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

export default memo(GuestBottomNav);