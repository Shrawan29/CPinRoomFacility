import { useNavigate, useLocation } from "react-router-dom";

/* Nav icon components */
const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const OrdersIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6" /><path d="M9 16h4" />
  </svg>
);

const EventsIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
    <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M8 11h4" />
  </svg>
);

const HotelIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M3 21h18" />
    <path d="M6 21V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14" />
    <path d="M10 7h4" /><path d="M10 11h4" /><path d="M10 15h4" />
  </svg>
);

/* AI Chat icon - chat bubble */
const AiChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <path d="M9.5 11h.01" strokeWidth="2.5" />
    <path d="M14.5 11h.01" strokeWidth="2.5" />
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
  { key: "home",   label: "Home",      route: "/guest/dashboard",  Icon: HomeIcon },
  { key: "orders", label: "Orders",    route: "/guest/orders",     Icon: OrdersIcon },
  { key: "events", label: "Events",    route: "/guest/events",     Icon: EventsIcon },
  { key: "hotel",  label: "Hotel Info", route: "/guest/hotel-info", Icon: HotelIcon },
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

  return (
    <>
      <style>{`
        @keyframes navSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes navItemPop {
          0%   { opacity: 0; transform: scale(0.7) translateY(8px); }
          70%  { transform: scale(1.06) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes aiPulse {
          0%   { box-shadow: 0 4px 20px rgba(164,0,93,0.35); }
          50%  { box-shadow: 0 4px 28px rgba(164,0,93,0.55), 0 0 0 8px rgba(164,0,93,0.10); }
          100% { box-shadow: 0 4px 20px rgba(164,0,93,0.35); }
        }
        @keyframes aiFloat {
          0%, 100% { transform: translateY(-14px); }
          50%      { transform: translateY(-18px); }
        }
        .gbn-root {
          animation: navSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) 0.1s both;
        }
        .gbn-item {
          animation: navItemPop 0.4s cubic-bezier(0.22,1,0.36,1) both;
          transition: transform 0.15s ease, background 0.2s ease;
        }
        .gbn-item:active { transform: scale(0.9) !important; }
        .gbn-ai-btn {
          animation: aiFloat 3s ease-in-out infinite;
        }
        .gbn-ai-circle {
          animation: aiPulse 2.5s ease-in-out infinite;
          transition: transform 0.2s ease;
        }
        .gbn-ai-btn:active .gbn-ai-circle {
          transform: scale(0.92);
        }
      `}</style>

      <div className="gbn-root" style={{
        flexShrink: 0,
        background: "rgba(242,232,220,0.97)",
        backdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(164,0,93,0.08)",
        boxShadow: "0 -4px 24px rgba(26,20,16,0.08)",
        maxWidth: 430,
        width: "100%",
        margin: "0 auto",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-evenly",
          padding: "6px 4px 5px",
        }}>
          {leftItems.map((item, idx) => {
            const isActive = activeKey === item.key;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.route)}
                className="gbn-item"
                style={{
                  animationDelay: `${0.12 + idx * 0.06}s`,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  padding: "6px 14px",
                  borderRadius: 14,
                  background: isActive ? "rgba(164,0,93,0.08)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span style={{ color: isActive ? "#A4005D" : "#8a7a70", transition: "color 0.2s ease" }}>
                  <item.Icon active={isActive} />
                </span>
                <span style={{
                  fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: isActive ? "#A4005D" : "#8a7a70", transition: "color 0.2s ease",
                }}>{item.label}</span>
                {isActive && (
                  <div style={{
                    position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                    width: 16, height: 2, borderRadius: 1, background: "#A4005D",
                  }} />
                )}
              </button>
            );
          })}

          <button
            onClick={() => navigate("/guest/support")}
            className="gbn-ai-btn"
            style={{
              position: "relative",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{
              position: "absolute",
              top: -18,
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(242,232,220,0.97)",
              zIndex: 0,
            }} />
            <div className="gbn-ai-circle" style={{
              position: "relative",
              zIndex: 1,
              width: 54,
              height: 54,
              borderRadius: "50%",
              background: "linear-gradient(145deg, #C44A87, #A4005D)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: isAiActive ? "2.5px solid rgba(255,255,255,0.95)" : "2.5px solid rgba(255,255,255,0.6)",
            }}>
              <AiChatIcon />
            </div>
            <span style={{
              marginTop: 4,
              fontSize: 7,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: isAiActive ? "#A4005D" : "#8a7a70",
              textAlign: "center",
            }}>AI Chat</span>
          </button>

          {rightItems.map((item, idx) => {
            const isActive = activeKey === item.key;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.route)}
                className="gbn-item"
                style={{
                  animationDelay: `${0.30 + idx * 0.06}s`,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  padding: "6px 14px",
                  borderRadius: 14,
                  background: isActive ? "rgba(164,0,93,0.08)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span style={{ color: isActive ? "#A4005D" : "#8a7a70", transition: "color 0.2s ease" }}>
                  <item.Icon active={isActive} />
                </span>
                <span style={{
                  fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: isActive ? "#A4005D" : "#8a7a70", transition: "color 0.2s ease",
                }}>{item.label}</span>
                {isActive && (
                  <div style={{
                    position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                    width: 16, height: 2, borderRadius: 1, background: "#A4005D",
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}