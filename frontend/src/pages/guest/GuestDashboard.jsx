import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";
import logo from "../../assets/logo.png";

import { useEffect, useState, useRef } from "react";
import { getGuestEvents } from "../../services/event.service";

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

const EventsNavIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M8 3v3" /><path d="M16 3v3" /><path d="M4 7h16" />
    <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M8 11h4" />
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

const HotelNavIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M3 21h18" />
    <path d="M6 21V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14" />
    <path d="M10 7h4" />
    <path d="M10 11h4" />
    <path d="M10 15h4" />
  </svg>
);

const HomeNavIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

export default function GuestDashboard() {
  const { guest, loading } = useGuestAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [cardsVisible, setCardsVisible] = useState(false);

  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const autoRef = useRef(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeIn(true), 50);
    const t2 = setTimeout(() => setCardsVisible(true), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (!loading && !guest) navigate("/guest/login");
  }, [guest, loading, navigate]);

  useEffect(() => {
    getGuestEvents().then((data) => setUpcomingEvents(data || []));
  }, []);

  useEffect(() => {
    if (upcomingEvents.length === 0) return;
    autoRef.current = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % upcomingEvents.length);
    }, 4500);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [upcomingEvents.length]);

  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);
  const handleTouchStart = (e) => { touchStartRef.current = e.changedTouches[0].clientX; };
  const handleTouchEnd = (e) => {
    touchEndRef.current = e.changedTouches[0].clientX;
    handleSwipe();
  };
  const handleSwipe = () => {
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      if (autoRef.current) clearInterval(autoRef.current);
      setCurrentEventIndex((prev) => (prev + 1) % upcomingEvents.length);
      restartAutoplay();
    } else if (isRightSwipe) {
      if (autoRef.current) clearInterval(autoRef.current);
      setCurrentEventIndex((prev) => (prev - 1 + upcomingEvents.length) % upcomingEvents.length);
      restartAutoplay();
    }
  };
  const restartAutoplay = () => {
    const timer = setTimeout(() => {
      autoRef.current = setInterval(() => {
        setCurrentEventIndex((prev) => (prev + 1) % upcomingEvents.length);
      }, 4500);
    }, 5000);
    return () => clearTimeout(timer);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const formatEventTime = (ev) => ev.eventTime || "";
  const formatEventDate = (ev) => {
    if (ev.eventDate) {
      const d = new Date(ev.eventDate);
      const today = new Date();
      const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
      if (d.toDateString() === today.toDateString()) return "Today";
      if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
      return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
    }
    return "";
  };

  const eventGradients = [
    "linear-gradient(160deg,#2d0840 0%,#7B2D8B 100%)",
    "linear-gradient(160deg,#5c001a 0%,#A4005D 100%)",
    "linear-gradient(160deg,#082036 0%,#1a6a8a 100%)",
    "linear-gradient(160deg,#2d1500 0%,#8a5200 100%)",
    "linear-gradient(160deg,#0e2e0e 0%,#2d6b2d 100%)",
  ];

  const quickActions = [
    { icon: <FoodIcon />,  label: "Food Order",   sub: "In-room dining",  route: "/guest/menu",         accent: "linear-gradient(135deg,#A4005D,#C44A87)" },
    { icon: <HouseIcon />, label: "Housekeeping", sub: "Room essentials", route: "/guest/housekeeping", accent: "linear-gradient(135deg,#c9a96e,#b8883a)" },
  ];

  const navItemsLeft = [
    { key: "home",  label: "Home",      icon: (a) => <HomeNavIcon active={a} />,  route: "/guest/dashboard" },
    { key: "hotel", label: "Hotel Info", icon: (a) => <HotelNavIcon active={a} />, route: "/guest/hotel-info" },
  ];

  const navItemsRight = [
    { key: "orders", label: "Orders", icon: (a) => <OrdersNavIcon active={a} />, route: "/guest/orders" },
    { key: "events", label: "Events", icon: (a) => <EventsNavIcon active={a} />, route: "/guest/events" },
  ];

  const isAiActive = activeNav === "ai";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { -webkit-font-smoothing: antialiased; }

        /* ── Original wave animations — untouched ── */
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
        @keyframes waveDraw {
          0%   { stroke-dashoffset: 1400; opacity: 0; }
          5%   { opacity: 1; }
          100% { stroke-dashoffset: 0;    opacity: 1; }
        }
        @keyframes waveGlow {
          0%,100% { opacity: 0.45; }
          50%      { opacity: 0.88; }
        }
        @keyframes waveRace {
          0%   { stroke-dashoffset:  700; }
          100% { stroke-dashoffset: -700; }
        }
        @keyframes waveAura {
          0%,100% { opacity: 0.15; stroke-width: 10; }
          50%      { opacity: 0.28; stroke-width: 15; }
        }
        @keyframes waveRace2 {
          0%   { stroke-dashoffset: -400; }
          100% { stroke-dashoffset:  400; }
        }
        @keyframes delayFadeIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        .wave-base {
          stroke-dasharray: 1400;
          stroke-dashoffset: 1400;
          animation: waveDraw 2.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards;
        }
        .wave-glow  { opacity: 0; animation: waveGlow  4.5s ease-in-out 3.1s infinite, delayFadeIn 0.8s ease 3.0s forwards; }
        .wave-aura  { opacity: 0; animation: waveAura  6s ease-in-out 3.1s infinite,   delayFadeIn 1s ease 3.0s forwards; }
        .wave-race  { stroke-dasharray: 130 1270; stroke-dashoffset: 700; opacity: 0;
                      animation: waveRace  3.2s linear 3.1s infinite, delayFadeIn 0.6s ease 3.0s forwards; }
        .wave-race2 { stroke-dasharray: 60 1340; stroke-dashoffset: -400; opacity: 0;
                      animation: waveRace2 5.5s linear 3.3s infinite, delayFadeIn 0.7s ease 3.2s forwards; }

        /* ── Pulse dot ── */
        @keyframes pulseDot {
          0%,100% { box-shadow:0 0 0 0 rgba(134,239,172,0.6); }
          50%      { box-shadow:0 0 0 6px rgba(134,239,172,0); }
        }

        /* ── Body animations ── */
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

        /* ── Event card transitions — original ── */
        @keyframes fadeSlideOut {
          0%   { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-20px); }
        }
        @keyframes fadeSlideIn {
          0%   { opacity: 0; transform: translateX(20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .event-card-container {
          position: relative; width: 100%; aspect-ratio: 16 / 9; perspective: 1000px;
        }
        .event-card-wrapper {
          position: absolute; width: 100%; height: 100%;
          border-radius: 22px; overflow: hidden; will-change: opacity, transform;
        }
        .event-card-wrapper.active {
          animation: fadeSlideIn 0.7s cubic-bezier(0.22,1,0.36,1) forwards; z-index: 1;
        }
        .event-card-wrapper.exit {
          animation: fadeSlideOut 0.7s cubic-bezier(0.22,1,0.36,1) forwards; z-index: 0;
        }
        .event-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: center; z-index: 0;
        }
        .event-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.82) 100%);
          z-index: 1;
        }

        /* ── Interactive states ── */
        .card-hover { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .card-hover:active { transform: scale(0.97); }
        .row-hover  { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .row-hover:active  { transform: scale(0.98); }
        .nav-btn { transition: background 0.2s ease, transform 0.15s ease; }
        .nav-btn:active { transform:scale(0.93); }
      `}</style>

      {/* ── ROOT: identical to original ── */}
      <div style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        background: "#EFE1CF",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.5s ease",
        paddingBottom: "env(safe-area-inset-bottom)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        {/* ── SCROLLABLE BODY: identical padding/structure to original ── */}
        <div style={{
          flex: 1, overflowY: "auto", overflowX: "hidden",
          maxWidth: 430, width: "100%", margin: "0 auto",
          paddingBottom: "92px",
        }}>

          {/* ══ HERO — same layout, refined overlays ══ */}
          <div style={{
            position: "relative", overflow: "hidden",
            animation: "heroFade 0.65s cubic-bezier(0.22,1,0.36,1) both",
          }}>
            <img src={hotelbg} alt="Hotel" style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center top",
            }} />

            {/* Richer layered overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(170deg, rgba(6,0,3,0.88) 0%, rgba(100,0,50,0.48) 50%, rgba(6,0,3,0.70) 100%)",
            }} />
            {/* Radial vignette for depth */}
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% 0%, transparent 45%, rgba(0,0,0,0.3) 100%)",
            }} />

            {/* Blobs — same as original */}
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

            {/* ── Hero content — same padding as original ── */}
            <div style={{ position: "relative", zIndex: 2, padding: "40px 20px 62px" }}>

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                {/* Left: greeting + name */}
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {/* Greeting with subtle icon */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11 }}>
                      {hour < 12 ? "☀️" : hour < 17 ? "🌤️" : "🌙"}
                    </span>
                    <p style={{
                      fontSize: 9, color: "rgba(255,255,255,0.82)",
                      fontWeight: 500, letterSpacing: "0.24em", textTransform: "uppercase",
                      textShadow: "0 1px 10px rgba(0,0,0,0.9)",
                      margin: 0, lineHeight: 1,
                    }}>{greeting}</p>
                  </div>
                  <h1 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 34, fontWeight: 300, fontStyle: "italic",
                    color: "#fff", lineHeight: 1,
                    margin: 0,
                    textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                    letterSpacing: "-0.01em",
                  }}>
                    {guest?.name || "Valued Guest"}
                  </h1>
                </div>

                {/* Logo — same as original, slightly refined border */}
                <div style={{
                  width: 54, height: 54,
                  background: "rgba(255,255,255,0.14)", backdropFilter: "blur(18px)",
                  border: "1px solid rgba(255,255,255,0.28)", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}>
                  <img src={logo} alt="Logo" style={{
                    width: 36, height: 36, objectFit: "contain",
                    filter: "brightness(0) invert(1)", opacity: 0.95,
                  }} />
                </div>
              </div>

              {/* Room badge — same structure, refined look */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)",
                borderRadius: 20, padding: "5px 13px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#86efac", flexShrink: 0,
                  animation: "pulseDot 2.2s ease-in-out infinite",
                }} />
                <span style={{
                  fontSize: 9, fontWeight: 700, color: "#fff",
                  letterSpacing: "0.16em", textTransform: "uppercase",
                }}>
                  ROOM {guest?.roomNumber}
                </span>
              </div>
            </div>

            {/* ══ WAVE — exact original 5-layer SVG, untouched ══ */}
            <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, zIndex: 3, lineHeight: 0 }}>
              <svg viewBox="0 0 430 80" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 80, display: "block" }}>
                <path d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44 L430 80 L0 80 Z" fill="#EFE1CF" />
                <path className="wave-aura"
                  d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44"
                  fill="none" stroke="url(#wGrad2)" strokeWidth="12" strokeLinecap="round" />
                <path className="wave-base"
                  d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44"
                  fill="none" stroke="url(#wGrad1)" strokeWidth="2.2" strokeLinecap="round" />
                <path className="wave-glow"
                  d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44"
                  fill="none" stroke="url(#wGrad2)" strokeWidth="7" strokeLinecap="round" />
                <path className="wave-race"
                  d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44"
                  fill="none" stroke="url(#wGrad3)" strokeWidth="4" strokeLinecap="round" />
                <path className="wave-race2"
                  d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44"
                  fill="none" stroke="url(#wGrad2)" strokeWidth="5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="wGrad1" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"   stopColor="transparent" />
                    <stop offset="12%"  stopColor="#A4005D" stopOpacity="0.65" />
                    <stop offset="42%"  stopColor="#D44F93" />
                    <stop offset="72%"  stopColor="#A4005D" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  <linearGradient id="wGrad2" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"   stopColor="transparent" />
                    <stop offset="18%"  stopColor="#A4005D" stopOpacity="0.22" />
                    <stop offset="50%"  stopColor="#D44F93" stopOpacity="0.32" />
                    <stop offset="82%"  stopColor="#A4005D" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  <linearGradient id="wGrad3" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"   stopColor="transparent" />
                    <stop offset="38%"  stopColor="#C44A87" stopOpacity="0.7" />
                    <stop offset="52%"  stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="66%"  stopColor="#C44A87" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          {/* end hero */}

          {/* ══ CREAM BODY — same structure as original ══ */}
          <div style={{ background: "#EFE1CF" }}>

            {/* ── QUICK ACTIONS ── */}
            <div style={{ padding: "16px 20px 0" }}>
              <p style={{
                fontSize: 9, fontWeight: 600, letterSpacing: "0.22em",
                textTransform: "uppercase", color: "#8a7a70", marginBottom: 14,
                animation: cardsVisible ? "fadeUp 0.5s ease both" : "none",
              }}>
                Quick Actions
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {quickActions.map((action, i) => (
                  <button key={action.label} onClick={() => navigate(action.route)} className="card-hover"
                    style={{
                      background: "#fff", borderRadius: 22, padding: "18px 14px 16px",
                      display: "flex", flexDirection: "column", alignItems: "flex-start",
                      border: "1px solid rgba(164,0,93,0.06)",
                      boxShadow: "0 4px 20px rgba(26,20,16,0.07)",
                      cursor: "pointer", minHeight: 130, textAlign: "left",
                      position: "relative", overflow: "hidden",
                      animation: cardsVisible ? `cardIn 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms both` : "none",
                    }}
                  >
                    {/* Top accent stripe */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 3,
                      borderRadius: "22px 22px 0 0", background: action.accent,
                    }} />

                    {/* Icon bubble */}
                    <div style={{
                      width: 46, height: 46, borderRadius: 14,
                      background: "linear-gradient(135deg,rgba(164,0,93,0.07),rgba(196,74,135,0.1))",
                      border: "1.5px solid rgba(164,0,93,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#A4005D", marginBottom: 14,
                    }}>
                      {action.icon}
                    </div>

                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 18, fontWeight: 600, color: "#1A1410",
                      lineHeight: 1.1, marginBottom: 3,
                    }}>{action.label}</p>
                    <p style={{ fontSize: 10, color: "#8a7a70", fontWeight: 400 }}>{action.sub}</p>

                    {/* Subtle arrow */}
                    <div style={{
                      position: "absolute", bottom: 14, right: 14,
                      color: "rgba(164,0,93,0.35)", fontSize: 16, lineHeight: 1,
                    }}>›</div>
                  </button>
                ))}
              </div>
            </div>

            {/* DIVIDER */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.18), transparent)" }} />
              <div style={{ width: 4, height: 4, background: "rgba(164,0,93,0.28)", transform: "rotate(45deg)", flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.18), transparent)" }} />
            </div>

            {/* ── UPCOMING EVENTS — same layout/logic as original ── */}
            <div style={{ paddingTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", marginBottom: 14 }}>
                <p style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: "0.22em",
                  textTransform: "uppercase", color: "#8a7a70", margin: 0,
                }}>
                  Upcoming Events
                </p>
                <button onClick={() => navigate("/guest/events")} style={{
                  fontSize: 10, color: "#A4005D", fontWeight: 600,
                  background: "none", border: "none", cursor: "pointer",
                  letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 2,
                }}>
                  View All <span style={{ fontSize: 14 }}>›</span>
                </button>
              </div>

              {upcomingEvents.length === 0 ? (
                <div style={{ padding: "0 20px 10px" }}>
                  <div style={{
                    background: "#fff", borderRadius: 18, padding: "28px 20px",
                    textAlign: "center", border: "1px solid rgba(164,0,93,0.06)",
                    boxShadow: "0 4px 20px rgba(26,20,16,0.06)",
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🎭</div>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 16, color: "#8a7a70", fontWeight: 300, fontStyle: "italic", margin: 0,
                    }}>No upcoming events</p>
                    <p style={{ fontSize: 10, color: "#a89890", marginTop: 4, marginBottom: 0 }}>Check back soon</p>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ padding: "0 20px", position: "relative" }}>
                    {/* Event card container — same as original */}
                    <div
                      className="event-card-container"
                      style={{ boxShadow: "0 12px 40px rgba(26,20,16,0.16)", borderRadius: 22 }}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                    >
                      {upcomingEvents.map((ev, i) => {
                        const evTime = formatEventTime(ev);
                        const evDate = formatEventDate(ev);
                        const bg = ev.gradient || eventGradients[i % eventGradients.length];
                        const isActive = i === currentEventIndex;
                        const wasActive = i === (currentEventIndex - 1 + upcomingEvents.length) % upcomingEvents.length;
                        return (
                          <div
                            key={ev.id || ev._id || i}
                            className={`event-card-wrapper ${isActive ? "active" : wasActive ? "exit" : ""}`}
                            onClick={() => navigate("/guest/events")}
                            style={{ background: bg, cursor: "pointer" }}
                          >
                            {ev.image && (
                              <>
                                <img className="event-img" src={ev.image} alt={ev.title || ev.name} />
                                <div className="event-scrim" />
                              </>
                            )}
                            {!ev.image && (
                              <div style={{
                                position: "absolute", inset: 0, zIndex: 1,
                                background: "radial-gradient(ellipse at 70% 20%, rgba(255,255,255,0.12) 0%, transparent 60%)",
                              }} />
                            )}

                            {/* Card content — same layout */}
                            <div style={{
                              position: "relative", zIndex: 2,
                              padding: "14px 16px 16px",
                              height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end",
                            }}>
                              {ev.tag && (
                                <div style={{
                                  position: "absolute", top: 14, left: 16,
                                  fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
                                  textTransform: "uppercase", padding: "4px 10px", borderRadius: 8,
                                  background: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.9)",
                                  border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(8px)",
                                }}>{ev.tag}</div>
                              )}
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {(evDate || evTime) && (
                                  <div style={{
                                    display: "inline-flex", alignItems: "center", gap: 6,
                                    background: "rgba(0,0,0,0.32)", backdropFilter: "blur(8px)",
                                    border: "1px solid rgba(249,168,212,0.22)",
                                    borderRadius: 6, padding: "4px 10px", alignSelf: "flex-start",
                                  }}>
                                    {evDate && <span style={{ fontSize: 9, fontWeight: 700, color: "#F9A8D4", letterSpacing: "0.16em", textTransform: "uppercase" }}>{evDate}</span>}
                                    {evDate && evTime && <span style={{ fontSize: 8, color: "rgba(249,168,212,0.4)", fontWeight: 300 }}>·</span>}
                                    {evTime && <span style={{ fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.8)", letterSpacing: "0.06em" }}>{evTime}</span>}
                                  </div>
                                )}
                                <p style={{
                                  fontFamily: "'Cormorant Garamond', serif",
                                  fontSize: 22, fontWeight: 700, color: "#fff",
                                  lineHeight: 1.1, margin: 0,
                                  textShadow: "0 2px 14px rgba(0,0,0,0.6)",
                                }}>{ev.title || ev.name}</p>
                                {ev.description && (
                                  <p style={{
                                    fontSize: 11.5, color: "rgba(255,255,255,0.72)",
                                    fontWeight: 400, lineHeight: 1.4, margin: 0,
                                    display: "-webkit-box", WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical", overflow: "hidden",
                                    textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                                  }}>{ev.description}</p>
                                )}
                                {(ev.location || ev.venue) && (
                                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#F9A8D4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11, flexShrink: 0 }}>
                                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                      <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>
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
                  </div>

                  {/* Dot indicators — same as original */}
                  <div style={{ display: "flex", justifyContent: "center", gap: 6, paddingBottom: 4, marginTop: 12 }}>
                    {upcomingEvents.map((_, i) => (
                      <button key={i} onClick={() => setCurrentEventIndex(i)} style={{
                        width: i === currentEventIndex ? 22 : 6,
                        height: 6, borderRadius: 3,
                        background: i === currentEventIndex ? "#A4005D" : "rgba(164,0,93,0.2)",
                        transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                        cursor: "pointer", border: "none", padding: 0,
                      }} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* DIVIDER */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.18), transparent)" }} />
              <div style={{ width: 4, height: 4, background: "rgba(164,0,93,0.28)", transform: "rotate(45deg)", flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.18), transparent)" }} />
            </div>

          </div>
          {/* end cream body */}
        </div>
        {/* end scrollable */}

        {/* ══ BOTTOM NAV — same structure as original ══ */}
        <div style={{
          flexShrink: 0,
          background: "rgba(242,232,220,0.97)", backdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(164,0,93,0.1)",
          boxShadow: "0 -4px 24px rgba(26,20,16,0.08)",
          maxWidth: 430, width: "100%", margin: "0 auto",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", padding: "7px 8px 5px" }}>
            {navItemsLeft.map((item) => {
              const isActive = activeNav === item.key;
              return (
                <button key={item.key} onClick={() => { setActiveNav(item.key); navigate(item.route); }} className="nav-btn"
                  style={{
                    position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                    padding: "6px 18px", borderRadius: 14,
                    background: isActive ? "rgba(164,0,93,0.08)" : "transparent",
                    border: "none", cursor: "pointer",
                  }}
                >
                  <span style={{ color: isActive ? "#A4005D" : "#8a7a70", transition: "color 0.2s ease" }}>
                    {item.icon(isActive)}
                  </span>
                  <span style={{
                    fontSize: 7, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                    color: isActive ? "#A4005D" : "#8a7a70", transition: "color 0.2s ease",
                  }}>{item.label}</span>
                  {isActive && (
                    <div style={{
                      position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                      width: 18, height: 2, borderRadius: 1, background: "#A4005D",
                    }} />
                  )}
                </button>
              );
            })}

            {/* Center AI Chat */}
            <button
              key="ai"
              onClick={() => { setActiveNav("ai"); navigate("/guest/support"); }}
              className="nav-btn"
              style={{
                position: "relative",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
                transform: "translateY(-10px)",
              }}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#A4005D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 30px rgba(26,20,16,0.22)",
                border: isAiActive ? "2px solid rgba(255,255,255,0.9)" : "2px solid rgba(255,255,255,0.65)",
              }}>
                <span style={{ color: "#fff" }}>
                  <SupportNavIcon active={true} />
                </span>
              </div>
              <div style={{
                marginTop: 6,
                fontSize: 7,
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: isAiActive ? "#A4005D" : "#8a7a70",
                textAlign: "center",
              }}>
                AI Chat
              </div>
            </button>

            {navItemsRight.map((item) => {
              const isActive = activeNav === item.key;
              return (
                <button key={item.key} onClick={() => { setActiveNav(item.key); navigate(item.route); }} className="nav-btn"
                  style={{
                    position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                    padding: "6px 18px", borderRadius: 14,
                    background: isActive ? "rgba(164,0,93,0.08)" : "transparent",
                    border: "none", cursor: "pointer",
                  }}
                >
                  <span style={{ color: isActive ? "#A4005D" : "#8a7a70", transition: "color 0.2s ease" }}>
                    {item.icon(isActive)}
                  </span>
                  <span style={{
                    fontSize: 7, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                    color: isActive ? "#A4005D" : "#8a7a70", transition: "color 0.2s ease",
                  }}>{item.label}</span>
                  {isActive && (
                    <div style={{
                      position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                      width: 18, height: 2, borderRadius: 1, background: "#A4005D",
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