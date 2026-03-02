import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import GuestBottomNav from "../../components/guest/GuestBottomNav";

export default function GuestHotelInfo() {
  const { guest } = useGuestAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("dining");
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  // ── Category tabs ──────────────────────────────────────────────────────
  const categories = [
    { key: "dining",     label: "Dining",     emoji: "🍽️" },
    { key: "wellness",   label: "Wellness",   emoji: "🧖" },
    { key: "business",   label: "Business",   emoji: "💼" },
    { key: "facilities", label: "Facilities", emoji: "🏨" },
    { key: "wifi",       label: "Wi-Fi",      emoji: "📡" },
    { key: "emergency",  label: "Emergency",  emoji: "🚨" },
    { key: "checkout",   label: "Check-out",  emoji: "🔑" },
  ];

  // ── All content data ───────────────────────────────────────────────────
  const data = {
    dining: {
      headline: "Culinary Experiences",
      sub: "Four distinctive venues, one unforgettable stay",
      accent: "linear-gradient(135deg,#5c001a 0%,#A4005D 100%)",
      items: [
        { name: "Freakk de Bistro",   icon: "🍸", desc: "All-day dining with eclectic continental & Indian flavours",        hours: "7:00 AM – 11:00 PM",  tag: "All-Day Dining" },
        { name: "Bougainvillea",       icon: "🌸", desc: "Speciality restaurant featuring multi-cuisine gourmet offerings",   hours: "12:00 PM – 11:30 PM", tag: "Speciality"     },
        { name: "Meeting Point",       icon: "☕", desc: "Casual café-lounge for quick bites, beverages & informal meetings", hours: "6:00 AM – 10:00 PM",  tag: "Café Lounge"    },
        { name: "High Steaks Rooftop", icon: "🥩", desc: "Rooftop bar & grill with panoramic city views and premium steaks", hours: "5:00 PM – 1:00 AM",   tag: "Rooftop Bar"    },
        { name: "In-room Dining",      icon: "🛎️", desc: "24/7 room service delivered directly to your door",               hours: "Available 24/7",       tag: "Room Service"   },
      ],
    },
    wellness: {
      headline: "Spa & Recreation",
      sub: "Rejuvenate body, mind and soul",
      accent: "linear-gradient(135deg,#2d1500 0%,#8a5200 100%)",
      items: [
        { name: "Swimming Pool", icon: "🏊", desc: "Temperature-controlled outdoor pool with sun deck and poolside service", hours: "6:00 AM – 9:00 PM",  tag: "Outdoor"  },
        { name: "Spa & Sauna",   icon: "🧖", desc: "Traditional sauna and wellness treatments for complete relaxation",      hours: "9:00 AM – 9:00 PM",  tag: "Wellness" },
        { name: "Gym & Fitness", icon: "💪", desc: "State-of-the-art cardio machines, free weights & more",                 hours: "5:30 AM – 10:00 PM", tag: "Fitness"  },
      ],
    },
    business: {
      headline: "Business & Events",
      sub: "World-class MICE facilities in the heart of Nagpur",
      accent: "linear-gradient(135deg,#082036 0%,#1a6a8a 100%)",
      items: [
        { name: "Business Centre",   icon: "💼", desc: "High-speed internet, printing, scanning & secretarial support",                          hours: "8:00 AM – 8:00 PM", tag: "Business" },
        { name: "MICE Facilities",   icon: "🎤", desc: "Banquets & conference halls: Palacio, Millennium, Sammelan, Grand Millennium, Sapphire",  hours: "On request",         tag: "Events"   },
        { name: "Board Room",        icon: "📋", desc: "Private boardroom with AV equipment, ideal for executive meetings",                       hours: "On request",         tag: "Meeting"  },
        { name: "Concierge Service", icon: "🎩", desc: "Dedicated concierge for travel arrangements, tickets, tours & more",                      hours: "Available 24/7",     tag: "Service"  },
      ],
    },
    facilities: {
      headline: "Hotel Facilities",
      sub: "Every convenience, thoughtfully provided",
      accent: "linear-gradient(135deg,#0e2e0e 0%,#2d6b2d 100%)",
      items: [
        { name: "Airport Pickup / Drop",   icon: "✈️", desc: "Complimentary or chargeable airport transfers arranged by concierge", hours: "On request",         tag: "Transfer"    },
        { name: "Valet Parking",           icon: "🅿️", desc: "Secure valet parking service available for all guests",               hours: "Available 24/7",     tag: "Parking"     },
        { name: "Express Laundry",         icon: "👕", desc: "Same-day laundry and dry-cleaning service for your convenience",       hours: "8:00 AM – 8:00 PM", tag: "Laundry"     },
        { name: "Left Luggage Room",       icon: "🧳", desc: "Secure luggage storage before check-in and after check-out",           hours: "Available 24/7",     tag: "Storage"     },
        { name: "Electric Charging Point", icon: "⚡", desc: "EV charging stations available in the hotel parking area",             hours: "Available 24/7",     tag: "EV Friendly" },
      ],
    },
    wifi: {
      headline: "Wi-Fi & Connectivity",
      sub: "High-speed internet throughout the hotel",
      accent: "linear-gradient(135deg,#1a1a3e 0%,#4a4a9e 100%)",
      details: [
        { label: "Network Name (SSID)", value: "CentrePoint-Guest",               icon: "📶" },
        { label: "Password",            value: "Guest@2024",                      icon: "🔐" },
        { label: "Speed",               value: "100 Mbps",                        icon: "⚡" },
        { label: "Coverage",            value: "Entire hotel including all rooms", icon: "🏨" },
        { label: "Tech Support",        value: "Dial 0 from room phone",          icon: "📞" },
      ],
    },
    emergency: {
      headline: "Emergency & Safety",
      sub: "We're here for you, every hour of every day",
      accent: "linear-gradient(135deg,#3e0000 0%,#8b0000 100%)",
      details: [
        { label: "Emergency Hotline",  value: "0 (from room phone)",    icon: "🆘" },
        { label: "Reception",          value: "Ext. 1",                 icon: "🛎️" },
        { label: "Security",           value: "Ext. 2",                 icon: "🔒" },
        { label: "Medical Assistance", value: "Ext. 3",                 icon: "🏥" },
        { label: "Fire Emergency",     value: "Ext. 4",                 icon: "🔥" },
        { label: "In-room Safe",       value: "Available in all rooms", icon: "🗃️" },
        { label: "Direct Hotel Line",  value: "0712-6699000",           icon: "📞" },
      ],
    },
    checkout: {
      headline: "Check-out Information",
      sub: "Seamless departure, lasting memories",
      accent: "linear-gradient(135deg,#1a1200 0%,#6b5200 100%)",
      details: [
        { label: "Check-out Time",  value: "12:00 PM (Noon)",                           icon: "🕛" },
        { label: "Late Check-out",  value: "Available on request (extra charges apply)", icon: "🕑" },
        { label: "Luggage Storage", value: "Available after check-out",                  icon: "🧳" },
        { label: "Early Check-in",  value: "Subject to room availability",               icon: "🌅" },
        { label: "Return Keys To",  value: "Front Desk",                                 icon: "🗝️" },
        { label: "Billing Queries", value: "Dial 1 or visit Front Desk",                icon: "🧾" },
      ],
    },
  };

  const active = data[activeCategory];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&display=swap');

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulseDot {
          0%,100% { box-shadow:0 0 0 0 rgba(164,0,93,0.5); }
          50%      { box-shadow:0 0 0 5px rgba(164,0,93,0); }
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(16px) scale(0.98); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(10px); }
          to   { opacity:1; transform:translateX(0); }
        }

        .amenity-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(164,0,93,0.07);
          box-shadow: 0 2px 14px rgba(164,0,93,0.06);
          overflow: hidden;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .amenity-card:active { transform: scale(0.98); }

        .cat-pill {
          transition: all 0.22s cubic-bezier(0.22,1,0.36,1);
          flex-shrink: 0;
          white-space: nowrap;
          cursor: pointer;
          border: none;
          outline: none;
        }
        .cat-pill:active { transform: scale(0.93); }



        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        .detail-row { animation: slideIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* ══ ROOT: fixed full-screen flex column (identical pattern to MenuBrowse) ══ */}
      <div style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        background: "#EFE1CF",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>

        {/* ① HEADER — flexShrink:0 */}
        <div style={{
          flexShrink: 0,
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(164,0,93,0.1)",
          boxShadow: "0 2px 12px rgba(30,21,16,0.06)",
        }}>
          <div style={{
            display: "flex", alignItems: "center",
            padding: "12px 16px", gap: 12,
            maxWidth: 430, margin: "0 auto",
          }}>
            {/* Back button */}
            <button
              onClick={() => navigate("/guest/dashboard")}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(164,0,93,0.07)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#A4005D", fontSize: 18, flexShrink: 0,
              }}
            >←</button>

            {/* Title */}
            <div style={{ flex: 1, textAlign: "center" }}>
              <p style={{
                fontSize: 9, color: "#6B6B6B", fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase",
                margin: "0 0 1px 0",
              }}>Centre Point Nagpur</p>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22, fontWeight: 600, fontStyle: "italic",
                color: "#1F1F1F", margin: 0, lineHeight: 1,
              }}>Hotel Amenities</h1>
            </div>

            {/* Room badge */}
            {guest?.roomNumber ? (
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(164,0,93,0.07)", borderRadius: 20,
                padding: "5px 10px", flexShrink: 0,
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: "#86efac", flexShrink: 0,
                  animation: "pulseDot 2.2s ease-in-out infinite",
                }} />
                <span style={{
                  fontSize: 9, fontWeight: 700, color: "#A4005D",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                }}>{guest.roomNumber}</span>
              </div>
            ) : (
              <div style={{ width: 36 }} />
            )}
          </div>
        </div>

        {/* ② SCROLLABLE BODY — flex:1, overflows */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", background: "#EFE1CF" }}>
          <div style={{ maxWidth: 430, margin: "0 auto", paddingBottom: 24 }}>

            {/* CATEGORY SCROLL PILLS */}
            <div style={{ paddingTop: 14 }}>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "#6B6B6B",
                marginBottom: 10, paddingLeft: 20,
              }}>Categories</p>
              <div
                className="cat-scroll"
                style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 20px 10px" }}
              >
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      className="cat-pill"
                      onClick={() => setActiveCategory(cat.key)}
                      style={{
                        padding: "8px 14px", borderRadius: 50,
                        background: isActive ? "linear-gradient(90deg,#A4005D,#C44A87)" : "#fff",
                        color: isActive ? "#fff" : "#6B6B6B",
                        fontSize: 12, fontWeight: isActive ? 700 : 500,
                        border: isActive ? "none" : "1px solid rgba(164,0,93,0.12)",
                        boxShadow: isActive
                          ? "0 4px 14px rgba(164,0,93,0.28)"
                          : "0 1px 6px rgba(0,0,0,0.05)",
                      }}
                    >
                      <span style={{ marginRight: 4, fontSize: 11 }}>{cat.emoji}</span>
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DIVIDER */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
              <div style={{ width: 5, height: 5, background: "rgba(164,0,93,0.3)", transform: "rotate(45deg)", flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
            </div>

            {/* SECTION CONTENT */}
            <div style={{ padding: "16px 20px 0" }}>

              {/* Section heading */}
              <div style={{ marginBottom: 16, animation: "fadeUp 0.45s ease both" }}>
                <p style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "#6B6B6B", margin: "0 0 2px 0",
                }}>
                  {categories.find(c => c.key === activeCategory)?.label}
                </p>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 24, fontWeight: 600, color: "#1F1F1F",
                  lineHeight: 1.1, margin: "0 0 4px 0",
                }}>
                  {active.headline}
                </h2>
                <p style={{ fontSize: 11, color: "#6B6B6B", fontWeight: 300, margin: 0 }}>
                  {active.sub}
                </p>
                <div style={{ marginTop: 10, width: 36, height: 3, background: active.accent, borderRadius: 2 }} />
              </div>

              {/* CARD LIST — dining / wellness / business / facilities */}
              {active.items && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {active.items.map((item, i) => (
                    <div
                      key={item.name}
                      className="amenity-card"
                      style={{ animation: `cardIn 0.45s cubic-bezier(0.22,1,0.36,1) ${i * 55}ms both` }}
                    >
                      {/* Top accent stripe */}
                      <div style={{ height: 3, background: active.accent }} />

                      <div style={{ padding: "14px 16px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                        {/* Icon bubble */}
                        <div style={{
                          width: 46, height: 46, flexShrink: 0, borderRadius: 13,
                          background: "#F6EADB", border: "1.5px solid rgba(164,0,93,0.1)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 22,
                        }}>
                          {item.icon}
                        </div>

                        {/* Text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 4 }}>
                            <p style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: 17, fontWeight: 600, color: "#1F1F1F",
                              margin: 0, lineHeight: 1.1,
                            }}>{item.name}</p>
                            {item.tag && (
                              <span style={{
                                fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                background: "rgba(164,0,93,0.08)", color: "#A4005D",
                                border: "1px solid rgba(164,0,93,0.12)",
                                borderRadius: 6, padding: "2px 8px",
                              }}>{item.tag}</span>
                            )}
                          </div>
                          <p style={{
                            fontSize: 11.5, color: "#7a6a60", fontWeight: 300,
                            lineHeight: 1.45, margin: "0 0 8px 0",
                            display: "-webkit-box", WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical", overflow: "hidden",
                          }}>{item.desc}</p>
                          {/* Hours pill */}
                          <div style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            background: "#F6EADB", borderRadius: 8, padding: "4px 10px",
                          }}>
                            <span style={{ fontSize: 10 }}>⏰</span>
                            <span style={{ fontSize: 10, color: "#A4005D", fontWeight: 600, letterSpacing: "0.04em" }}>
                              {item.hours}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* DETAIL LIST — wifi / emergency / checkout */}
              {active.details && (
                <div style={{
                  background: "#fff", borderRadius: 20,
                  border: "1px solid rgba(164,0,93,0.07)",
                  boxShadow: "0 2px 16px rgba(30,21,16,0.05)",
                  overflow: "hidden",
                }}>
                  <div style={{ height: 4, background: active.accent }} />
                  <div style={{ padding: "4px 0" }}>
                    {active.details.map((detail, i) => (
                      <div
                        key={detail.label}
                        className="detail-row"
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "14px 18px",
                          borderBottom: i < active.details.length - 1
                            ? "1px solid rgba(164,0,93,0.06)" : "none",
                          animationDelay: `${i * 50}ms`,
                        }}
                      >
                        <div style={{
                          width: 36, height: 36, flexShrink: 0, borderRadius: 10,
                          background: "#F6EADB", border: "1px solid rgba(164,0,93,0.09)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 16,
                        }}>{detail.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: 10, color: "#9B8B80", fontWeight: 500,
                            letterSpacing: "0.04em", margin: "0 0 2px 0",
                          }}>{detail.label}</p>
                          <p style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 15, fontWeight: 600, color: "#1F1F1F",
                            margin: 0, lineHeight: 1.2,
                          }}>{detail.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DIVIDER */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
              <div style={{ width: 5, height: 5, background: "rgba(164,0,93,0.3)", transform: "rotate(45deg)", flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
            </div>

            {/* CONTACT CARD */}
            <div style={{ padding: "20px 20px 4px" }}>
              <div style={{
                background: "linear-gradient(135deg, #1a0010 0%, #3a0020 100%)",
                borderRadius: 20, padding: "20px",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: -20, right: -20, width: 100, height: 100,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(164,0,93,0.3), transparent 65%)",
                  pointerEvents: "none",
                }} />
                <p style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
                  textTransform: "uppercase", color: "rgba(249,168,212,0.7)",
                  margin: "0 0 4px 0",
                }}>Need Help?</p>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 20, fontWeight: 300, fontStyle: "italic",
                  color: "#fff", margin: "0 0 12px 0",
                }}>We're always here for you</h3>
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
        {/* end scrollable body */}

        <GuestBottomNav />

      </div>
    </>
  );
}