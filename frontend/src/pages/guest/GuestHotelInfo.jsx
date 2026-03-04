import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import GuestBottomNav from "../../components/guest/GuestBottomNav";
import api from "../../services/api";

const toTrimmed = (v) => String(v ?? "").trim();

const keywordMatch = (text, keywords) => {
  const t = String(text || "").toLowerCase();
  return keywords.some((k) => t.includes(k));
};

const iconForName = (name) => {
  const n = String(name || "").toLowerCase();
  if (n.includes("pool")) return "🏊";
  if (n.includes("spa") || n.includes("sauna")) return "🧖";
  if (n.includes("gym") || n.includes("fitness")) return "💪";
  if (n.includes("wifi") || n.includes("internet")) return "📡";
  if (n.includes("charge") || n.includes("ev") || n.includes("electric")) return "⚡";
  if (n.includes("parking") || n.includes("valet")) return "🅿️";
  if (n.includes("laundry")) return "👕";
  if (n.includes("luggage")) return "🧳";
  if (n.includes("restaurant") || n.includes("dining") || n.includes("bar") || n.includes("cafe")) return "🍽️";
  if (n.includes("meeting") || n.includes("business") || n.includes("conference") || n.includes("banquet")) return "💼";
  return "🏨";
};

export default function GuestHotelInfo() {
  const { guest } = useGuestAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("dining");
  const [fadeIn, setFadeIn] = useState(false);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingInfo(true);
      setLoadError("");
      try {
        const res = await api.get("/hotel-info");
        if (!mounted) return;
        setHotelInfo(res.data || null);
      } catch (e) {
        if (!mounted) return;
        setLoadError(e?.response?.data?.message || e?.message || "Failed to load hotel info");
        setHotelInfo(null);
      } finally {
        if (mounted) setLoadingInfo(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const categories = [
    { key: "dining",     label: "Dining",     emoji: "🍽️" },
    { key: "wellness",   label: "Wellness",   emoji: "🧖" },
    { key: "business",   label: "Business",   emoji: "💼" },
    { key: "facilities", label: "Facilities", emoji: "🏨" },
    { key: "wifi",       label: "Wi-Fi",      emoji: "📡" },
    { key: "emergency",  label: "Emergency",  emoji: "🚨" },
    { key: "checkout",   label: "Check-out",  emoji: "🔑" },
  ];

  const basicName = toTrimmed(hotelInfo?.basicInfo?.name) || "Hotel";
  const guestDisplay = hotelInfo?.guestDisplay && typeof hotelInfo.guestDisplay === "object" ? hotelInfo.guestDisplay : null;
  const amenities = Array.isArray(hotelInfo?.amenities) ? hotelInfo.amenities : [];
  const services = Array.isArray(hotelInfo?.services) ? hotelInfo.services : [];
  const policies = Array.isArray(hotelInfo?.policies) ? hotelInfo.policies : [];

  const contacts = (() => {
    const fromGuestDisplay = guestDisplay?.contactCard?.items;
    if (Array.isArray(fromGuestDisplay) && fromGuestDisplay.length > 0) {
      return fromGuestDisplay
        .map((c) => ({ icon: String(c?.icon || "").trim(), label: toTrimmed(c?.label) }))
        .filter((c) => c.label);
    }

    const items = [];
    const phone = toTrimmed(hotelInfo?.basicInfo?.contactPhone);
    const email = toTrimmed(hotelInfo?.basicInfo?.contactEmail);
    const frontDesk = toTrimmed(hotelInfo?.emergency?.frontDeskNumber);

    if (phone) items.push({ icon: "📞", label: phone });
    if (frontDesk) items.push({ icon: "🛎️", label: frontDesk });
    if (email) items.push({ icon: "✉️", label: email });

    return items.length > 0 ? items : [{ icon: "🛎️", label: "Please contact the front desk" }];
  })();

  const diningKeywords = ["dining", "restaurant", "bistro", "bar", "cafe", "café", "room service", "breakfast", "lunch", "dinner"];
  const wellnessKeywords = ["pool", "spa", "sauna", "gym", "fitness", "massage"];
  const businessKeywords = ["business", "meeting", "conference", "banquet", "mice", "boardroom"];
  const wifiKeywords = ["wifi", "wi-fi", "internet"];

  const facilityPool = [
    ...amenities.map((a) => ({
      name: toTrimmed(a?.name),
      available: a?.available !== false,
      type: "amenity",
    })),
    ...services.map((s) => ({
      name: toTrimmed(s?.name),
      description: toTrimmed(s?.description),
      available: s?.available !== false,
      type: "service",
    })),
  ].filter((x) => x.name);

  const byCategory = {
    dining: facilityPool.filter((x) => keywordMatch(x.name, diningKeywords) || keywordMatch(x.description, diningKeywords)),
    wellness: facilityPool.filter((x) => keywordMatch(x.name, wellnessKeywords) || keywordMatch(x.description, wellnessKeywords)),
    business: facilityPool.filter((x) => keywordMatch(x.name, businessKeywords) || keywordMatch(x.description, businessKeywords)),
    wifi: facilityPool.filter((x) => keywordMatch(x.name, wifiKeywords) || keywordMatch(x.description, wifiKeywords)),
  };

  const derivedData = {
    dining: {
      headline: "Dining",
      sub: "Restaurants and dining services",
      accent: "linear-gradient(135deg,#5c001a 0%,#A4005D 100%)",
      items: byCategory.dining.map((x) => ({
        name: x.name,
        icon: iconForName(x.name),
        desc: x.description || "",
        tag: x.available ? "Available" : "Unavailable",
      })),
    },
    wellness: {
      headline: "Wellness",
      sub: "Spa, gym, pool and recreation",
      accent: "linear-gradient(135deg,#2d1500 0%,#8a5200 100%)",
      items: byCategory.wellness.map((x) => ({
        name: x.name,
        icon: iconForName(x.name),
        desc: x.description || "",
        tag: x.available ? "Available" : "Unavailable",
      })),
    },
    business: {
      headline: "Business",
      sub: "Business and event facilities",
      accent: "linear-gradient(135deg,#082036 0%,#1a6a8a 100%)",
      items: byCategory.business.map((x) => ({
        name: x.name,
        icon: iconForName(x.name),
        desc: x.description || "",
        tag: x.available ? "Available" : "Unavailable",
      })),
    },
    facilities: {
      headline: "Facilities",
      sub: "Amenities and services at the hotel",
      accent: "linear-gradient(135deg,#0e2e0e 0%,#2d6b2d 100%)",
      items: facilityPool.map((x) => ({
        name: x.name,
        icon: iconForName(x.name),
        desc: x.description || "",
        tag: x.available ? "Available" : "Unavailable",
      })),
    },
    wifi: {
      headline: "Wi-Fi",
      sub: "Connectivity information",
      accent: "linear-gradient(135deg,#1a1a3e 0%,#4a4a9e 100%)",
      details: [
        ...(byCategory.wifi.length > 0
          ? byCategory.wifi.slice(0, 10).map((x) => ({
              label: x.name,
              value: x.description || (x.available ? "Available" : "Unavailable"),
              icon: iconForName(x.name),
            }))
          : [{ label: "Wi-Fi", value: "Ask front desk for Wi‑Fi details.", icon: "📡" }]),
      ],
    },
    emergency: {
      headline: "Emergency",
      sub: "Emergency and safety contacts",
      accent: "linear-gradient(135deg,#3e0000 0%,#8b0000 100%)",
      details: [
        { label: "Front Desk", value: toTrimmed(hotelInfo?.emergency?.frontDeskNumber) || "—", icon: "🛎️" },
        { label: "Ambulance", value: toTrimmed(hotelInfo?.emergency?.ambulanceNumber) || "—", icon: "🏥" },
        { label: "Fire Safety", value: toTrimmed(hotelInfo?.emergency?.fireSafetyInfo) || "—", icon: "🔥" },
      ],
    },
    checkout: {
      headline: "Check-out",
      sub: "Policies related to check-out",
      accent: "linear-gradient(135deg,#1a1200 0%,#6b5200 100%)",
      details: (() => {
        const checkoutPolicies = policies
          .map((p) => toTrimmed(p))
          .filter(Boolean)
          .filter((p) => p.toLowerCase().includes("checkout") || p.toLowerCase().includes("check-out"));
        if (checkoutPolicies.length === 0) {
          return [{ label: "Check-out", value: "Ask front desk for check‑out policy.", icon: "🔑" }];
        }
        return checkoutPolicies.slice(0, 12).map((p, idx) => ({
          label: `Policy ${idx + 1}`,
          value: p,
          icon: "📄",
        }));
      })(),
    },
  };

  const active = (guestDisplay && guestDisplay[activeCategory]) ? guestDisplay[activeCategory] : derivedData[activeCategory];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 0 rgba(164,0,93,0.5)} 50%{box-shadow:0 0 0 5px rgba(164,0,93,0)} }
        @keyframes cardIn { from{opacity:0;transform:translateY(16px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
        .amenity-card { background:#fff; border-radius:20px; border:1px solid rgba(164,0,93,0.07); box-shadow:0 2px 14px rgba(164,0,93,0.06); overflow:hidden; transition:transform 0.22s ease,box-shadow 0.22s ease; }
        .amenity-card:active { transform:scale(0.98); }
        .cat-pill { transition:all 0.22s cubic-bezier(0.22,1,0.36,1); flex-shrink:0; white-space:nowrap; cursor:pointer; border:none; outline:none; }
        .cat-pill:active { transform:scale(0.93); }
        .cat-scroll::-webkit-scrollbar { display:none; }
        .cat-scroll { -ms-overflow-style:none; scrollbar-width:none; }
        .detail-row { animation:slideIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <div style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        background: "#EFE1CF",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>

        {/* HEADER */}
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
            <button onClick={() => navigate("/guest/dashboard")} style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(164,0,93,0.07)", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#A4005D", fontSize: 18, flexShrink: 0,
            }}>←</button>

            <div style={{ flex: 1, textAlign: "center" }}>
              <p style={{ fontSize: 9, color: "#6B6B6B", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 1px 0" }}>{basicName}</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, fontStyle: "italic", color: "#1F1F1F", margin: 0, lineHeight: 1 }}>Hotel Amenities</h1>
            </div>

            {guest?.roomNumber ? (
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(164,0,93,0.07)", borderRadius: 20, padding: "5px 10px", flexShrink: 0 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#86efac", flexShrink: 0, animation: "pulseDot 2.2s ease-in-out infinite" }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: "#A4005D", letterSpacing: "0.12em", textTransform: "uppercase" }}>{guest.roomNumber}</span>
              </div>
            ) : <div style={{ width: 36 }} />}
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", background: "#EFE1CF" }}>
          {/* paddingBottom: 100 clears the fixed bottom nav */}
          <div style={{ maxWidth: 430, margin: "0 auto", paddingBottom: 100 }}>

            {/* CATEGORY PILLS */}
            <div style={{ paddingTop: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6B6B6B", marginBottom: 10, paddingLeft: 20 }}>Categories</p>
              <div className="cat-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 20px 10px" }}>
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.key;
                  return (
                    <button key={cat.key} className="cat-pill" onClick={() => setActiveCategory(cat.key)} style={{
                      padding: "8px 14px", borderRadius: 50,
                      background: isActive ? "linear-gradient(90deg,#A4005D,#C44A87)" : "#fff",
                      color: isActive ? "#fff" : "#6B6B6B",
                      fontSize: 12, fontWeight: isActive ? 700 : 500,
                      border: isActive ? "none" : "1px solid rgba(164,0,93,0.12)",
                      boxShadow: isActive ? "0 4px 14px rgba(164,0,93,0.28)" : "0 1px 6px rgba(0,0,0,0.05)",
                    }}>
                      <span style={{ marginRight: 4, fontSize: 11 }}>{cat.emoji}</span>{cat.label}
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
              {loadingInfo && (
                <div style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(164,0,93,0.08)", borderRadius: 16, padding: 14, marginBottom: 14 }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#6B6B6B" }}>Loading hotel info…</p>
                </div>
              )}

              {!loadingInfo && loadError && (
                <div style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 16, padding: 14, marginBottom: 14 }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#b91c1c" }}>{loadError}</p>
                </div>
              )}

              <div style={{ marginBottom: 16, animation: "fadeUp 0.45s ease both" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6B6B6B", margin: "0 0 2px 0" }}>
                  {categories.find(c => c.key === activeCategory)?.label}
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: "#1F1F1F", lineHeight: 1.1, margin: "0 0 4px 0" }}>{active.headline}</h2>
                <p style={{ fontSize: 11, color: "#6B6B6B", fontWeight: 300, margin: 0 }}>{active.sub}</p>
                <div style={{ marginTop: 10, width: 36, height: 3, background: active.accent, borderRadius: 2 }} />
              </div>

              {/* CARD LIST */}
              {active.items && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {active.items.length === 0 && !loadingInfo && (
                    <div style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(164,0,93,0.08)", borderRadius: 16, padding: 14 }}>
                      <p style={{ margin: 0, fontSize: 12, color: "#6B6B6B" }}>No items configured in this category.</p>
                      <p style={{ margin: "6px 0 0 0", fontSize: 11, color: "#9B8B80" }}>
                        Admins can update this from the Admin → Hotel Info page.
                      </p>
                    </div>
                  )}
                  {active.items.map((item, i) => (
                    <div key={item.name} className="amenity-card" style={{ animation: `cardIn 0.45s cubic-bezier(0.22,1,0.36,1) ${i * 55}ms both` }}>
                      <div style={{ height: 3, background: active.accent }} />
                      <div style={{ padding: "14px 16px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 46, height: 46, flexShrink: 0, borderRadius: 13, background: "#F6EADB", border: "1.5px solid rgba(164,0,93,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{item.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 4 }}>
                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: "#1F1F1F", margin: 0, lineHeight: 1.1 }}>{item.name}</p>
                            {item.tag && <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(164,0,93,0.08)", color: "#A4005D", border: "1px solid rgba(164,0,93,0.12)", borderRadius: 6, padding: "2px 8px" }}>{item.tag}</span>}
                          </div>
                          {item.desc ? (
                            <p style={{ fontSize: 11.5, color: "#7a6a60", fontWeight: 300, lineHeight: 1.45, margin: "0 0 8px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.desc}</p>
                          ) : null}

                          {item.hours ? (
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#F6EADB", borderRadius: 8, padding: "4px 10px" }}>
                              <span style={{ fontSize: 10 }}>⏰</span>
                              <span style={{ fontSize: 10, color: "#A4005D", fontWeight: 600, letterSpacing: "0.04em" }}>{item.hours}</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* DETAIL LIST */}
              {active.details && (
                <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(164,0,93,0.07)", boxShadow: "0 2px 16px rgba(30,21,16,0.05)", overflow: "hidden" }}>
                  <div style={{ height: 4, background: active.accent }} />
                  <div style={{ padding: "4px 0" }}>
                    {active.details.map((detail, i) => (
                      <div key={detail.label} className="detail-row" style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "14px 18px",
                        borderBottom: i < active.details.length - 1 ? "1px solid rgba(164,0,93,0.06)" : "none",
                        animationDelay: `${i * 50}ms`,
                      }}>
                        <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 10, background: "#F6EADB", border: "1px solid rgba(164,0,93,0.09)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{detail.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 10, color: "#9B8B80", fontWeight: 500, letterSpacing: "0.04em", margin: "0 0 2px 0" }}>{detail.label}</p>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, color: "#1F1F1F", margin: 0, lineHeight: 1.2 }}>{detail.value}</p>
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
              <div style={{ background: "linear-gradient(135deg, #1a0010 0%, #3a0020 100%)", borderRadius: 20, padding: "20px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(164,0,93,0.3), transparent 65%)", pointerEvents: "none" }} />
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(249,168,212,0.7)", margin: "0 0 4px 0" }}>Need Help?</p>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, fontStyle: "italic", color: "#fff", margin: "0 0 12px 0" }}>We're always here for you</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {contacts.map((c) => (
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

        <GuestBottomNav />
      </div>
    </>
  );
}