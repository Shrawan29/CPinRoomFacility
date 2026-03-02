import { useNavigate, useLocation } from "react-router-dom";

/* Compact nav icons (19px) */
const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.7"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const OrdersIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.7"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6" /><path d="M9 16h4" />
  </svg>
);

const EventsIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.7"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}>
    <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
    <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M8 11h4" />
  </svg>
);

const HotelIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.7"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}>
    <path d="M3 21h18" />
    <path d="M6 21V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14" />
    <path d="M10 7h4" /><path d="M10 11h4" /><path d="M10 15h4" />
  </svg>
);

/* AI sparkle icon */
const AiSparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const routeToKey = {
  "/guest/dashboard": "home",
  "/guest/orders": "orders",
  "/guest/support": "ai",
  "/guest/events": "events",
  "/guest/hotel-info": "hotel",
  "/guest/menu": "orders",
  "/guest/housekeeping": "home",
  "/guest/cart": "orders",
};

const navItems = [
  { key: "home",   label: "Home",   route: "/guest/dashboard",  Icon: HomeIcon },
  { key: "orders", label: "Orders", route: "/guest/orders",     Icon: OrdersIcon },
  { key: "events", label: "Events", route: "/guest/events",     Icon: EventsIcon },
  { key: "hotel",  label: "Hotel",  route: "/guest/hotel-info", Icon: HotelIcon },
];

export default function GuestBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;
  let activeKey = routeToKey[pathname] || "";
  if (!activeKey) {
    if (pathname.startsWith("/guest/events")) activeKey = "events";
    else if (pathname.startsWith("/guest/orders")) activeKey = "orders";
    else activeKey = "home";
  }

  const leftItems = navItems.slice(0, 2);
  const rightItems = navItems.slice(2);
  const isAiActive = activeKey === "ai";

  const renderNavItem = (item, idx, delayBase) => {
    const isActive = activeKey === item.key;
    return (
      <button
        key={item.key}
        onClick={() => navigate(item.route)}
        className="gbn-item"
        style={{
          animationDelay: `${delayBase + idx * 0.05}s`,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          padding: "4px 12px 6px",
          borderRadius: 12,
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span style={{
          color: isActive ? "#A4005D" : "#9a8a80",
          transition: "color 0.25s ease",
        }}>
          <item.Icon active={isActive} />
        </span>
        <span style={{
          fontSize: 8.5, fontWeight: isActive ? 700 : 500,
          letterSpacing: "0.06em",
          color: isActive ? "#A4005D" : "#9a8a80",
          transition: "color 0.25s ease, font-weight 0.25s ease",
        }}>{item.label}</span>
        <div style={{
          position: "absolute", bottom: 1, left: "50%", transform: "translateX(-50%)",
          width: isActive ? 14 : 0, height: 2, borderRadius: 1,
          background: "#A4005D",
          transition: "width 0.3s cubic-bezier(0.22,1,0.36,1)",
        }} />
      </button>
    );
  };

  return (
    <>
      <style>{`
        @keyframes navSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes navItemPop {
          0%   { opacity: 0; transform: scale(0.8) translateY(6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes aiGlow {
          0%   { box-shadow: 0 2px 12px rgba(164,0,93,0.30); }
          50%  { box-shadow: 0 2px 18px rgba(164,0,93,0.50), 0 0 0 6px rgba(164,0,93,0.08); }
          100% { box-shadow: 0 2px 12px rgba(164,0,93,0.30); }
        }
        .gbn-root {
          animation: navSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.1s both;
        }
        .gbn-item {
          animation: navItemPop 0.35s cubic-bezier(0.22,1,0.36,1) both;
          transition: transform 0.15s ease;
        }
        .gbn-item:active { transform: scale(0.9) !important; }
        .gbn-ai-orb {
          animation: aiGlow 3s ease-in-out infinite;
          transition: transform 0.2s ease;
        }
        .gbn-ai-wrap:active .gbn-ai-orb { transform: scale(0.92); }
      `}</style>

      <div className="gbn-root" style={{
        flexShrink: 0,
        background: "rgba(242,232,220,0.96)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(164,0,93,0.06)",
        boxShadow: "0 -2px 16px rgba(26,20,16,0.06)",
        maxWidth: 430,
        width: "100%",
        margin: "0 auto",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-around",
          padding: "2px 2px 3px",
          position: "relative",
        }}>
          {leftItems.map((item, idx) => renderNavItem(item, idx, 0.1))}

          {/* Center AI button */}
          <button
            onClick={() => navigate("/guest/support")}
            className="gbn-ai-wrap"
            style={{
              position: "relative",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: -12,
            }}
          >
            <div className="gbn-ai-orb" style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(145deg, #C44A87, #A4005D)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              outline: isAiActive ? "2.5px solid rgba(164,0,93,0.25)" : "none",
              outlineOffset: 3,
            }}>
              <AiSparkleIcon />
            </div>
            <span style={{
              marginTop: 2,
              fontSize: 8.5,
              fontWeight: isAiActive ? 700 : 500,
              letterSpacing: "0.06em",
              color: isAiActive ? "#A4005D" : "#9a8a80",
            }}>AI Chat</span>
          </button>

          {rightItems.map((item, idx) => renderNavItem(item, idx, 0.25))}
        </div>
      </div>
    </>
  );
}