import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import { getGuestEventById } from "../../services/event.service";
import { normalizeExternalUrl } from "../../services/url.util";
import GuestBottomNav from "../../components/guest/GuestBottomNav";

const formatDate = (dateString) => {
  try {
    const d = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return d.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  } catch { return ""; }
};

const statusConfig = {
  ACTIVE:   { bg: "rgba(34,197,94,0.1)",  text: "#065f46", dot: "#22c55e" },
  UPCOMING: { bg: "rgba(59,130,246,0.1)", text: "#1e40af", dot: "#3b82f6" },
  DEFAULT:  { bg: "rgba(107,114,128,0.1)",text: "#374151", dot: "#9ca3af" },
};

const eventGradients = [
  "linear-gradient(160deg,#2d0840 0%,#7B2D8B 100%)",
  "linear-gradient(160deg,#5c001a 0%,#A4005D 100%)",
  "linear-gradient(160deg,#082036 0%,#1a6a8a 100%)",
  "linear-gradient(160deg,#2d1500 0%,#8a5200 100%)",
  "linear-gradient(160deg,#0e2e0e 0%,#2d6b2d 100%)",
];

export default function GuestEventDetails() {
  const { id } = useParams();
  const { guest } = useGuestAuth();
  const navigate = useNavigate();

  const [event, setEvent]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
  const [fadeIn, setFadeIn] = useState(false);
  const [imgError, setImgError] = useState(false);

  const eventId = useMemo(() => String(id || ""), [id]);

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!eventId) { setLoading(false); setError("Invalid event"); return; }
    (async () => {
      setLoading(true); setError("");
      try {
        const data = await getGuestEventById(eventId);
        setEvent(data);
      } catch (e) {
        setError(e?.response?.data?.message || "Unable to load event details");
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  const sc = statusConfig[event?.status] || statusConfig.DEFAULT;
  const evDate = event ? formatDate(event.eventDate) : "";
  const heroBg = event?.gradient || eventGradients[0];

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



        .info-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(164,0,93,0.07);
          box-shadow: 0 2px 10px rgba(164,0,93,0.04);
        }

        .link-btn {
          transition: opacity 0.2s ease, transform 0.15s ease;
        }
        .link-btn:active { transform: scale(0.97); }
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
            padding: "12px 16px 100px", gap: 12,
            maxWidth: 430, margin: "0 auto",
          }}>
            <button
              onClick={() => navigate("/guest/events")}
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
              }}>Hotel Events</p>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22, fontWeight: 600, fontStyle: "italic",
                color: "#1F1F1F", margin: 0, lineHeight: 1,
              }}>Event Details</h1>
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
          <div style={{ maxWidth: 430, margin: "0 auto", paddingBottom: 24 }}>

            {/* LOADING */}
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {/* Image skeleton */}
                <div style={{
                  width: "100%", aspectRatio: "16/9",
                  background: "linear-gradient(135deg, rgba(164,0,93,0.08), rgba(164,0,93,0.03))",
                  animation: "fadeUp 0.4s ease both",
                }} />
                <div style={{ padding: "20px 20px 0" }}>
                  <div style={{ height: 22, width: "70%", borderRadius: 8, background: "rgba(164,0,93,0.08)", marginBottom: 12 }} />
                  <div style={{ height: 12, width: "45%", borderRadius: 6, background: "rgba(0,0,0,0.05)", marginBottom: 8 }} />
                  <div style={{ height: 12, width: "55%", borderRadius: 6, background: "rgba(0,0,0,0.04)" }} />
                </div>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div style={{ padding: "20px 20px 0" }}>
                <div style={{
                  background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 14, padding: "12px 14px",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ fontSize: 14 }}>⚠️</span>
                  <p style={{ fontSize: 12, color: "#b91c1c", margin: 0 }}>{error}</p>
                </div>
              </div>
            )}

            {/* EVENT CONTENT */}
            {!loading && !error && event && (
              <>
                {/* HERO IMAGE / GRADIENT */}
                <div style={{
                  width: "100%", aspectRatio: "16/9",
                  position: "relative", overflow: "hidden",
                  background: heroBg,
                  animation: "fadeUp 0.5s ease both",
                }}>
                  {event.image && !imgError && (
                    <>
                      <img
                        src={event.image}
                        alt={event.title}
                        onError={() => setImgError(true)}
                        style={{
                          position: "absolute", inset: 0,
                          width: "100%", height: "100%",
                          objectFit: "cover", objectPosition: "center",
                        }}
                      />
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.04) 35%, rgba(0,0,0,0.55) 100%)",
                      }} />
                    </>
                  )}
                  {(!event.image || imgError) && (
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "radial-gradient(ellipse at 70% 20%, rgba(255,255,255,0.12) 0%, transparent 60%)",
                    }} />
                  )}

                  {/* Status chip */}
                  <div style={{
                    position: "absolute", top: 14, right: 14,
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: "rgba(0,0,0,0.38)", backdropFilter: "blur(8px)",
                    borderRadius: 20, padding: "5px 11px",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: sc.dot }} />
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: "#fff",
                      letterSpacing: "0.14em", textTransform: "uppercase",
                    }}>{event.status || "EVENT"}</span>
                  </div>

                  {/* Date + time on image */}
                  {(evDate || event.eventTime) && (
                    <div style={{
                      position: "absolute", bottom: 14, left: 14,
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)",
                      borderRadius: 8, padding: "5px 11px",
                      border: "1px solid rgba(249,168,212,0.25)",
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
                        <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                          {event.eventTime}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* DETAILS BODY */}
                <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>

                  {/* Title + tag */}
                  <div style={{ animation: "fadeUp 0.45s ease 0.05s both" }}>
                    {event.tag && (
                      <span style={{
                        display: "inline-block", fontSize: 9, fontWeight: 700,
                        letterSpacing: "0.14em", textTransform: "uppercase",
                        color: "#A4005D", background: "rgba(164,0,93,0.08)",
                        borderRadius: 6, padding: "3px 9px", marginBottom: 8,
                      }}>{event.tag}</span>
                    )}
                    <h2 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 26, fontWeight: 700, color: "#1F1F1F",
                      margin: 0, lineHeight: 1.15,
                    }}>{event.title}</h2>
                  </div>

                  {/* DIVIDER */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
                    <div style={{ width: 5, height: 5, background: "rgba(164,0,93,0.3)", transform: "rotate(45deg)", flexShrink: 0 }} />
                    <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
                  </div>

                  {/* INFO ROWS */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "fadeUp 0.45s ease 0.1s both" }}>

                    {/* Location */}
                    {(event.location || event.venue) && (
                      <div className="info-row">
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                          background: "rgba(164,0,93,0.08)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#A4005D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </div>
                        <div>
                          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6B6B6B", margin: "0 0 2px 0" }}>Location</p>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, color: "#1F1F1F", margin: 0 }}>
                            {event.location || event.venue}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Date */}
                    {evDate && (
                      <div className="info-row">
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                          background: "rgba(164,0,93,0.08)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#A4005D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                        </div>
                        <div>
                          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6B6B6B", margin: "0 0 2px 0" }}>Date</p>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, color: "#1F1F1F", margin: 0 }}>
                            {evDate}{event.eventTime && <span style={{ color: "#6B6B6B", fontWeight: 400 }}> · {event.eventTime}</span>}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Contact */}
                    {event.contact && (
                      <div className="info-row">
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                          background: "rgba(164,0,93,0.08)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#A4005D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 5.9 5.9l1.1-1.1a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16" />
                          </svg>
                        </div>
                        <div>
                          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6B6B6B", margin: "0 0 2px 0" }}>Contact</p>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, color: "#1F1F1F", margin: 0 }}>
                            {event.contact}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DESCRIPTION */}
                  {event.description && (
                    <div style={{
                      background: "#fff", borderRadius: 18, padding: "16px",
                      border: "1px solid rgba(164,0,93,0.07)",
                      boxShadow: "0 2px 10px rgba(164,0,93,0.04)",
                      animation: "fadeUp 0.45s ease 0.15s both",
                    }}>
                      <p style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: "0.18em",
                        textTransform: "uppercase", color: "#6B6B6B", marginBottom: 10,
                      }}>About This Event</p>
                      <p style={{
                        fontSize: 13, color: "#1F1F1F", fontWeight: 300,
                        lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap",
                        fontFamily: "'Cormorant Garamond', serif",
                      }}>{event.description}</p>
                    </div>
                  )}

                  {/* EXTERNAL LINK */}
                  {event.link && (
                    <div style={{ animation: "fadeUp 0.45s ease 0.2s both" }}>
                      <a
                        href={normalizeExternalUrl(event.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-btn"
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                          width: "100%", padding: "15px",
                          background: "linear-gradient(90deg,#A4005D,#C44A87)",
                          color: "#fff", borderRadius: 16,
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 17, fontWeight: 600, fontStyle: "italic",
                          textDecoration: "none",
                          boxShadow: "0 6px 20px rgba(164,0,93,0.3)",
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        More Information
                      </a>
                    </div>
                  )}

                </div>
              </>
            )}

          </div>
        </div>
        {/* end scrollable body */}

        <GuestBottomNav />

      </div>
    </>
  );
}