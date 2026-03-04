import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import GuestBottomNav from "../../components/guest/GuestBottomNav";
import {
  createHousekeepingRequest,
  getHousekeepingRequests,
} from "../../services/housekeeping.service";

const ITEMS = [
  { name: "Towel",        emoji: "🪣" },
  { name: "Shampoo",      emoji: "🧴" },
  { name: "Soap",         emoji: "🧼" },
  { name: "Bedsheet",     emoji: "🛏️" },
  { name: "Water Bottle", emoji: "💧" },
  { name: "Room Cleaning",emoji: "🧹" },
];

const formatDateTime = (value) => {
  try {
    const d = new Date(value);
    return d.toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
};

const initQty = () => {
  const o = {};
  for (const { name } of ITEMS) o[name] = 0;
  return o;
};

export default function GuestHousekeeping() {
  const { guest } = useGuestAuth();
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState(initQty);
  const [note, setNote]             = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [requests, setRequests]     = useState([]);
  const [error, setError]           = useState(null);
  const [success, setSuccess]       = useState(null);
  const [fadeIn, setFadeIn]         = useState(false);
  const [activeTab, setActiveTab]   = useState("request");

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  const itemsPayload = useMemo(() =>
    ITEMS.map(({ name }) => ({ name, quantity: Number(quantities[name] || 0) }))
      .filter((i) => i.quantity > 0)
      .map((i) => ({ ...i, quantity: Math.min(5, Math.max(1, i.quantity)) })),
    [quantities]
  );

  const load = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await getHousekeepingRequests();
      setRequests(data?.requests || []);
    } catch (e) {
      // For background refresh, keep the UI stable and don't spam errors.
      if (!silent) {
        setError(e?.response?.data?.message || "Failed to load requests");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Auto-refresh only on the "My Requests" tab.
  useEffect(() => {
    if (activeTab !== "history") return;

    let cancelled = false;

    const tick = async () => {
      if (cancelled) return;
      await load({ silent: true });
    };

    // Refresh immediately when switching to the tab.
    tick();
    const id = setInterval(tick, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [activeTab]);

  const updateQty = (name, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [name]: Math.max(0, Math.min(5, (prev[name] || 0) + delta)),
    }));
  };

  const submit = async () => {
    setError(null);
    setSuccess(null);
    if (itemsPayload.length === 0) { setError("Select at least one item."); return; }
    setSubmitting(true);
    try {
      await createHousekeepingRequest({ items: itemsPayload, note });
      setSuccess("Request submitted successfully.");
      setNote("");
      setQuantities(initQty());
      await load();
      setActiveTab("history");
    } catch (e) {
      const apiMsg = e?.response?.data?.message;
      const violations = e?.response?.data?.violations;
      if (violations?.length) {
        setError(`${apiMsg || "Daily limit exceeded"}. ` + violations.map((v) => `${v.name}: ${v.alreadyRequestedToday}/${v.limit} used`).join(" · "));
      } else {
        setError(apiMsg || "Failed to create request");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const totalItems = itemsPayload.reduce((s, i) => s + i.quantity, 0);

  const statusConfig = {
    pending:   { bg: "rgba(251,191,36,0.12)",  text: "#92400e", dot: "#f59e0b" },
    accepted:  { bg: "rgba(59,130,246,0.1)",   text: "#1e40af", dot: "#3b82f6" },
    completed: { bg: "rgba(34,197,94,0.1)",    text: "#065f46", dot: "#22c55e" },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 0 rgba(164,0,93,0.5)} 50%{box-shadow:0 0 0 5px rgba(164,0,93,0)} }
        @keyframes scaleIn { 0%{transform:scale(0.85);opacity:0} 60%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
        @keyframes successSlide { 0%{opacity:0;transform:translate(-50%,-20px)} 15%{opacity:1;transform:translate(-50%,0)} 80%{opacity:1;transform:translate(-50%,0)} 100%{opacity:0;transform:translate(-50%,-10px)} }
        .item-card { background:#fff; border-radius:18px; border:1px solid rgba(164,0,93,0.07); box-shadow:0 2px 12px rgba(164,0,93,0.05); transition:box-shadow 0.2s ease; overflow:hidden; }
        .item-card.selected { border-color:rgba(164,0,93,0.25); box-shadow:0 4px 18px rgba(164,0,93,0.12); }
        .qty-btn { transition:transform 0.15s ease,background 0.15s ease; }
        .qty-btn:active { transform:scale(0.88); }
        .tab-btn { transition:all 0.22s cubic-bezier(0.22,1,0.36,1); cursor:pointer; border:none; outline:none; }
        .submit-btn { transition:opacity 0.2s ease,transform 0.15s ease; }
        .submit-btn:active:not(:disabled) { transform:scale(0.98); }
      `}</style>

      <div style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        background: "#EFE1CF",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>

        {/* SUCCESS TOAST */}
        {success && (
          <div style={{
            position: "fixed", top: 24, left: "50%", zIndex: 200,
            background: "linear-gradient(135deg,#1c8a5c,#22c47a)",
            color: "#fff", padding: "12px 22px", borderRadius: 50,
            boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
            fontWeight: 700, fontSize: 13, letterSpacing: "0.04em",
            animation: "successSlide 3.5s ease forwards",
            display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
          }}>
            <span style={{ fontSize: 16 }}>✓</span>{success}
          </div>
        )}

        {/* HEADER */}
        <div style={{
          flexShrink: 0,
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(164,0,93,0.1)",
          boxShadow: "0 2px 12px rgba(30,21,16,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 12, maxWidth: 430, margin: "0 auto" }}>
            <button onClick={() => navigate("/guest/dashboard")} style={{
              width: 36, height: 36, borderRadius: "50%", background: "rgba(164,0,93,0.07)",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#A4005D", fontSize: 18, flexShrink: 0,
            }}>←</button>

            <div style={{ flex: 1, textAlign: "center" }}>
              <p style={{ fontSize: 9, color: "#6B6B6B", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 1px 0" }}>Centre Point Nagpur</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, fontStyle: "italic", color: "#1F1F1F", margin: 0, lineHeight: 1 }}>Housekeeping</h1>
            </div>

            {guest?.roomNumber ? (
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(164,0,93,0.07)", borderRadius: 20, padding: "5px 10px", flexShrink: 0 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#86efac", flexShrink: 0, animation: "pulseDot 2.2s ease-in-out infinite" }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: "#A4005D", letterSpacing: "0.12em", textTransform: "uppercase" }}>{guest.roomNumber}</span>
              </div>
            ) : <div style={{ width: 36 }} />}
          </div>

          {/* TABS */}
          <div style={{ display: "flex", gap: 0, maxWidth: 430, margin: "0 auto", padding: "0 16px 0" }}>
            {[
              { key: "request", label: "New Request" },
              { key: "history", label: `My Requests${requests.length ? ` (${requests.length})` : ""}` },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button key={tab.key} className="tab-btn" onClick={() => setActiveTab(tab.key)} style={{
                  flex: 1, padding: "10px 8px",
                  fontSize: 12, fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#A4005D" : "#6B6B6B",
                  background: "none",
                  borderBottom: isActive ? "2px solid #A4005D" : "2px solid transparent",
                  letterSpacing: "0.03em",
                }}>{tab.label}</button>
              );
            })}
          </div>
        </div>

        {/* SCROLLABLE BODY — paddingBottom: 100px clears the fixed nav */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", background: "#EFE1CF" }}>
          <div style={{ maxWidth: 430, margin: "0 auto", padding: "16px 20px 100px" }}>

            {/* REQUEST TAB */}
            {activeTab === "request" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6B6B6B", marginBottom: 14 }}>Select Items</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {ITEMS.map(({ name, emoji }, i) => {
                    const qty = quantities[name];
                    const selected = qty > 0;
                    return (
                      <div key={name} className={`item-card${selected ? " selected" : ""}`} style={{ animation: `fadeUp 0.4s ease ${i * 50}ms both` }}>
                        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                            background: selected ? "rgba(164,0,93,0.08)" : "#F6EADB",
                            border: selected ? "1.5px solid rgba(164,0,93,0.18)" : "1.5px solid rgba(164,0,93,0.08)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 20, transition: "all 0.2s ease",
                          }}>{emoji}</div>

                          <div style={{ flex: 1 }}>
                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, color: "#1F1F1F", margin: 0, lineHeight: 1.2 }}>{name}</p>
                            <p style={{ fontSize: 10, color: "#6B6B6B", fontWeight: 400, margin: "2px 0 0 0" }}>Max 5 per day</p>
                          </div>

                          {qty === 0 ? (
                            <button onClick={() => updateQty(name, 1)} style={{
                              background: "linear-gradient(90deg,#A4005D,#C44A87)",
                              color: "#fff", border: "none", borderRadius: 10,
                              padding: "8px 14px", fontSize: 13, fontWeight: 700,
                              cursor: "pointer", letterSpacing: "0.04em",
                              boxShadow: "0 3px 10px rgba(164,0,93,0.22)",
                              animation: "scaleIn 0.25s ease",
                            }}>Add</button>
                          ) : (
                            <div style={{
                              display: "flex", alignItems: "center", gap: 8,
                              background: "rgba(164,0,93,0.07)", borderRadius: 10,
                              padding: "4px 6px", border: "1px solid rgba(164,0,93,0.14)",
                              animation: "scaleIn 0.2s ease",
                            }}>
                              <button className="qty-btn" onClick={() => updateQty(name, -1)} style={{
                                width: 28, height: 28, borderRadius: 7,
                                background: "rgba(164,0,93,0.12)", border: "none",
                                color: "#A4005D", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                {qty === 1 ? (
                                  <svg viewBox="0 0 24 24" fill="none" stroke="#A4005D" strokeWidth="2.5" style={{ width: 11, height: 11 }}>
                                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                                  </svg>
                                ) : <span style={{ fontSize: 16, fontWeight: 700 }}>−</span>}
                              </button>
                              <span style={{ fontSize: 14, fontWeight: 700, color: "#A4005D", minWidth: 16, textAlign: "center" }}>{qty}</span>
                              <button className="qty-btn" onClick={() => updateQty(name, 1)} disabled={qty >= 5} style={{
                                width: 28, height: 28, borderRadius: 7,
                                background: qty >= 5 ? "rgba(164,0,93,0.1)" : "linear-gradient(90deg,#A4005D,#C44A87)",
                                border: "none", color: "#fff", fontSize: 18, fontWeight: 700,
                                cursor: qty >= 5 ? "not-allowed" : "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: qty >= 5 ? "none" : "0 2px 6px rgba(164,0,93,0.2)",
                                opacity: qty >= 5 ? 0.45 : 1,
                              }}>+</button>
                            </div>
                          )}
                        </div>
                        {selected && <div style={{ height: 3, background: "linear-gradient(90deg,#A4005D,#C44A87)", borderRadius: "0 0 18px 18px" }} />}
                      </div>
                    );
                  })}
                </div>

                {/* DIVIDER */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
                  <div style={{ width: 5, height: 5, background: "rgba(164,0,93,0.3)", transform: "rotate(45deg)", flexShrink: 0 }} />
                  <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(164,0,93,0.2), transparent)" }} />
                </div>

                {/* NOTE */}
                <div style={{ background: "#fff", borderRadius: 18, padding: "16px", border: "1px solid rgba(164,0,93,0.07)", boxShadow: "0 2px 12px rgba(164,0,93,0.05)", marginBottom: 16 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6B6B6B", marginBottom: 10 }}>Special Instructions</p>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder="Any special instructions for our team…"
                    maxLength={500}
                    style={{
                      width: "100%", border: "1px solid rgba(164,0,93,0.12)",
                      borderRadius: 12, padding: "10px 12px",
                      fontSize: 13, color: "#1F1F1F", background: "#F6EADB",
                      outline: "none", resize: "none", lineHeight: 1.5,
                      fontFamily: "'Cormorant Garamond', serif", fontWeight: 400,
                      boxSizing: "border-box",
                    }}
                  />
                  <p style={{ fontSize: 10, color: "rgba(164,0,93,0.4)", textAlign: "right", marginTop: 4, marginBottom: 0 }}>{note.length}/500</p>
                </div>

                {/* ERROR */}
                {error && (
                  <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
                    <p style={{ fontSize: 12, color: "#b91c1c", margin: 0, lineHeight: 1.5 }}>{error}</p>
                  </div>
                )}

                {/* SUBMIT */}
                <button
                  className="submit-btn"
                  onClick={submit}
                  disabled={submitting || itemsPayload.length === 0}
                  style={{
                    width: "100%", padding: "15px",
                    background: itemsPayload.length === 0 ? "rgba(164,0,93,0.3)" : "linear-gradient(90deg,#A4005D,#C44A87)",
                    color: "#fff", border: "none", borderRadius: 16,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 18, fontWeight: 600, fontStyle: "italic",
                    cursor: submitting || itemsPayload.length === 0 ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.65 : 1,
                    boxShadow: itemsPayload.length === 0 ? "none" : "0 6px 20px rgba(164,0,93,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  }}
                >
                  {submitting ? "Submitting…" : (
                    <>
                      Submit Request
                      {totalItems > 0 && (
                        <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: 8, padding: "2px 9px", fontSize: 13, fontWeight: 700, fontStyle: "normal" }}>{totalItems}</span>
                      )}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === "history" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6B6B6B", margin: 0 }}>Past Requests</p>
                  <button onClick={load} style={{ fontSize: 10, color: "#A4005D", fontWeight: 600, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.04em" }}>Refresh ↻</button>
                </div>

                {loading ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[1, 2].map((n) => (
                      <div key={n} style={{ background: "rgba(255,255,255,0.6)", borderRadius: 18, padding: 16, border: "1px solid rgba(164,0,93,0.06)", animation: `fadeUp 0.4s ease ${n * 80}ms both` }}>
                        <div style={{ height: 13, width: "40%", borderRadius: 6, background: "rgba(164,0,93,0.08)", marginBottom: 8 }} />
                        <div style={{ height: 10, width: "65%", borderRadius: 6, background: "rgba(0,0,0,0.05)" }} />
                      </div>
                    ))}
                  </div>
                ) : requests.length === 0 ? (
                  <div style={{ background: "#fff", borderRadius: 18, padding: "28px 20px", textAlign: "center", border: "1px solid rgba(164,0,93,0.07)" }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#6B6B6B", fontStyle: "italic", margin: 0 }}>No requests yet</p>
                    <p style={{ fontSize: 11, color: "#aaa", marginTop: 4, marginBottom: 0 }}>Your housekeeping requests will appear here</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {requests.map((r, i) => {
                      const sc = statusConfig[r.status] || statusConfig.pending;
                      return (
                        <div key={r._id} style={{
                          background: "#fff", borderRadius: 18,
                          border: "1px solid rgba(164,0,93,0.07)",
                          boxShadow: "0 2px 12px rgba(164,0,93,0.05)",
                          overflow: "hidden",
                          animation: `fadeUp 0.4s ease ${Math.min(i, 5) * 60}ms both`,
                        }}>
                          <div style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                              <div>
                                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, color: "#1F1F1F", margin: "0 0 2px 0" }}>Request #{String(r._id).slice(-6)}</p>
                                <p style={{ fontSize: 10, color: "#6B6B6B", margin: 0 }}>{formatDateTime(r.createdAt)}</p>
                              </div>
                              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: sc.bg, borderRadius: 20, padding: "4px 10px", flexShrink: 0 }}>
                                <div style={{ width: 5, height: 5, borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                                <span style={{ fontSize: 9, fontWeight: 700, color: sc.text, letterSpacing: "0.12em", textTransform: "uppercase" }}>{String(r.status || "pending")}</span>
                              </div>
                            </div>
                            <div style={{ background: "#F6EADB", borderRadius: 10, padding: "8px 12px", marginBottom: r.note ? 10 : 0 }}>
                              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6B6B6B", margin: "0 0 4px 0" }}>Items</p>
                              <p style={{ fontSize: 12, color: "#1F1F1F", margin: 0, lineHeight: 1.5 }}>{(r.items || []).map((it) => `${it.quantity} × ${it.name}`).join("  ·  ")}</p>
                            </div>
                            {r.note && (
                              <div style={{ background: "rgba(164,0,93,0.04)", borderRadius: 10, padding: "8px 12px", border: "1px solid rgba(164,0,93,0.08)" }}>
                                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6B6B6B", margin: "0 0 4px 0" }}>Note</p>
                                <p style={{ fontSize: 12, color: "#1F1F1F", margin: 0, lineHeight: 1.5 }}>{r.note}</p>
                              </div>
                            )}
                          </div>
                          <div style={{
                            height: 3,
                            background: r.status === "completed"
                              ? "linear-gradient(90deg,#22c55e,#4ade80)"
                              : r.status === "accepted"
                              ? "linear-gradient(90deg,#3b82f6,#60a5fa)"
                              : "linear-gradient(90deg,#f59e0b,#fbbf24)",
                            borderRadius: "0 0 18px 18px",
                          }} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        <GuestBottomNav />
      </div>
    </>
  );
}