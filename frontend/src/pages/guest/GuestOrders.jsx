import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import GuestBottomNav from "../../components/guest/GuestBottomNav";
import api from "../../services/api";

const statusConfig = {
  pending:    { bg: "rgba(251,191,36,0.12)",  text: "#92400e", dot: "#f59e0b",  label: "Pending"    },
  preparing:  { bg: "rgba(59,130,246,0.1)",   text: "#1e40af", dot: "#3b82f6",  label: "Preparing"  },
  ready:      { bg: "rgba(139,92,246,0.1)",   text: "#5b21b6", dot: "#8b5cf6",  label: "Ready"      },
  delivered:  { bg: "rgba(34,197,94,0.1)",    text: "#065f46", dot: "#22c55e",  label: "Delivered"  },
  cancelled:  { bg: "rgba(239,68,68,0.08)",   text: "#991b1b", dot: "#ef4444",  label: "Cancelled"  },
};

const formatTime = (value) => {
  try {
    const d = new Date(value);
    return d.toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
};

export default function GuestOrders() {
  const { guest } = useGuestAuth();
  const navigate = useNavigate();

  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/guest/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .order-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(164,0,93,0.07);
          box-shadow: 0 2px 14px rgba(164,0,93,0.06);
          overflow: hidden;
        }


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
              }}>In-Room Dining</p>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22, fontWeight: 600, fontStyle: "italic",
                color: "#1F1F1F", margin: 0, lineHeight: 1,
              }}>My Orders</h1>
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

            {/* Section label + live indicator */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14,
            }}>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "#6B6B6B", margin: 0,
              }}>Order History</p>
              {/* Live refresh indicator */}
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(34,197,94,0.1)", borderRadius: 20,
                padding: "4px 10px",
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%", background: "#22c55e",
                  animation: "pulseDot 2s ease-in-out infinite",
                }} />
                <span style={{
                  fontSize: 9, fontWeight: 700, color: "#065f46",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                }}>Live</span>
              </div>
            </div>

            {/* LOADING SKELETONS */}
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[1, 2, 3].map((n) => (
                  <div key={n} style={{
                    background: "rgba(255,255,255,0.6)", borderRadius: 20, padding: 16,
                    border: "1px solid rgba(164,0,93,0.06)",
                    animation: `fadeUp 0.4s ease ${n * 80}ms both`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ height: 13, width: "35%", borderRadius: 6, background: "rgba(164,0,93,0.08)" }} />
                      <div style={{ height: 20, width: "22%", borderRadius: 20, background: "rgba(164,0,93,0.06)" }} />
                    </div>
                    <div style={{ height: 10, width: "60%", borderRadius: 6, background: "rgba(0,0,0,0.05)", marginBottom: 6 }} />
                    <div style={{ height: 10, width: "45%", borderRadius: 6, background: "rgba(0,0,0,0.04)" }} />
                  </div>
                ))}
              </div>
            )}

            {/* EMPTY */}
            {!loading && orders.length === 0 && (
              <div style={{
                background: "#fff", borderRadius: 18, padding: "32px 20px", textAlign: "center",
                border: "1px solid rgba(164,0,93,0.07)",
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "rgba(164,0,93,0.08)", margin: "0 auto 14px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#A4005D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="1" />
                    <path d="M9 12h6" /><path d="M9 16h4" />
                  </svg>
                </div>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#6B6B6B",
                  fontStyle: "italic", margin: 0,
                }}>No orders yet</p>
                <p style={{ fontSize: 11, color: "#aaa", marginTop: 4, marginBottom: 16 }}>
                  Your food orders will appear here
                </p>
                <button
                  onClick={() => navigate("/guest/menu")}
                  style={{
                    background: "linear-gradient(90deg,#A4005D,#C44A87)",
                    color: "#fff", border: "none", borderRadius: 12,
                    padding: "10px 22px", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", boxShadow: "0 4px 14px rgba(164,0,93,0.25)",
                  }}
                >Browse Menu</button>
              </div>
            )}

            {/* ORDERS LIST */}
            {!loading && orders.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {orders.map((order, i) => {
                  const sc = statusConfig[order.status?.toLowerCase()] || statusConfig.pending;
                  return (
                    <div
                      key={order._id}
                      className="order-card"
                      style={{ animation: `fadeUp 0.45s ease ${Math.min(i, 5) * 60}ms both` }}
                    >
                      <div style={{ padding: "14px 16px" }}>

                        {/* Top row: order id + status */}
                        <div style={{
                          display: "flex", alignItems: "center",
                          justifyContent: "space-between", marginBottom: 12,
                        }}>
                          <div>
                            <p style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: 15, fontWeight: 600, color: "#1F1F1F",
                              margin: "0 0 2px 0",
                            }}>Order #{String(order._id).slice(-6)}</p>
                            {order.createdAt && (
                              <p style={{ fontSize: 10, color: "#6B6B6B", margin: 0 }}>
                                {formatTime(order.createdAt)}
                              </p>
                            )}
                          </div>
                          {/* Status pill */}
                          <div style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            background: sc.bg, borderRadius: 20, padding: "5px 11px",
                            flexShrink: 0,
                          }}>
                            <div style={{
                              width: 5, height: 5, borderRadius: "50%",
                              background: sc.dot, flexShrink: 0,
                              animation: (order.status?.toLowerCase() === "preparing" || order.status?.toLowerCase() === "pending")
                                ? "pulseDot 2s ease-in-out infinite" : "none",
                            }} />
                            <span style={{
                              fontSize: 9, fontWeight: 700, color: sc.text,
                              letterSpacing: "0.12em", textTransform: "uppercase",
                            }}>{sc.label}</span>
                          </div>
                        </div>

                        {/* Items */}
                        <div style={{
                          background: "#F6EADB", borderRadius: 12, padding: "10px 12px",
                          marginBottom: 12,
                        }}>
                          <p style={{
                            fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
                            textTransform: "uppercase", color: "#6B6B6B",
                            margin: "0 0 6px 0",
                          }}>Items</p>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {(order.items || []).map((item, j) => (
                              <div key={j} style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center",
                              }}>
                                <span style={{
                                  fontSize: 12, color: "#1F1F1F", fontWeight: 400,
                                }}>
                                  {item.qty || item.quantity} × {item.name}
                                </span>
                                {item.price && (
                                  <span style={{
                                    fontSize: 11, color: "#6B6B6B", fontWeight: 400,
                                  }}>₹{(item.price * (item.qty || item.quantity)).toFixed(0)}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Total row */}
                        <div style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          paddingTop: 10, borderTop: "1px solid rgba(164,0,93,0.07)",
                        }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                            textTransform: "uppercase", color: "#6B6B6B",
                          }}>Total</span>
                          <span style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 18, fontWeight: 700, color: "#A4005D",
                          }}>₹{order.totalAmount}</span>
                        </div>
                      </div>

                      {/* Status accent strip */}
                      <div style={{
                        height: 3,
                        background:
                          order.status?.toLowerCase() === "delivered"  ? "linear-gradient(90deg,#22c55e,#4ade80)" :
                          order.status?.toLowerCase() === "preparing"  ? "linear-gradient(90deg,#3b82f6,#60a5fa)" :
                          order.status?.toLowerCase() === "ready"      ? "linear-gradient(90deg,#8b5cf6,#a78bfa)" :
                          order.status?.toLowerCase() === "cancelled"  ? "linear-gradient(90deg,#ef4444,#f87171)" :
                          "linear-gradient(90deg,#f59e0b,#fbbf24)",
                        borderRadius: "0 0 20px 20px",
                      }} />
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
        {/* end scrollable body */}

        <GuestBottomNav />

      </div>
    </>
  );
}