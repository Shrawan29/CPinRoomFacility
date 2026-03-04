import { useNavigate, useLocation } from "react-router-dom";

const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 21, height: 21 }}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const OrdersIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 21, height: 21 }}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6" /><path d="M9 16h4" />
  </svg>
);

const EventsIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 21, height: 21 }}>
    <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
    <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M8 11h4" />
  </svg>
);

const HotelIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 21, height: 21 }}>
    <path d="M3 21h18" />
    <path d="M6 21V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14" />
    <path d="M10 7h4" /><path d="M10 11h4" /><path d="M10 15h4" />
  </svg>
);

const AiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" style={{ width: 21, height: 21 }}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <circle cx="9.5" cy="11.5" r="0.65" fill="white" stroke="none" />
    <circle cx="14.5" cy="11.5" r="0.65" fill="white" stroke="none" />
  </svg>
);

const routeToKey = {
  "/guest/dashboard":    "home",
  "/guest/orders":       "orders",
  "/guest/support":      "ai",
  "/guest/events":       "events",
  "/guest/hotel-info":   "hotel",
  "/guest/menu":         "orders",
  "/guest/housekeeping": "home",
  "/guest/cart":         "orders",
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
    if (pathname.startsWith("/guest/events"))      activeKey = "events";
    else if (pathname.startsWith("/guest/orders")) activeKey = "orders";
    else                                            activeKey = "home";
  }

  const isAiActive = activeKey === "ai";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes navUp {
          from { opacity:0; transform:translateY(80px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes tabFade {
          from { opacity:0; transform:translateY(6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes orbDrop {
          0%   { opacity:0; transform:scale(0.5) translateY(10px); }
          65%  { transform:scale(1.07) translateY(-2px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes ripple {
          0%   { transform:scale(1);   opacity:0.55; }
          100% { transform:scale(2.0); opacity:0;    }
        }
        @keyframes orbPulse {
          0%,100% { box-shadow:0 4px 16px rgba(164,0,93,0.42),0 2px 6px rgba(0,0,0,0.16); }
          50%     { box-shadow:0 6px 26px rgba(164,0,93,0.65),0 2px 6px rgba(0,0,0,0.16); }
        }

        .gbn-root  { animation: navUp  0.44s cubic-bezier(0.22,1,0.36,1) both; }
        .gbn-tab   { animation: tabFade 0.32s ease both; }
        .gbn-tab:active { transform: scale(0.84) !important; transition: transform 0.1s !important; }
        .gbn-orb   { animation: orbDrop 0.48s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .gbn-orb:active .orb-core { transform: scale(0.87); }
        .orb-core  { animation: orbPulse 2.8s ease-in-out 1s infinite; transition: transform 0.18s ease; }
        .ripple-a  { animation: ripple 2.6s ease-out 1.1s infinite; }
        .ripple-b  { animation: ripple 2.6s ease-out 2.4s infinite; }
      `}</style>

      {/* Outer shell — floats above page with side padding, like sketch */}
      <div className="gbn-root" style={{
        flexShrink: 0,
        position: "relative",
        zIndex: 9999,
        width: "100%",
        maxWidth: 430,
        margin: "0 auto",
        padding: "0 12px calc(env(safe-area-inset-bottom, 0px) + 10px)",
      }}>

        {/*
          The pill-shaped bar.
          The notch is created by a circular div positioned at the top-center
          that matches the page background, punching a smooth arc into the bar.
          The orb then floats right in that notch.
        */}
        <div style={{
          position: "relative",
          height: 64,
          borderRadius: 32,
          background: "rgba(244,235,222,0.96)",
          backdropFilter: "blur(28px) saturate(1.8)",
          WebkitBackdropFilter: "blur(28px) saturate(1.8)",
          border: "1px solid rgba(255,255,255,0.60)",
          boxShadow:
            "0 8px 32px rgba(26,20,16,0.14)," +
            "0 2px 8px rgba(26,20,16,0.08)," +
            "inset 0 1px 0 rgba(255,255,255,0.70)",
          overflow: "visible",
        }}>

          {/* ── Notch punch-out: matches body/page background exactly ── */}
          <div style={{
            position: "absolute",
            top: -18,
            left: "50%",
            transform: "translateX(-50%)",
            width: 72,
            height: 52,
            /* This gradient background fades from the page bg to transparent
               so it works even if the page bg is a gradient/image */
            background: "radial-gradient(ellipse at 50% 0%, #eddfc5 62%, transparent 100%)",
            borderRadius: "0 0 50% 50%",
            zIndex: 0,
            pointerEvents: "none",
          }} />

          {/* ── Nav items row ── */}
          <div style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            height: "100%",
            padding: "0 4px",
          }}>
            {/* Left tabs */}
            {[navItems[0], navItems[1]].map((item, i) => {
              const on = activeKey === item.key;
              return (
                <button key={item.key} className="gbn-tab"
                  onClick={() => navigate(item.route)}
                  style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    gap: 4, height: "100%",
                    background: "transparent", border: "none", cursor: "pointer",
                    padding: 0, WebkitTapHighlightColor: "transparent",
                    animationDelay: `${0.08 + i * 0.05}s`,
                    transition: "transform 0.14s ease",
                  }}>
                  <span style={{
                    display: "flex",
                    color: on ? "#A4005D" : "#b8a898",
                    transition: "color 0.22s, transform 0.22s cubic-bezier(0.22,1,0.36,1)",
                    transform: on ? "translateY(-1px) scale(1.12)" : "scale(1)",
                  }}>
                    <item.Icon active={on} />
                  </span>
                  <span style={{
                    fontSize: 9.5, lineHeight: 1,
                    fontWeight: on ? 600 : 400,
                    color: on ? "#A4005D" : "#b8a898",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    letterSpacing: "0.01em",
                    transition: "color 0.22s",
                  }}>{item.label}</span>
                  {/* Active underline dot */}
                  <div style={{
                    position: "absolute",
                    bottom: 6,
                    width: on ? 18 : 0,
                    height: 2,
                    borderRadius: 2,
                    background: "#A4005D",
                    transition: "width 0.3s cubic-bezier(0.22,1,0.36,1)",
                  }} />
                </button>
              );
            })}

            {/* Center gap — the orb lives here, label at bottom */}
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "flex-end",
              paddingBottom: 7, pointerEvents: "none",
            }}>
              <span style={{
                fontSize: 9.5, lineHeight: 1,
                fontWeight: isAiActive ? 600 : 400,
                color: isAiActive ? "#A4005D" : "#b8a898",
                fontFamily: "'DM Sans', system-ui, sans-serif",
                transition: "color 0.22s",
              }}>AI Chat</span>
            </div>

            {/* Right tabs */}
            {[navItems[2], navItems[3]].map((item, i) => {
              const on = activeKey === item.key;
              return (
                <button key={item.key} className="gbn-tab"
                  onClick={() => navigate(item.route)}
                  style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    gap: 4, height: "100%",
                    background: "transparent", border: "none", cursor: "pointer",
                    padding: 0, WebkitTapHighlightColor: "transparent",
                    animationDelay: `${0.18 + i * 0.05}s`,
                    transition: "transform 0.14s ease",
                  }}>
                  <span style={{
                    display: "flex",
                    color: on ? "#A4005D" : "#b8a898",
                    transition: "color 0.22s, transform 0.22s cubic-bezier(0.22,1,0.36,1)",
                    transform: on ? "translateY(-1px) scale(1.12)" : "scale(1)",
                  }}>
                    <item.Icon active={on} />
                  </span>
                  <span style={{
                    fontSize: 9.5, lineHeight: 1,
                    fontWeight: on ? 600 : 400,
                    color: on ? "#A4005D" : "#b8a898",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    letterSpacing: "0.01em",
                    transition: "color 0.22s",
                  }}>{item.label}</span>
                  {/* Active underline dot */}
                  <div style={{
                    position: "absolute",
                    bottom: 6,
                    width: on ? 18 : 0,
                    height: 2,
                    borderRadius: 2,
                    background: "#A4005D",
                    transition: "width 0.3s cubic-bezier(0.22,1,0.36,1)",
                  }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Orb button — absolutely centered above the pill bar ── */}
        <button
          className="gbn-orb"
          onClick={() => navigate("/guest/support")}
          style={{
            position: "absolute",
            top: -22,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 0,
            width: 52,
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            WebkitTapHighlightColor: "transparent",
          }}>
          {/* Ripple rings */}
          <div className="ripple-a" style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "1.5px solid rgba(196,74,135,0.50)",
            pointerEvents: "none",
          }} />
          <div className="ripple-b" style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "1.5px solid rgba(196,74,135,0.35)",
            pointerEvents: "none",
          }} />

          {/* Core */}
          <div className="orb-core" style={{
            width: 50, height: 50, borderRadius: "50%",
            background: "linear-gradient(150deg, #D44F93 0%, #A4005D 56%, #76003e 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1.5px solid rgba(255,255,255,0.20)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "40%",
              background: "linear-gradient(180deg,rgba(255,255,255,0.22),transparent)",
              borderRadius: "50% 50% 0 0", pointerEvents: "none",
            }} />
            <AiIcon />
          </div>
        </button>

      </div>
    </>
  );
}