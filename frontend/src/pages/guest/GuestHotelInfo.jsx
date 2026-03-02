import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GuestHeader from "../../components/guest/GuestHeader";
import GuestLuxuryTheme from "../../components/guest/GuestLuxuryTheme";
import { useGuestAuth } from "../../context/GuestAuthContext";

export default function GuestHotelInfo() {
  const { guest } = useGuestAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("dining");
  const [activeNav, setActiveNav] = useState("home");

  // Nav icons (same as GuestDashboard)
  const HomeNavIcon = ({ active }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
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

  const navItems = [
    { key: "home",    label: "Home",   icon: (a) => <HomeNavIcon active={a} />,    route: "/guest/dashboard" },
    { key: "orders",  label: "Orders", icon: (a) => <OrdersNavIcon active={a} />,  route: "/guest/orders" },
    { key: "support", label: "Chat",   icon: (a) => <SupportNavIcon active={a} />, route: "/guest/support" },
  ];

  const categories = [
    { key: "dining",      label: "Dining",       emoji: "🍽️" },
    { key: "wellness",    label: "Wellness",      emoji: "🧖" },
    { key: "business",    label: "Business",      emoji: "💼" },
    { key: "facilities",  label: "Facilities",    emoji: "🏨" },
    { key: "wifi",        label: "Wi-Fi",         emoji: "📡" },
    { key: "emergency",   label: "Emergency",     emoji: "🚨" },
    { key: "checkout",    label: "Check-out",     emoji: "🔑" },
  ];

  const data = {
    dining: {
      headline: "Culinary Experiences",
      sub: "Four distinctive venues, one unforgettable stay",
      accent: "linear-gradient(135deg,#5c001a 0%,#A4005D 100%)",
      items: [
        {
          name: "Freakk de Bistro",
          icon: "🍸",
          desc: "All-day dining restaurant with eclectic continental & Indian flavours",
          hours: "7:00 AM – 11:00 PM",
          tag: "All-Day Dining",
        },
        {
          name: "Bougainvillea",
          icon: "🌸",
          desc: "Speciality restaurant featuring multi-cuisine gourmet offerings",
          hours: "12:00 PM – 11:30 PM",
          tag: "Speciality",
        },
        {
          name: "Meeting Point",
          icon: "☕",
          desc: "Casual café-lounge for quick bites, beverages & informal meetings",
          hours: "6:00 AM – 10:00 PM",
          tag: "Café Lounge",
        },
        {
          name: "High Steaks Rooftop",
          icon: "🥩",
          desc: "Rooftop bar & grill with panoramic city views and premium steaks",
          hours: "5:00 PM – 1:00 AM",
          tag: "Rooftop Bar",
        },
        {
          name: "In-room Dining",
          icon: "🛎️",
          desc: "24/7 room service delivered right to your door",
          hours: "Available 24/7",
          tag: "Room Service",
        },
      ],
    },
    wellness: {
      headline: "Spa & Recreation",
      sub: "Rejuvenate body, mind and soul",
      accent: "linear-gradient(135deg,#2d1500 0%,#8a5200 100%)",
      items: [
        {
          name: "Swimming Pool",
          icon: "🏊",
          desc: "Temperature-controlled outdoor pool with sun deck and poolside service",
          hours: "6:00 AM – 9:00 PM",
          tag: "Outdoor",
        },
        {
          name: "Spa & Sauna",
          icon: "🧖",
          desc: "Traditional sauna and wellness treatments for complete relaxation",
          hours: "9:00 AM – 9:00 PM",
          tag: "Wellness",
        },
        {
          name: "Gym & Fitness",
          icon: "💪",
          desc: "State-of-the-art equipment including cardio machines, free weights & more",
          hours: "5:30 AM – 10:00 PM",
          tag: "Fitness",
        },
      ],
    },
    business: {
      headline: "Business & Events",
      sub: "World-class MICE facilities in the heart of Nagpur",
      accent: "linear-gradient(135deg,#082036 0%,#1a6a8a 100%)",
      items: [
        {
          name: "Business Centre",
          icon: "💼",
          desc: "Fully equipped with high-speed internet, printing, scanning & secretarial support",
          hours: "8:00 AM – 8:00 PM",
          tag: "Business",
        },
        {
          name: "MICE Facilities",
          icon: "🎤",
          desc: "Banquets & conference rooms: Palacio, Millennium, Sammelan, Grand Millennium, Sapphire",
          hours: "On request",
          tag: "Events",
        },
        {
          name: "Board Room",
          icon: "📋",
          desc: "Private boardroom with AV equipment, ideal for executive meetings",
          hours: "On request",
          tag: "Meeting",
        },
        {
          name: "Concierge Service",
          icon: "🎩",
          desc: "Dedicated concierge for travel arrangements, tickets, tours & more",
          hours: "Available 24/7",
          tag: "Service",
        },
      ],
    },
    facilities: {
      headline: "Hotel Facilities",
      sub: "Every convenience, thoughtfully provided",
      accent: "linear-gradient(135deg,#0e2e0e 0%,#2d6b2d 100%)",
      items: [
        {
          name: "Airport Pickup / Drop",
          icon: "✈️",
          desc: "Complimentary or chargeable airport transfers arranged by our concierge",
          hours: "On request",
          tag: "Transfer",
        },
        {
          name: "Valet Parking",
          icon: "🅿️",
          desc: "Secure valet parking service available for all guests",
          hours: "Available 24/7",
          tag: "Parking",
        },
        {
          name: "Express Laundry",
          icon: "👕",
          desc: "Same-day laundry and dry-cleaning service for your convenience",
          hours: "8:00 AM – 8:00 PM",
          tag: "Laundry",
        },
        {
          name: "Left Luggage Room",
          icon: "🧳",
          desc: "Secure luggage storage available before check-in and after check-out",
          hours: "Available 24/7",
          tag: "Storage",
        },
        {
          name: "Electric Charging Point",
          icon: "⚡",
          desc: "EV charging stations available in the hotel parking area",
          hours: "Available 24/7",
          tag: "EV Friendly",
        },
      ],
    },
    wifi: {
      headline: "Wi-Fi & Connectivity",
      sub: "High-speed internet throughout the hotel",
      accent: "linear-gradient(135deg,#1a1a3e 0%,#4a4a9e 100%)",
      details: [
        { label: "Network Name (SSID)", value: "CentrePoint-Guest", icon: "📶" },
        { label: "Password",            value: "Guest@2024",        icon: "🔐" },
        { label: "Speed",               value: "100 Mbps",          icon: "⚡" },
        { label: "Coverage",            value: "Entire hotel including all rooms", icon: "🏨" },
        { label: "Tech Support",        value: "Dial 0 from room phone",          icon: "📞" },
      ],
    },
    emergency: {
      headline: "Emergency & Safety",
      sub: "We're here for you, every hour of every day",
      accent: "linear-gradient(135deg,#3e0000 0%,#8b0000 100%)",
      details: [
        { label: "Emergency Hotline",  value: "0 (from room phone)", icon: "🆘" },
        { label: "Reception",          value: "Ext. 1",             icon: "🛎️" },
        { label: "Security",           value: "Ext. 2",             icon: "🔒" },
        { label: "Medical Assistance", value: "Ext. 3",             icon: "🏥" },
        { label: "Fire Emergency",     value: "Ext. 4",             icon: "🔥" },
        { label: "In-room Safe",       value: "Available in all rooms", icon: "🗃️" },
        { label: "Direct Hotel Line",  value: "0712-6699000",       icon: "📞" },
      ],
    },
    checkout: {
      headline: "Check-out Information",
      sub: "Seamless departure, lasting memories",
      accent: "linear-gradient(135deg,#1a1200 0%,#6b5200 100%)",
      details: [
        { label: "Check-out Time",    value: "12:00 PM (Noon)",                          icon: "🕛" },
        { label: "Late Check-out",    value: "Available on request (extra charges apply)", icon: "🕑" },
        { label: "Luggage Storage",   value: "Available after check-out",                 icon: "🧳" },
        { label: "Early Check-in",    value: "Subject to room availability",              icon: "🌅" },
        { label: "Return Keys To",    value: "Front Desk",                               icon: "🗝️" },
        { label: "Billing Queries",   value: "Dial 1 or visit Front Desk",               icon: "🧾" },
      ],
    },
  };

  const active = data[activeCategory];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(20px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes pulseDot {
          0%,100% { box-shadow:0 0 0 0 rgba(164,0,93,0.5); }
          50%      { box-shadow:0 0 0 6px rgba(164,0,93,0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(12px); }
          to   { opacity:1; transform:translateX(0); }
        }

        .amenity-card {
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .amenity-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 32px rgba(164,0,93,0.13) !important;
        }

        .cat-pill {
          transition: all 0.22s cubic-bezier(0.22,1,0.36,1);
        }
        .cat-pill:active { transform: scale(0.93); }

        .detail-row {
          animation: slideIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
        }

        .section-heading {
          animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }

        .back-btn {
          transition: transform 0.18s ease, background 0.18s ease;
        }
        .back-btn:hover { background: rgba(164,0,93,0.1) !important; transform: translateX(-2px); }
      `}</style>

      <GuestLuxuryTheme>
        <div style={{
          position: "fixed", inset: 0,
          display: "flex", flexDirection: "column",
          background: "#EFE1CF",
          paddingBottom: "env(safe-area-inset-bottom)",
          fontFamily: "system-ui, sans-serif",
        }}>
        <div style={{
          flex: 1, overflowY: "auto", overflowX: "hidden",
          maxWidth: 430, width: "100%", margin: "0 auto",
          paddingBottom: "80px",
        }}>

          {/* ── HEADER BANNER ── */}
          <div style={{
            background: "linear-gradient(160deg, #0d0008 0%, #3a0020 50%, #0d0008 100%)",
            padding: "44px 20px 56px",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Blobs */}
            <div style={{
              position: "absolute", top: -30, right: -30, width: 160, height: 160,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(164,0,93,0.28), transparent 65%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: -20, left: -20, width: 120, height: 120,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(196,74,135,0.18), transparent 65%)",
              pointerEvents: "none",
            }} />

            {/* Back button */}
            <button
              onClick={() => navigate("/guest/dashboard")}
              className="back-btn"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 20, padding: "6px 14px 6px 10px",
                color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 600,
                letterSpacing: "0.06em", cursor: "pointer", marginBottom: 18,
              }}
            >
              <span style={{ fontSize: 14 }}>‹</span> Back
            </button>

            {/* Title area */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.26em",
                textTransform: "uppercase", color: "rgba(249,168,212,0.8)",
                marginBottom: 6,
              }}>
                Centre Point Nagpur
              </p>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 34, fontWeight: 300, fontStyle: "italic",
                color: "#fff", lineHeight: 1.1, marginBottom: 8,
                textShadow: "0 2px 20px rgba(0,0,0,0.4)",
              }}>
                Hotel Amenities
              </h1>
              <p style={{
                fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 300,
                letterSpacing: "0.04em",
              }}>
                24, Central Bazar Road, Ramdaspeth, Nagpur
              </p>

              {/* Live badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.09)", backdropFilter: "blur(10px)",
                borderRadius: 20, padding: "4px 12px", marginTop: 14,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#86efac",
                  animation: "pulseDot 2.2s ease-in-out infinite", flexShrink: 0,
                }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  ROOM {guest?.roomNumber} · All Services Active
                </span>
              </div>
            </div>

            {/* Wave */}
            <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, lineHeight: 0 }}>
              <svg viewBox="0 0 430 52" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 52, display: "block" }}>
                <path d="M0 18 C60 48, 130 54, 200 32 C250 16, 310 4, 370 28 C398 40, 418 40, 430 28 L430 52 L0 52 Z" fill="#EFE1CF" />
              </svg>
            </div>
          </div>

          {/* ── CATEGORY PILLS ── */}
          <div style={{ padding: "20px 16px 0", overflowX: "auto" }}>
            <div style={{ display: "flex", gap: 8, paddingBottom: 4, width: "max-content" }}>
              {categories.map((cat) => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    className="cat-pill"
                    onClick={() => setActiveCategory(cat.key)}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "8px 14px",
                      borderRadius: 24,
                      background: isActive ? "#A4005D" : "#fff",
                      border: isActive ? "none" : "1px solid rgba(164,0,93,0.12)",
                      color: isActive ? "#fff" : "#6B6B6B",
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                      boxShadow: isActive ? "0 4px 16px rgba(164,0,93,0.28)" : "0 1px 6px rgba(30,21,16,0.06)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>{cat.emoji}</span>
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── SECTION CONTENT ── */}
          <div style={{ padding: "20px 16px" }}>

            {/* Section heading */}
            <div className="section-heading" style={{ marginBottom: 16 }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 26, fontWeight: 600, color: "#1F1F1F",
                lineHeight: 1.1, marginBottom: 4,
              }}>
                {active.headline}
              </h2>
              <p style={{ fontSize: 11, color: "#6B6B6B", fontWeight: 300 }}>
                {active.sub}
              </p>
              {/* Accent line */}
              <div style={{
                marginTop: 10,
                width: 40, height: 2,
                background: active.accent,
                borderRadius: 2,
              }} />
            </div>

            {/* CARD LIST (dining, wellness, business, facilities) */}
            {active.items && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {active.items.map((item, i) => (
                  <div
                    key={item.name}
                    className="amenity-card"
                    style={{
                      background: "#fff",
                      borderRadius: 18,
                      border: "1px solid rgba(164,0,93,0.07)",
                      boxShadow: "0 2px 14px rgba(30,21,16,0.05)",
                      padding: "16px",
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      position: "relative",
                      overflow: "hidden",
                      animationDelay: `${i * 60}ms`,
                    }}
                  >
                    {/* Top accent stripe */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 3,
                      borderRadius: "18px 18px 0 0",
                      background: active.accent,
                      opacity: 0.6,
                    }} />

                    {/* Icon bubble */}
                    <div style={{
                      width: 48, height: 48, flexShrink: 0,
                      borderRadius: 14,
                      background: "#F6EADB",
                      border: "1.5px solid rgba(164,0,93,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22,
                    }}>
                      {item.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <p style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 17, fontWeight: 600, color: "#1F1F1F",
                          lineHeight: 1.1,
                        }}>
                          {item.name}
                        </p>
                        {item.tag && (
                          <span style={{
                            fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            background: "rgba(164,0,93,0.08)",
                            color: "#A4005D",
                            border: "1px solid rgba(164,0,93,0.12)",
                            borderRadius: 6, padding: "2px 8px",
                          }}>
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 11.5, color: "#6B6B6B", fontWeight: 300, lineHeight: 1.45, marginBottom: 8 }}>
                        {item.desc}
                      </p>
                      {/* Hours pill */}
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        background: "#F6EADB",
                        borderRadius: 8, padding: "4px 10px",
                      }}>
                        <span style={{ fontSize: 10 }}>⏰</span>
                        <span style={{ fontSize: 10, color: "#A4005D", fontWeight: 600, letterSpacing: "0.04em" }}>
                          {item.hours}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DETAIL LIST (wifi, emergency, checkout) */}
            {active.details && (
              <div style={{
                background: "#fff",
                borderRadius: 20,
                border: "1px solid rgba(164,0,93,0.07)",
                boxShadow: "0 2px 16px rgba(30,21,16,0.05)",
                overflow: "hidden",
              }}>
                {/* Top accent bar */}
                <div style={{ height: 4, background: active.accent }} />

                <div style={{ padding: "4px 0" }}>
                  {active.details.map((detail, i) => (
                    <div
                      key={detail.label}
                      className="detail-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 18px",
                        borderBottom: i < active.details.length - 1
                          ? "1px solid rgba(164,0,93,0.06)"
                          : "none",
                        animationDelay: `${i * 50}ms`,
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: 36, height: 36, flexShrink: 0,
                        borderRadius: 10,
                        background: "#F6EADB",
                        border: "1px solid rgba(164,0,93,0.09)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16,
                      }}>
                        {detail.icon}
                      </div>

                      {/* Label */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 10, color: "#9B8B80", fontWeight: 500, letterSpacing: "0.04em", marginBottom: 2 }}>
                          {detail.label}
                        </p>
                        <p style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 15, fontWeight: 600, color: "#1F1F1F",
                          lineHeight: 1.2,
                        }}>
                          {detail.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── DIVIDER ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 20px 20px" }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
            <div style={{ width: 5, height: 5, background: "rgba(164,0,93,0.3)", transform: "rotate(45deg)", flexShrink: 0 }} />
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
          </div>

          {/* ── CONTACT CARD ── */}
          <div style={{ padding: "0 16px 24px" }}>
            <div style={{
              background: "linear-gradient(135deg, #1a0010 0%, #3a0020 100%)",
              borderRadius: 20,
              padding: "20px 20px",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -20, right: -20, width: 100, height: 100,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(164,0,93,0.3), transparent 65%)",
              }} />
              <p style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "rgba(249,168,212,0.7)", marginBottom: 4,
              }}>
                Need Help?
              </p>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 20, fontWeight: 300, fontStyle: "italic",
                color: "#fff", marginBottom: 12,
              }}>
                We're always here for you
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { icon: "📞", label: "+91 9266923456" },
                  { icon: "📞", label: "0712-6699000" },
                  { icon: "✉️", label: "info.nagpur@cpgh.in" },
                ].map((c) => (
                  <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13 }}>{c.icon}</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
        </div>

        {/* ── BOTTOM NAV (matches GuestDashboard exactly) ── */}
        <div style={{
          flexShrink: 0,
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(164,0,93,0.1)",
          boxShadow: "0 -2px 20px rgba(30,21,16,0.07)",
          maxWidth: 430, width: "100%", margin: "0 auto",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", padding: "6px 8px" }}>
            {navItems.map((item) => {
              const isActive = activeNav === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => { setActiveNav(item.key); navigate(item.route); }}
                  style={{
                    position: "relative",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    padding: "6px 24px", borderRadius: 14,
                    background: isActive ? "rgba(164,0,93,0.07)" : "transparent",
                    border: "none", cursor: "pointer",
                    transition: "background 0.2s ease, transform 0.15s ease",
                  }}
                >
                  <span style={{ color: isActive ? "#A4005D" : "#6B6B6B", transition: "color 0.2s ease" }}>
                    {item.icon(isActive)}
                  </span>
                  <span style={{
                    fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                    color: isActive ? "#A4005D" : "#6B6B6B", transition: "color 0.2s ease",
                  }}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div style={{
                      position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)",
                      width: 4, height: 4, borderRadius: "50%", background: "#A4005D",
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </GuestLuxuryTheme>
    </>
  );
}