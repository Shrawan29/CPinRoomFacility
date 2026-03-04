import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GuestBottomNav from "../../components/guest/GuestBottomNav";
import { submitComplaint } from "../../services/complaints.service";

const NAV_HEIGHT = 76; // pill(64) + bottomGap(12)

const TYPES = [
  "Complaint",
  "Feedback",
  "Suggestion",
  "Other",
];

const CATEGORIES = [
  "Room",
  "Housekeeping",
  "Food",
  "Facilities",
  "Staff",
  "Billing",
  "Other",
];

export default function GuestComplaints() {
  const navigate = useNavigate();

  const [fadeIn, setFadeIn] = useState(false);
  const [type, setType] = useState(TYPES[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  const canSubmit = useMemo(() => {
    return String(subject).trim().length >= 3 && String(message).trim().length >= 10;
  }, [subject, message]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !canSubmit) return;

    setSubmitting(true);
    setError("");

    try {
      await submitComplaint({
        type,
        category,
        subject: String(subject).trim(),
        message: String(message).trim(),
      });
      setDone(true);
      setSubject("");
      setMessage("");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Submission failed";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&display=swap');
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <div style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        background: "linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>

        {/* HEADER */}
        <div style={{
          flexShrink: 0,
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(164,0,93,0.1)",
          boxShadow: "0 2px 12px rgba(30,21,16,0.06)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px", gap: 12,
            maxWidth: 430, margin: "0 auto",
          }}>
            <button
              type="button"
              onClick={() => navigate("/guest/dashboard")}
              aria-label="Back"
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(164,0,93,0.07)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#A4005D",
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>‹</span>
            </button>

            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18, fontWeight: 700, color: "#1F1F1F", lineHeight: 1.1,
              }}>Complaints & Feedback</div>
              <div style={{ fontSize: 11, color: "#6B6B6B", marginTop: 2 }}>
                Tell us what went wrong or how to improve
              </div>
            </div>

            <div style={{ width: 36, height: 36 }} />
          </div>
        </div>

        {/* BODY */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          maxWidth: 430,
          width: "100%",
          margin: "0 auto",
          padding: 14,
          paddingBottom: NAV_HEIGHT,
        }}>
          <form onSubmit={onSubmit} style={{ animation: "fadeUp 0.35s ease both" }}>
            <div style={{
              background: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 18,
              padding: 14,
              boxShadow: "0 8px 22px rgba(30,21,16,0.06)",
            }}>
              <FieldLabel>Type</FieldLabel>
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>

              <Spacer />

              <FieldLabel>Category</FieldLabel>
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>

              <Spacer />

              <FieldLabel>Subject</FieldLabel>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Short summary"
                maxLength={120}
              />

              <Spacer />

              <FieldLabel>Message</FieldLabel>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe the issue or feedback"
                rows={6}
                maxLength={2000}
              />

              {error && (
                <div style={{ marginTop: 10, fontSize: 12, color: "#7a0b3a" }}>{error}</div>
              )}

              {done && !error && (
                <div style={{ marginTop: 10, fontSize: 12, color: "#2563eb" }}>
                  Submitted. Thank you.
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit || submitting}
                style={{
                  marginTop: 12,
                  width: "100%",
                  height: 44,
                  borderRadius: 14,
                  border: "none",
                  cursor: !canSubmit || submitting ? "not-allowed" : "pointer",
                  background: !canSubmit || submitting ? "rgba(164,0,93,0.35)" : "var(--brand)",
                  color: "white",
                  fontWeight: 700,
                  boxShadow: "0 10px 24px rgba(164,0,93,0.18)",
                }}
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>

              <div style={{ marginTop: 10, fontSize: 11, color: "#6B6B6B" }}>
                Note: This form is for feedback only. For emergencies, contact reception.
              </div>
            </div>
          </form>
        </div>

        <GuestBottomNav />
      </div>
    </>
  );
}

function FieldLabel({ children }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 700, color: "#1F1F1F", marginBottom: 6 }}>
      {children}
    </div>
  );
}

function Spacer() {
  return <div style={{ height: 12 }} />;
}

function Input(props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        height: 42,
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.12)",
        padding: "0 12px",
        outline: "none",
        fontSize: 13,
        background: "white",
      }}
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.12)",
        padding: 12,
        outline: "none",
        fontSize: 13,
        background: "white",
        resize: "vertical",
      }}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        height: 42,
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.12)",
        padding: "0 10px",
        outline: "none",
        fontSize: 13,
        background: "white",
      }}
    />
  );
}
