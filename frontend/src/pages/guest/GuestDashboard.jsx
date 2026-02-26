import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";
import logo from "../../assets/logo.png";

import { useEffect, useState, useRef } from "react";
import { getGuestEvents } from "../../services/event.service";

export default function GuestDashboard() {
  const { guest, loading } = useGuestAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [cardsVisible, setCardsVisible] = useState(false);
  const [exploreVisible, setExploreVisible] = useState(false);

  const [sliderIndex, setSliderIndex] = useState(0);
  const sliderRef = useRef(null);
  const autoRef = useRef(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeIn(true), 50);
    const t2 = setTimeout(() => setCardsVisible(true), 300);
    const t3 = setTimeout(() => setExploreVisible(true), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    if (!loading && !guest) navigate("/guest/login");
  }, [guest, loading, navigate]);

  useEffect(() => {
    getGuestEvents().then((data) => setUpcomingEvents(data || []));
  }, []);

  // Auto-advance slider
  useEffect(() => {
    if (upcomingEvents.length === 0) return;
    autoRef.current = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % upcomingEvents.length);
    }, 3500);
    return () => clearInterval(autoRef.current);
  }, [upcomingEvents.length]);

  useEffect(() => {
    if (!sliderRef.current || upcomingEvents.length === 0) return;
    const cardWidth = sliderRef.current.offsetWidth * 0.82 + 12;
    sliderRef.current.scrollTo({ left: sliderIndex * cardWidth, behavior: "smooth" });
  }, [sliderIndex]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  // Helper: format event date/time from DB fields
  const formatEventTime = (ev) => {
    if (ev.time && ev.period) return `${ev.time} ${ev.period}`;
    if (ev.startTime) {
      const d = new Date(ev.startTime);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return "";
  };
  const formatEventDate = (ev) => {
    if (ev.date) return ev.date;
    if (ev.startTime) {
      const d = new Date(ev.startTime);
      const today = new Date();
      const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
      if (d.toDateString() === today.toDateString()) return "Today";
      if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
      return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
    }
    return "";
  };
  // Fallback gradient if DB event has no gradient field
  const eventGradients = [
    "linear-gradient(135deg,#3d1060,#8B4789)",
    "linear-gradient(135deg,#6a003c,#A4005D)",
    "linear-gradient(135deg,#0d3347,#1e6a8a)",
    "linear-gradient(135deg,#3d2400,#8a5200)",
    "linear-gradient(135deg,#1a3a1a,#2d6b2d)",
  ];

  // ── Icons ──────────────────────────────────────────────────────────────
  const FoodIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
      <path d="M6 18h12" /><path d="M7 18v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1" />
      <path d="M8 12h8" /><path d="M5 12a7 7 0 0 1 14 0" /><path d="M12 9v-1" />
    </svg>
  );
  const HouseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
      <path d="M6 3l12 12" /><path d="M10 7l-2 2" /><path d="M14 11l-2 2" />
      <path d="M4 20h7" /><path d="M4 20c1.2-3.4 3.6-5.8 7-7" />
      <path d="M11 13c1.2 0 2.7 1.1 3.6 2.1" />
    </svg>
  );
  const EventsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
      <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
      <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
      <path d="M8 11h4" />
    </svg>
  );
  const AmenitiesIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
      <circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" />
    </svg>
  );
  const OrdersNavIcon = ({ active }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6" /><path d="M9 16h4" />
    </svg>
  );
  const SupportNavIcon = ({ active }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r=".5" fill="currentColor" />
    </svg>
  );
  const HomeNavIcon = ({ active }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );

  const quickActions = [
    { icon: <FoodIcon />,  label: "Food Order",   sub: "In-room dining",  route: "/guest/menu",         accent: "linear-gradient(90deg,#A4005D,#C44A87)" },
    { icon: <HouseIcon />, label: "Housekeeping", sub: "Room essentials", route: "/guest/housekeeping", accent: "linear-gradient(90deg,#c9a96e,#d4b464)" },
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

  const handleSliderScroll = () => {
    if (!sliderRef.current) return;
    clearInterval(autoRef.current);
    const cardWidth = sliderRef.current.offsetWidth * 0.82 + 12;
    const idx = Math.round(sliderRef.current.scrollLeft / cardWidth);
    setSliderIndex(Math.max(0, Math.min(idx, upcomingEvents.length - 1)));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

        @keyframes heroFade {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes blob1 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%      { transform:translate(14px,-12px) scale(1.09); }
        }
        @keyframes blob2 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%      { transform:translate(-12px,14px) scale(1.07); }
        }

        /* Wave — draw once on mount */
        @keyframes waveDraw {
          0%   { stroke-dashoffset: 1200; opacity: 0; }
          8%   { opacity: 1; }
          100% { stroke-dashoffset: 0;    opacity: 1; }
        }
        /* Shimmer — bright spot racing across endlessly */
        @keyframes waveRace {
          0%   { stroke-dashoffset:  600; }
          100% { stroke-dashoffset: -600; }
        }
        /* Slow pulse on the base glow line */
        @keyframes waveGlow {
          0%,100% { opacity: 0.45; }
          50%      { opacity: 0.85; }
        }

        @keyframes pulseDot {
          0%,100% { box-shadow:0 0 0 0 rgba(134,239,172,0.6); }
          50%      { box-shadow:0 0 0 6px rgba(134,239,172,0); }
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes rowIn {
          from { opacity:0; transform:translateX(-14px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .card-hover { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .card-hover:hover { transform:translateY(-3px); box-shadow:0 12px 28px rgba(164,0,93,0.14)!important; }
        .row-hover  { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .row-hover:hover  { transform:translateX(4px); box-shadow:0 4px 18px rgba(164,0,93,0.1)!important; }
        .nav-btn { transition: background 0.2s ease, transform 0.15s ease; }
        .nav-btn:active { transform:scale(0.93); }

        /* Wave path classes */
        .wave-base {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: waveDraw 1.6s cubic-bezier(0.4,0,0.2,1) 0.2s forwards;
        }
        .wave-glow {
          animation: waveGlow 2.5s ease-in-out 1.9s infinite;
          opacity: 0;
        }
        /* After draw completes, glow fades in — handled by waveGlow delay */
        .wave-race {
          /* short bright dash racing along the path */
          stroke-dasharray: 90 1110;
          stroke-dashoffset: 600;
          animation: waveRace 1.8s linear 1.9s infinite;
          opacity: 0.9;
        }

        /* Event slider */
        .event-slider {
          display: flex;
          gap: 12px;
          overflow-x: scroll;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 4px 20px 10px;
        }
        .event-slider::-webkit-scrollbar { display:none; }
        .event-slide {
          scroll-snap-align: start;
          flex-shrink: 0;
          width: 82%;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          min-height: 188px;
        }
        .event-slide:hover { transform:translateY(-3px); box-shadow:0 16px 36px rgba(0,0,0,0.22)!important; }
        .event-slide:last-child { margin-right: 20px; }
      `}</style>

      <div style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        background: "#EFE1CF",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.5s ease",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        <div style={{
          flex: 1, overflowY: "auto", overflowX: "hidden",
          maxWidth: 430, width: "100%", margin: "0 auto",
        }}>

          {/* ══════════════════════════════════════════
              HERO — compact, tight padding
          ══════════════════════════════════════════ */}
          <div style={{
            position: "relative", overflow: "hidden",
            animation: "heroFade 0.65s cubic-bezier(0.22,1,0.36,1) both",
          }}>
            <img src={hotelbg} alt="Hotel" style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center top",
            }} />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(170deg, rgba(6,0,3,0.90) 0%, rgba(100,0,50,0.52) 50%, rgba(6,0,3,0.72) 100%)",
            }} />
            <div style={{
              position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(164,0,93,0.22), transparent 65%)",
              animation: "blob1 7s ease-in-out infinite", pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: 20, left: -40, width: 150, height: 150, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(196,74,135,0.15), transparent 65%)",
              animation: "blob2 9s ease-in-out infinite", pointerEvents: "none",
            }} />

            {/* ── COMPACT hero content — removed hotel pill, tighter padding ── */}
            <div style={{ position: "relative", zIndex: 2, padding: "40px 20px 56px" }}>

              {/* Row: greeting left, logo right — both on same line */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{
                  fontSize: 10, color: "rgba(255,255,255,0.88)",
                  fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase",
                  textShadow: "0 1px 10px rgba(0,0,0,0.9)",
                  margin: 0,
                }}>
                  {greeting}
                </p>

                {/* Logo in frosted circle */}
                <div style={{
                  width: 38, height: 38,
                  background: "rgba(255,255,255,0.14)", backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.28)", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <img src={logo} alt="Logo" style={{
                    width: 24, height: 24, objectFit: "contain",
                    filter: "brightness(0) invert(1)", opacity: 1,
                  }} />
                </div>
              </div>

              {/* Guest name — tighter margin */}
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 32, fontWeight: 300, fontStyle: "italic",
                color: "#fff", lineHeight: 1, margin: "0 0 10px",
                textShadow: "0 2px 16px rgba(0,0,0,0.6)",
              }}>
                {guest?.name || "Valued Guest"}
              </h1>

              {/* Room badge only — hotel pill removed */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                border: "1px solid rgba(255,255,255,0.22)",
                background: "rgba(255,255,255,0.11)", backdropFilter: "blur(10px)",
                borderRadius: 20, padding: "4px 12px",
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#86efac", flexShrink: 0,
                  animation: "pulseDot 2.2s ease-in-out infinite",
                }} />
                <span style={{
                  fontSize: 9, fontWeight: 700, color: "#fff",
                  letterSpacing: "0.14em", textTransform: "uppercase",
                }}>
                  ROOM {guest?.roomNumber}
                </span>
              </div>
            </div>

            {/* ══════════════════════════════════════════
                ENHANCED WAVE — 3-layer live gradient
            ══════════════════════════════════════════ */}
            <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, zIndex: 3, lineHeight: 0 }}>
              <svg
                viewBox="0 0 430 64"
                fill="none"
                preserveAspectRatio="none"
                style={{ width: "100%", height: 64, display: "block" }}
              >
                {/* Cream fill */}
                <path
                  d="M0 22 C60 58, 120 62, 180 40 C230 22, 280 8, 330 36 C370 58, 400 56, 430 34 L430 64 L0 64 Z"
                  fill="#EFE1CF"
                />

                {/* Layer 1 — base brand line, draws on mount, then glows */}
                <path
                  className="wave-base"
                  d="M0 22 C60 58, 120 62, 180 40 C230 22, 280 8, 330 36 C370 58, 400 56, 430 34"
                  fill="none"
                  stroke="url(#wGrad1)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Layer 2 — wider soft glow, pulses */}
                <path
                  className="wave-glow"
                  d="M0 22 C60 58, 120 62, 180 40 C230 22, 280 8, 330 36 C370 58, 400 56, 430 34"
                  fill="none"
                  stroke="url(#wGrad2)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Layer 3 — bright spark racing along endlessly */}
                <path
                  className="wave-race"
                  d="M0 22 C60 58, 120 62, 180 40 C230 22, 280 8, 330 36 C370 58, 400 56, 430 34"
                  fill="none"
                  stroke="url(#wGrad3)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                <defs>
                  {/* Base: full brand gradient */}
                  <linearGradient id="wGrad1" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"   stopColor="transparent" />
                    <stop offset="15%"  stopColor="#A4005D" stopOpacity="0.7" />
                    <stop offset="45%"  stopColor="#C44A87" />
                    <stop offset="75%"  stopColor="#A4005D" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>

                  {/* Glow: wider, softer brand pink */}
                  <linearGradient id="wGrad2" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"   stopColor="transparent" />
                    <stop offset="20%"  stopColor="#A4005D" stopOpacity="0.25" />
                    <stop offset="50%"  stopColor="#C44A87" stopOpacity="0.35" />
                    <stop offset="80%"  stopColor="#A4005D" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>

                  {/* Racing spark: bright white-pink highlight */}
                  <linearGradient id="wGrad3" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"   stopColor="transparent" />
                    <stop offset="40%"  stopColor="#C44A87" stopOpacity="0.8" />
                    <stop offset="55%"  stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="70%"  stopColor="#C44A87" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          {/* end hero */}

          {/* ══════════════════════════════════════════
              CREAM BODY
          ══════════════════════════════════════════ */}
          <div style={{ background: "#EFE1CF" }}>

            {/* QUICK ACTIONS */}
            <div style={{ padding: "20px 20px 0" }}>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "#6B6B6B", marginBottom: 14,
                animation: cardsVisible ? "fadeUp 0.5s ease both" : "none",
              }}>
                Quick Actions
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {quickActions.map((action, i) => (
                  <button key={action.label} onClick={() => navigate(action.route)} className="card-hover"
                    style={{
                      background: "#fff", borderRadius: 20, padding: "18px 14px 14px",
                      display: "flex", flexDirection: "column", alignItems: "flex-start",
                      border: "1px solid rgba(164,0,93,0.07)",
                      boxShadow: "0 2px 14px rgba(164,0,93,0.06)",
                      cursor: "pointer", minHeight: 130, textAlign: "left",
                      position: "relative", overflow: "hidden",
                      animation: cardsVisible ? `cardIn 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms both` : "none",
                    }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "20px 20px 0 0", background: action.accent }} />
                    <div style={{ width: 44, height: 44, borderRadius: 13, background: "#F6EADB", border: "1.5px solid rgba(164,0,93,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A4005D", marginBottom: 14 }}>
                      {action.icon}
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: "#1F1F1F", lineHeight: 1.1, marginBottom: 3 }}>{action.label}</p>
                    <p style={{ fontSize: 10, color: "#6B6B6B", fontWeight: 300 }}>{action.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* DIVIDER */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
              <div style={{ width: 5, height: 5, background: "rgba(164,0,93,0.3)", transform: "rotate(45deg)", flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
            </div>

            {/* ══════════════════════════════════════════
                UPCOMING EVENTS SLIDER — enhanced cards
            ══════════════════════════════════════════ */}
            <div style={{ paddingTop: 22 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", marginBottom: 14 }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6B6B6B", margin: 0 }}>
                  Upcoming Events
                </p>
                <button onClick={() => navigate("/guest/events")} style={{ fontSize: 10, color: "#A4005D", fontWeight: 600, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.04em" }}>
                  View All →
                </button>
              </div>

              {upcomingEvents.length === 0 ? (
                <div style={{ padding: "0 20px 10px" }}>
                  <div style={{ background: "#fff", borderRadius: 16, padding: "20px", textAlign: "center", border: "1px solid rgba(164,0,93,0.07)" }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: "#6B6B6B", fontWeight: 300 }}>No upcoming events</p>
                  </div>
                </div>
              ) : (
                <>
                  <div ref={sliderRef} className="event-slider" onScroll={handleSliderScroll}>
                    {upcomingEvents.map((ev, i) => {
                      const evTime = formatEventTime(ev);
                      const evDate = formatEventDate(ev);
                      const bg = ev.gradient || eventGradients[i % eventGradients.length];
                      return (
                        <div
                          key={ev.id || ev._id || i}
                          className="event-slide"
                          onClick={() => navigate("/guest/events")}
                          style={{
                            background: bg,
                            boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
                            animation: exploreVisible ? `cardIn 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms both` : "none",
                          }}
                        >
                          {/* Event image if available */}
                          {ev.image && (
                            <>
                              <img src={ev.image} alt={ev.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(0,0,0,0.6) 0%,rgba(0,0,0,0.2) 45%,rgba(0,0,0,0.7) 100%)" }} />
                            </>
                          )}

                          {/* Card content */}
                          <div style={{ position: "relative", zIndex: 1, padding: "14px 15px 14px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 188 }}>

                            {/* ── TOP ROW: availability tag + date/time block ── */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              {/* Tag */}
                              {ev.tag && (
                                <span style={{
                                  fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                  padding: "4px 10px", borderRadius: 8,
                                  background: ev.tagBg || "rgba(255,255,255,0.15)",
                                  color: ev.tagColor || "#fff",
                                  border: `1px solid ${ev.tagBorder || "rgba(255,255,255,0.25)"}`,
                                  backdropFilter: "blur(6px)",
                                }}>
                                  {ev.tag}
                                </span>
                              )}

                              {/* Date + Time block — top right */}
                              <div style={{
                                display: "flex", flexDirection: "column", alignItems: "flex-end",
                                background: "rgba(0,0,0,0.28)", backdropFilter: "blur(8px)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                borderRadius: 10, padding: "6px 10px", marginLeft: "auto",
                                marginLeft: ev.tag ? 8 : "auto",
                              }}>
                                {/* Date */}
                                <span style={{
                                  fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.7)",
                                  letterSpacing: "0.08em", textTransform: "uppercase",
                                  lineHeight: 1, marginBottom: 3,
                                }}>
                                  {evDate}
                                </span>
                                {/* Time */}
                                <span style={{
                                  fontSize: 15, fontWeight: 700, color: "#fff",
                                  lineHeight: 1, fontFamily: "'Cormorant Garamond', serif",
                                }}>
                                  {evTime}
                                </span>
                              </div>
                            </div>

                            {/* ── BOTTOM: emoji/icon, title, description, location ── */}
                            <div>
                              {!ev.image && ev.emoji && (
                                <div style={{ fontSize: 28, marginBottom: 6, lineHeight: 1 }}>{ev.emoji}</div>
                              )}

                              {/* Title */}
                              <p style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: 22, fontWeight: 600, color: "#fff",
                                lineHeight: 1.05, marginBottom: 5,
                                textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                              }}>
                                {ev.title || ev.name}
                              </p>

                              {/* Description */}
                              {ev.description && (
                                <p style={{
                                  fontSize: 9.5, color: "rgba(255,255,255,0.62)",
                                  fontWeight: 300, lineHeight: 1.55, marginBottom: 8,
                                  display: "-webkit-box", WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical", overflow: "hidden",
                                }}>
                                  {ev.description}
                                </p>
                              )}

                              {/* Location row */}
                              {(ev.location || ev.venue) && (
                                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11, flexShrink: 0 }}>
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>
                                    {ev.location || ev.venue}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dot indicators */}
                  <div style={{ display: "flex", justifyContent: "center", gap: 6, paddingBottom: 4 }}>
                    {upcomingEvents.map((_, i) => (
                      <div key={i} onClick={() => setSliderIndex(i)} style={{
                        width: i === sliderIndex ? 20 : 6, height: 6, borderRadius: 3,
                        background: i === sliderIndex ? "#A4005D" : "rgba(164,0,93,0.22)",
                        transition: "all 0.3s ease", cursor: "pointer",
                      }} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* DIVIDER */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
              <div style={{ width: 5, height: 5, background: "rgba(164,0,93,0.3)", transform: "rotate(45deg)", flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
            </div>

            {/* YOUR ORDERS */}
            <div style={{ padding: "22px 20px 0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6B6B6B", margin: 0 }}>Your Orders</p>
                <button onClick={() => navigate("/guest/orders")} style={{ fontSize: 10, color: "#A4005D", fontWeight: 600, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.04em" }}>View All →</button>
              </div>

              {hasActiveOrder ? (
                <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(164,0,93,0.08)", boxShadow: "0 2px 14px rgba(30,21,16,0.05)", padding: 18, animation: "fadeUp 0.5s ease both" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: "#1F1F1F" }}>Current Order</span>
                    <span style={{ background: "rgba(164,0,93,0.08)", color: "#A4005D", border: "1px solid rgba(164,0,93,0.12)", borderRadius: 20, padding: "4px 12px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em" }}>{activeOrder.status.toUpperCase()}</span>
                  </div>
                  {activeOrder.items.map((item) => (
                    <div key={item.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#5c4a3e", fontWeight: 300, padding: "8px 0", borderBottom: "1px solid rgba(164,0,93,0.06)" }}>
                      <span>{item.name}</span><span style={{ color: "#6B6B6B" }}>×{item.qty}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(164,0,93,0.07)", boxShadow: "0 2px 12px rgba(30,21,16,0.04)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, animation: "fadeUp 0.55s ease 0.1s both" }}>
                  <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 13, background: "#F6EADB", border: "1.5px solid rgba(164,0,93,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A4005D" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6" /><path d="M9 16h4" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, color: "#1F1F1F", marginBottom: 2 }}>No active orders</p>
                    <p style={{ fontSize: 11, color: "#6B6B6B", fontWeight: 300 }}>Your requests will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {/* DIVIDER */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 20px" }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
              <div style={{ width: 5, height: 5, background: "rgba(164,0,93,0.3)", transform: "rotate(45deg)", flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
            </div>

            {/* EXPLORE */}
            <div style={{ padding: "0 20px 24px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6B6B6B", marginBottom: 12 }}>Explore</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: <EventsIcon />,    label: "All Events", route: "/guest/events" },
                  { icon: <AmenitiesIcon />, label: "Amenities",  route: "/guest/hotel-info" },
                ].map((item, i) => (
                  <button key={item.label} onClick={() => navigate(item.route)} className="row-hover"
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      width: "100%", background: "#fff", borderRadius: 16, padding: "14px 16px",
                      border: "1px solid rgba(164,0,93,0.07)", boxShadow: "0 2px 10px rgba(30,21,16,0.04)",
                      cursor: "pointer", textAlign: "left",
                      animation: exploreVisible ? `rowIn 0.5s cubic-bezier(0.22,1,0.36,1) ${400 + i * 100}ms both` : "none",
                    }}
                  >
                    <div style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 12, background: "#F6EADB", border: "1.5px solid rgba(164,0,93,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A4005D" }}>{item.icon}</div>
                    <span style={{ flex: 1, fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: "#1F1F1F" }}>{item.label}</span>
                    <span style={{ color: "#A4005D", fontSize: 18, opacity: 0.4 }}>›</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM NAV */}
        <div style={{
          flexShrink: 0, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(164,0,93,0.1)", boxShadow: "0 -2px 20px rgba(30,21,16,0.07)",
          maxWidth: 430, width: "100%", margin: "0 auto",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", padding: "10px 8px" }}>
            {navItems.map((item) => {
              const isActive = activeNav === item.key;
              return (
                <button key={item.key} onClick={() => { setActiveNav(item.key); navigate(item.route); }} className="nav-btn"
                  style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 28px", borderRadius: 14, background: isActive ? "rgba(164,0,93,0.07)" : "transparent", border: "none", cursor: "pointer" }}
                >
                  <span style={{ color: isActive ? "#A4005D" : "#6B6B6B", transition: "color 0.2s ease" }}>{item.icon(isActive)}</span>
                  <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: isActive ? "#A4005D" : "#6B6B6B", transition: "color 0.2s ease" }}>{item.label}</span>
                  {isActive && <div style={{ position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "#A4005D" }} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}