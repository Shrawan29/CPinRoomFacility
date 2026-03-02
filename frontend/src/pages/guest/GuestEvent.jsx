import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import { getGuestEvents } from "../../services/event.service";

const formatDate = (dateString) => {
  try {
    const d = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
  } catch { return ""; }
};

const statusConfig = {
  ACTIVE:    { bg: "rgba(34,197,94,0.1)",   text: "#065f46", dot: "#22c55e"  },
  UPCOMING:  { bg: "rgba(59,130,246,0.1)",  text: "#1e40af", dot: "#3b82f6"  },
  DEFAULT:   { bg: "rgba(107,114,128,0.1)", text: "#374151", dot: "#9ca3af"  },
};

const eventGradients = [
  "linear-gradient(160deg,#2d0840 0%,#7B2D8B 100%)",
  "linear-gradient(160deg,#5c001a 0%,#A4005D 100%)",
  "linear-gradient(160deg,#082036 0%,#1a6a8a 100%)",
  "linear-gradient(160deg,#2d1500 0%,#8a5200 100%)",
  "linear-gradient(160deg,#0e2e0e 0%,#2d6b2d 100%)",
];

export default function GuestEvents() {
  const { guest } = useGuestAuth();
  const navigate = useNavigate();

  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [fadeIn, setFadeIn]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await getGuestEvents();
        setEvents(data || []);
      } catch {
        setError("Unable to load events");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const navItems = [
    {
      key: "home", label: "Home", route: "/guest/dashboard",
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
      ),
    },
    {
      key: "hotel", label: "Hotel Info", route: "/guest/hotel-info",
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
          <path d="M3 21h18" />
          <path d="M6 21V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14" />
          <path d="M10 7h4" />
          <path d="M10 11h4" /><path d="M10 15h4" />
        </svg>
      ),
    },
    {
      key: "orders", label: "Orders", route: "/guest/orders",
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6" /><path d="M9 16h4" />
        </svg>
      ),
    },
    {
      key: "support", label: "Chat", route: "/guest/support",
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <circle cx="12" cy="17" r=".5" fill="currentColor" />
        </svg>
      ),
    },
  ];

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

        .event-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(164,0,93,0.07);
          box-shadow: 0 2px 14px rgba(164,0,93,0.06);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .event-card:active {
          transform: scale(0.985);
        }

        .nav-btn { transition: background 0.2s ease, transform 0.15s ease; }
        .nav-btn:active { transform: scale(0.93); }
      `}</style>

      {/* ══ ROOT ══ */}
      <div style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        background: "#EFE1CF",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>

        {/* ① HEADER */}
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

            <div style={{ flex: 1, textAlign: "center" }}>
              <p style={{
                fontSize: 9, color: "#6B6B6B", fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase",
                margin: "0 0 1px 0",
              }}>What's On</p>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22, fontWeight: 600, fontStyle: "italic",
                color: "#1F1F1F", margin: 0, lineHeight: 1,
              }}>Hotel Events</h1>
            </div>

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

        {/* ② SCROLLABLE BODY */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", background: "#EFE1CF" }}>
          <div style={{ maxWidth: 430, margin: "0 auto", padding: "16px 20px 24px" }}>

            {/* Section label + count */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14,
            }}>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "#6B6B6B", margin: 0,
              }}>Upcoming Events</p>
              {!loading && events.length > 0 && (
                <span style={{
                  fontSize: 10, color: "rgba(164,0,93,0.6)", fontWeight: 600,
                  background: "rgba(164,0,93,0.07)", padding: "3px 10px", borderRadius: 20,
                }}>{events.length} events</span>
              )}
            </div>

            {/* LOADING SKELETONS */}
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[1, 2, 3].map((n) => (
                  <div key={n} style={{
                    background: "rgba(255,255,255,0.6)", borderRadius: 20,
                    border: "1px solid rgba(164,0,93,0.06)",
                    overflow: "hidden",
                    animation: `fadeUp 0.4s ease ${n * 80}ms both`,
                  }}>
                    {/* Image placeholder */}
                    <div style={{
                      width: "100%", aspectRatio: "16/9",
                      background: "linear-gradient(135deg, rgba(164,0,93,0.06), rgba(164,0,93,0.03))",
                    }} />
                    <div style={{ padding: 16 }}>
                      <div style={{ height: 14, width: "60%", borderRadius: 6, background: "rgba(164,0,93,0.08)", marginBottom: 8 }} />
                      <div style={{ height: 10, width: "40%", borderRadius: 6, background: "rgba(0,0,0,0.05)", marginBottom: 6 }} />
                      <div style={{ height: 10, width: "50%", borderRadius: 6, background: "rgba(0,0,0,0.04)" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div style={{
                background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 14, padding: "12px 14px",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <p style={{ fontSize: 12, color: "#b91c1c", margin: 0 }}>{error}</p>
              </div>
            )}

            {/* EMPTY */}
            {!loading && !error && events.length === 0 && (
              <div style={{
                background: "#fff", borderRadius: 18, padding: "32px 20px", textAlign: "center",
                border: "1px solid rgba(164,0,93,0.07)",
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "rgba(164,0,93,0.08)", margin: "0 auto 14px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22,
                }}>🎉</div>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#6B6B6B",
                  fontStyle: "italic", margin: 0,
                }}>No upcoming events</p>
                <p style={{ fontSize: 11, color: "#aaa", marginTop: 4, marginBottom: 0 }}>
                  Check back soon for hotel events
                </p>
              </div>
            )}

            {/* EVENTS LIST */}
            {!loading && events.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {events.map((event, i) => {
                  const sc = statusConfig[event.status] || statusConfig.DEFAULT;
                  const evDate = formatDate(event.eventDate);
                  const bg = event.gradient || eventGradients[i % eventGradients.length];

                  return (
                    <div
                      key={event._id}
                      className="event-card"
                      onClick={() => navigate(`/guest/events/${event._id}`)}
                      style={{ animation: `fadeUp 0.45s ease ${Math.min(i, 5) * 70}ms both` }}
                    >
                      {/* IMAGE / GRADIENT BANNER */}
                      <div style={{
                        width: "100%", aspectRatio: "16/9",
                        position: "relative", overflow: "hidden",
                        background: bg,
                      }}>
                        {event.image && (
                          <>
                            <img
                              src={event.image}
                              alt={event.title}
                              loading="lazy"
                              style={{
                                position: "absolute", inset: 0,
                                width: "100%", height: "100%",
                                objectFit: "cover", objectPosition: "center",
                              }}
                            />
                            {/* scrim */}
                            <div style={{
                              position: "absolute", inset: 0,
                              background: "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.5) 100%)",
                            }} />
                          </>
                        )}

                        {/* No image: decorative glow */}
                        {!event.image && (
                          <div style={{
                            position: "absolute", inset: 0,
                            background: "radial-gradient(ellipse at 70% 20%, rgba(255,255,255,0.12) 0%, transparent 60%)",
                          }} />
                        )}

                        {/* Status chip — top right */}
                        <div style={{
                          position: "absolute", top: 12, right: 12,
                          display: "inline-flex", alignItems: "center", gap: 5,
                          background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)",
                          borderRadius: 20, padding: "4px 10px",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}>
                          <div style={{
                            width: 5, height: 5, borderRadius: "50%",
                            background: sc.dot, flexShrink: 0,
                          }} />
                          <span style={{
                            fontSize: 9, fontWeight: 700, color: "#fff",
                            letterSpacing: "0.12em", textTransform: "uppercase",
                          }}>{event.status || "EVENT"}</span>
                        </div>

                        {/* Date + time chip — bottom left */}
                        {(evDate || event.eventTime) && (
                          <div style={{
                            position: "absolute", bottom: 12, left: 12,
                            display: "inline-flex", alignItems: "center", gap: 6,
                            background: "rgba(0,0,0,0.38)", backdropFilter: "blur(8px)",
                            borderRadius: 8, padding: "5px 10px",
                            border: "1px solid rgba(249,168,212,0.22)",
                          }}>
                            {evDate && (
                              <span style={{
                                fontSize: 9, fontWeight: 700, color: "#F9A8D4",
                                letterSpacing: "0.14em", textTransform: "uppercase",
                              }}>{evDate}</span>
                            )}
                            {evDate && event.eventTime && (
                              <span style={{ fontSize: 8, color: "rgba(249,168,212,0.4)" }}>·</span>
                            )}
                            {event.eventTime && (
                              <span style={{
                                fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.85)",
                              }}>{event.eventTime}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* CARD BODY */}
                      <div style={{ padding: "14px 16px 16px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                          <h2 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 19, fontWeight: 700, color: "#1F1F1F",
                            margin: 0, lineHeight: 1.2, flex: 1,
                          }}>{event.title}</h2>
                        </div>

                        {event.description && (
                          <p style={{
                            fontSize: 12, color: "#7a6a60", fontWeight: 300,
                            margin: "6px 0 0 0", lineHeight: 1.5,
                            display: "-webkit-box", WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical", overflow: "hidden",
                          }}>{event.description}</p>
                        )}

                        {/* Location row */}
                        {(event.location || event.venue) && (
                          <div style={{
                            display: "flex", alignItems: "center", gap: 6,
                            marginTop: 10,
                          }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#A4005D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12, flexShrink: 0, opacity: 0.7 }}>
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span style={{
                              fontSize: 11, color: "#6B6B6B", fontWeight: 400,
                            }}>{event.location || event.venue}</span>
                          </div>
                        )}

                        {/* View details CTA */}
                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "flex-end",
                          marginTop: 12, paddingTop: 10,
                          borderTop: "1px solid rgba(164,0,93,0.07)",
                        }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, color: "#A4005D",
                            letterSpacing: "0.06em", textTransform: "uppercase",
                            display: "flex", alignItems: "center", gap: 4,
                          }}>
                            View Details
                            <svg viewBox="0 0 24 24" fill="none" stroke="#A4005D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}>
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
        {/* end scrollable body */}

        {/* ③ BOTTOM NAV */}
        <div style={{
          flexShrink: 0,
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(164,0,93,0.1)",
          boxShadow: "0 -2px 20px rgba(30,21,16,0.07)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-around",
            padding: "6px 8px", maxWidth: 430, margin: "0 auto",
          }}>
            {navItems.map((item) => {
              const isActive = item.key === "home";
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.route)}
                  className="nav-btn"
                  style={{
                    position: "relative",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    padding: "6px 18px", borderRadius: 14,
                    background: isActive ? "rgba(164,0,93,0.07)" : "transparent",
                    border: "none", cursor: "pointer",
                  }}
                >
                  <span style={{ color: isActive ? "#A4005D" : "#6B6B6B", transition: "color 0.2s ease" }}>
                    {item.icon(isActive)}
                  </span>
                  <span style={{
                    fontSize: 7, fontWeight: 700, letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: isActive ? "#A4005D" : "#6B6B6B",
                    transition: "color 0.2s ease",
                  }}>{item.label}</span>
                  {isActive && (
                    <div style={{
                      position: "absolute", bottom: -1, left: "50%",
                      transform: "translateX(-50%)",
                      width: 4, height: 4, borderRadius: "50%", background: "#A4005D",
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