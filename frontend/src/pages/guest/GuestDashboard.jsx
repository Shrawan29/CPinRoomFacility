import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";
import logo from "../../assets/logo.png";

import { useEffect, useState, useRef } from "react";
import { getGuestEvents } from "../../services/event.service";
import GuestBottomNav from "../../components/guest/GuestBottomNav";

export default function GuestDashboard() {
  const { guest, loading } = useGuestAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [cardsVisible, setCardsVisible] = useState(false);
  const [exploreVisible, setExploreVisible] = useState(false);

  const [currentEventIndex, setCurrentEventIndex] = useState(0);
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

  // Auto-advance event card every 4.5 seconds
  useEffect(() => {
    if (upcomingEvents.length === 0) return;

    autoRef.current = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % upcomingEvents.length);
    }, 4500); // Auto-transition every 4.5 seconds

    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [upcomingEvents.length]);

  // Touch swipe handling for manual event navigation
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  const handleTouchStart = (e) => {
    touchStartRef.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndRef.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Swiped left - go to next event
      if (autoRef.current) clearInterval(autoRef.current);
      setCurrentEventIndex((prev) => (prev + 1) % upcomingEvents.length);
      restartAutoplay();
    } else if (isRightSwipe) {
      // Swiped right - go to previous event
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

  // ── Icons ──────────────────────────────────────────────────────────────
const FoodIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 32, height: 32 }}  // increased size
  >
    {/* Bottom tray */}
    <path d="M3 17h18" />
    <path d="M5 17l2 2h10l2-2" />

    {/* Dome */}
    <path d="M4 14a8 8 0 0 1 16 0" />

    {/* Top handle */}
    <path d="M10.5 5h3" />
    <path d="M12 5v-2" />

    {/* Shine curve */}
    <path d="M7 12a5 5 0 0 1 3-3" />
  </svg>
);
   const HouseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 32, height: 32 }}
  >
    {/* Mop Handle */}
    <path d="M17 3v12" />

    {/* Mop Connector */}
    <path d="M15 15h4" />

    {/* Mop Base */}
    <path d="M14 17h6l-1 3h-4z" />

    {/* Bucket Rim */}
    <ellipse cx="8" cy="8" rx="3.5" ry="1.5" />

    {/* Bucket Body */}
    <path d="M4.5 8l1 6a3 3 0 0 0 3 2h1a3 3 0 0 0 3-2l1-6" />

    {/* Bucket Handle */}
    <path d="M4.5 9c0-2 2-3.5 3.5-3.5" />

    {/* Water Drop */}
    <path d="M8 11c1-1 2 0 2 1a2 2 0 0 1-4 0c0-1 1-1.5 2-1z" />
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
    { icon: <FoodIcon />, label: "Food Order", sub: "In-room dining", route: "/guest/menu", accent: "linear-gradient(90deg,#A4005D,#C44A87)" },
    { icon: <HouseIcon />, label: "Housekeeping", sub: "Room essentials", route: "/guest/housekeeping", accent: "linear-gradient(90deg,#c9a96e,#d4b464)" },
  ];

  const hasActiveOrder = false;
  const activeOrder = {
    items: [{ name: "Veg Sandwich", qty: 1 }, { name: "Mineral Water", qty: 1 }],
    status: "Preparing",
  };

  const navItems = [
    { key: "home", label: "Home", icon: (a) => <HomeNavIcon active={a} />, route: "/guest/dashboard" },
    { key: "orders", label: "Orders", icon: (a) => <OrdersNavIcon active={a} />, route: "/guest/orders" },
    { key: "support", label: "Support", icon: (a) => <SupportNavIcon active={a} />, route: "/guest/support" },
  ];

  // No longer needed for single card view

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

        /* ─── Wave animations ─────────────────────────── */
        /* 1) Draw the stroke on mount — slow, graceful reveal */
        @keyframes waveDraw {
          0%   { stroke-dashoffset: 1400; opacity: 0; }
          5%   { opacity: 1; }
          100% { stroke-dashoffset: 0;    opacity: 1; }
        }
        /* 2) Gentle breathe on the base glow line */
        @keyframes waveGlow {
          0%,100% { opacity: 0.45; }
          50%      { opacity: 0.88; }
        }
        /* 3) Slow elegant shimmer sweep */
        @keyframes waveRace {
          0%   { stroke-dashoffset:  700; }
          100% { stroke-dashoffset: -700; }
        }
        /* 4) Very slow drift on the wide aura */
        @keyframes waveAura {
          0%,100% { opacity: 0.15; stroke-width: 10; }
          50%      { opacity: 0.28; stroke-width: 15; }
        }
        /* 5) Subtle secondary shimmer in opposite direction */
        @keyframes waveRace2 {
          0%   { stroke-dashoffset: -400; }
          100% { stroke-dashoffset:  400; }
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
          stroke-dasharray: 1400;
          stroke-dashoffset: 1400;
          animation: waveDraw 2.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards;
        }
        .wave-glow {
          opacity: 0;
        }
        .wave-aura {
          opacity: 0;
        }
        .wave-race {
          stroke-dasharray: 130 1270;
          stroke-dashoffset: 700;
          opacity: 0;
        }
        .wave-race2 {
          stroke-dasharray: 60 1340;
          stroke-dashoffset: -400;
          opacity: 0;
        }
        /* Fade in layers after draw completes */
        @keyframes delayFadeIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        .wave-race  { animation: waveRace  3.2s linear 3.1s infinite, delayFadeIn 0.6s ease 3.0s forwards; }
        .wave-race2 { animation: waveRace2 5.5s linear 3.3s infinite, delayFadeIn 0.7s ease 3.2s forwards; }
        .wave-glow  { animation: waveGlow  4.5s ease-in-out 3.1s infinite, delayFadeIn 0.8s ease 3.0s forwards; }
        .wave-aura  { animation: waveAura  6s ease-in-out 3.1s infinite, delayFadeIn 1s ease 3.0s forwards; }

        /* ─── Event card transition (single card auto-flip) ──────────────────────────────── */
        @keyframes fadeSlideOut {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-20px); }
        }
        @keyframes fadeSlideIn {
          0% { opacity: 0; transform: translateX(20px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        .event-card-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          perspective: 1000px;
        }

        .event-card-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 22px;
          overflow: hidden;
          will-change: opacity, transform;
        }

        .event-card-wrapper.active {
          animation: fadeSlideIn 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
          z-index: 1;
        }

        .event-card-wrapper.exit {
          animation: fadeSlideOut 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
          z-index: 0;
        }

        /* Crisp image base — no blur overlay on image */
        .event-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          z-index: 0;
        }
        /* Dark gradient: strong bottom scrim, light top tint */
        .event-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.28) 0%,
            rgba(0,0,0,0.08) 30%,
            rgba(0,0,0,0.55) 65%,
            rgba(0,0,0,0.82) 100%
          );
          z-index: 1;
        }
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
              HERO
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

            {/* ── Hero content ── */}
            <div style={{ position: "relative", zIndex: 2, padding: "40px 20px 62px" }}>

              {/* Row: greeting+name left, logo right — all in one flex row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>

                {/* Left: greeting + name stacked with zero gap */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p style={{
                    fontSize: 10, color: "rgba(255,255,255,0.88)",
                    fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase",
                    textShadow: "0 1px 10px rgba(0,0,0,0.9)",
                    margin: 0, padding: 0, lineHeight: 1,
                  }}>
                    {greeting}
                  </p>
                  <h1 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 32, fontWeight: 300, fontStyle: "italic",
                    color: "#fff", lineHeight: 1,
                    margin: 0, padding: 0,
                    textShadow: "0 2px 16px rgba(0,0,0,0.6)",
                  }}>
                    {guest?.name || "Valued Guest"}
                  </h1>
                </div>

                {/* Logo */}
                <div style={{
                  width: 54, height: 54,
                  background: "rgba(255,255,255,0.18)", backdropFilter: "blur(16px)",
                  border: "1.5px solid rgba(255,255,255,0.32)", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <img src={logo} alt="Logo" style={{
                    width: 36, height: 36, objectFit: "contain",
                    filter: "brightness(0) invert(1)", opacity: 1,
                  }} />
                </div>
              </div>

              {/* Room badge */}
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
                FIX 3: ENHANCED WAVE — 4 layers, taller, more elegant
            ══════════════════════════════════════════ */}
            <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, zIndex: 3, lineHeight: 0 }}>
              <svg
                viewBox="0 0 430 80"
                fill="none"
                preserveAspectRatio="none"
                style={{ width: "100%", height: 80, display: "block" }}
              >
                {/* Cream fill — same undulating path but taller */}
                <path
                  d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44 L430 80 L0 80 Z"
                  fill="#EFE1CF"
                />

                {/* Layer 4 — wide soft aura (bottom-most stroke, subtle) */}
                <path
                  className="wave-aura"
                  d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44"
                  fill="none"
                  stroke="url(#wGrad2)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />

                {/* Layer 1 — base brand line, draws on mount */}
                <path
                  className="wave-base"
                  d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44"
                  fill="none"
                  stroke="url(#wGrad1)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />

                {/* Layer 2 — medium glow, pulses */}
                <path
                  className="wave-glow"
                  d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44"
                  fill="none"
                  stroke="url(#wGrad2)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />

                {/* Layer 3 — bright spark racing along */}
                <path
                  className="wave-race"
                  d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44"
                  fill="none"
                  stroke="url(#wGrad3)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Layer 5 — secondary soft shimmer, opposite direction */}
                <path
                  className="wave-race2"
                  d="M0 28 C50 70, 110 76, 175 50 C225 28, 280 10, 340 42 C375 62, 408 62, 430 44"
                  fill="none"
                  stroke="url(#wGrad2)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <defs>
                  <linearGradient id="wGrad1" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="12%" stopColor="#A4005D" stopOpacity="0.65" />
                    <stop offset="42%" stopColor="#D44F93" />
                    <stop offset="72%" stopColor="#A4005D" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>

                  <linearGradient id="wGrad2" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="18%" stopColor="#A4005D" stopOpacity="0.22" />
                    <stop offset="50%" stopColor="#D44F93" stopOpacity="0.32" />
                    <stop offset="82%" stopColor="#A4005D" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>

                  <linearGradient id="wGrad3" x1="0" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="38%" stopColor="#C44A87" stopOpacity="0.7" />
                    <stop offset="52%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="66%" stopColor="#C44A87" stopOpacity="0.55" />
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
            <div style={{ padding: "16px 20px 0" }}>
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
                UPCOMING EVENTS SECTION — Single card with auto-transition
            ══════════════════════════════════════════ */}
            <div style={{ paddingTop: 16 }}>
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
                  <div style={{ padding: "0 20px", position: "relative" }}>
                    <div
                      className="event-card-container"
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
                            style={{
                              background: bg,
                              boxShadow: "0 10px 40px rgba(0,0,0,0.26)",
                              cursor: "pointer",
                            }}
                          >
                            {/* Clear event image (no blur) */}
                            {ev.image && (
                              <>
                                <img className="event-img" src={ev.image} alt={ev.title || ev.name} />
                                {/* Strong directional scrim for readability */}
                                <div className="event-scrim" />
                              </>
                            )}

                            {/* No-image: subtle noise/pattern overlay for depth */}
                            {!ev.image && (
                              <div style={{
                                position: "absolute", inset: 0, zIndex: 1,
                                background: "radial-gradient(ellipse at 70% 20%, rgba(255,255,255,0.12) 0%, transparent 60%)",
                              }} />
                            )}

                            {/* Card content */}
                            <div style={{
                              position: "relative", zIndex: 2,
                              padding: "14px 16px 16px",
                              height: "100%", display: "flex", flexDirection: "column",
                              justifyContent: "flex-end",
                            }}>

                              {/* ── TOP: tag chip (absolute top-left) ── */}
                              {ev.tag && (
                                <div style={{
                                  position: "absolute", top: 14, left: 16,
                                  fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
                                  textTransform: "uppercase", padding: "4px 10px", borderRadius: 8,
                                  background: "rgba(255,255,255,0.15)",
                                  color: "rgba(255,255,255,0.9)",
                                  border: "1px solid rgba(255,255,255,0.25)",
                                  backdropFilter: "blur(8px)",
                                }}>
                                  {ev.tag}
                                </div>
                              )}

                              {/* ── BOTTOM BLOCK: all details stacked cleanly ── */}
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>

                                {/* Date + Time — single pill */}
                                {(evDate || evTime) && (
                                  <div style={{
                                    display: "inline-flex", alignItems: "center", gap: 6,
                                    background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)",
                                    border: "1px solid rgba(249,168,212,0.25)",
                                    borderRadius: 6, padding: "4px 10px", alignSelf: "flex-start",
                                  }}>
                                    {evDate && (
                                      <span style={{
                                        fontSize: 9, fontWeight: 700, color: "#F9A8D4",
                                        letterSpacing: "0.16em", textTransform: "uppercase",
                                      }}>
                                        {evDate}
                                      </span>
                                    )}
                                    {evDate && evTime && (
                                      <span style={{ fontSize: 8, color: "rgba(249,168,212,0.4)", fontWeight: 300 }}>·</span>
                                    )}
                                    {evTime && (
                                      <span style={{
                                        fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.8)",
                                        letterSpacing: "0.06em",
                                      }}>
                                        {evTime}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Title */}
                                <p style={{
                                  fontFamily: "'Cormorant Garamond', serif",
                                  fontSize: 22, fontWeight: 700, color: "#fff",
                                  lineHeight: 1.1, margin: 0,
                                  textShadow: "0 2px 14px rgba(0,0,0,0.6)",
                                }}>
                                  {ev.title || ev.name}
                                </p>

                                {/* Description — single line only in 16:9 */}
                                {ev.description && (
                                  <p style={{
                                    fontSize: 11.5, color: "rgba(255,255,255,0.72)",
                                    fontWeight: 400, lineHeight: 1.4, margin: 0,
                                    display: "-webkit-box", WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical", overflow: "hidden",
                                    textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                                  }}>
                                    {ev.description}
                                  </p>
                                )}

                                {/* Location row */}
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

                  {/* Dot indicators — clickable to jump to event */}
                  <div style={{ display: "flex", justifyContent: "center", gap: 6, paddingBottom: 4, marginTop: 12 }}>
                    {upcomingEvents.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentEventIndex(i)}
                        style={{
                          width: i === currentEventIndex ? 22 : 6,
                          height: 6,
                          borderRadius: 3,
                          background: i === currentEventIndex ? "#A4005D" : "rgba(164,0,93,0.22)",
                          transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                          cursor: "pointer",
                          border: "none",
                          padding: 0,
                        }}
                      />
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
                  { icon: <EventsIcon />, label: "All Events", route: "/guest/events" },
                  { icon: <AmenitiesIcon />, label: "Amenities", route: "/guest/hotel-info" },
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
        <GuestBottomNav activeNav={"home"} setActiveNav={() => {}} />
      </div>
    </>
  );
}