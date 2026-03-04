import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { guestChat } from "../../services/chat.service";
import GuestBottomNav from "../../components/guest/GuestBottomNav";

const MAX_LOCAL_HISTORY = 10;
const NAV_HEIGHT = 76; // pill(64) + bottomGap(12)

export default function GuestSupport() {
  const navigate = useNavigate();

  const [fadeIn, setFadeIn] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Ask me about today's menu, upcoming events, or hotel services.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  const historyForApi = useMemo(() => {
    return messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && m.content)
      .slice(-MAX_LOCAL_HISTORY)
      .map((m) => ({ role: m.role, content: m.content }));
  }, [messages]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  const send = async () => {
    const text = String(input || "").trim();
    if (!text || sending) return;

    setError("");
    setSending(true);
    setInput("");

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);

    try {
      const data = await guestChat({ message: text, history: historyForApi });
      const reply = String(data?.reply || "").trim();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply || "Sorry — I couldn't generate a reply." },
      ]);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Chat failed. Please try again.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I couldn't reach the chat service. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
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
              }}>Guest Assistant</div>
              <div style={{ fontSize: 11, color: "#6B6B6B", marginTop: 2 }}>
                Chat about menu, events, and services
              </div>
            </div>

            <div style={{ width: 36, height: 36 }} />
          </div>
        </div>

        {/* CHAT BODY — paddingBottom pushes input above fixed nav */}
        <div style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxWidth: 430,
          width: "100%",
          margin: "0 auto",
          paddingBottom: NAV_HEIGHT,
        }}>
          {/* Messages list */}
          <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: 14 }}>
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    marginBottom: 10,
                    animation: "fadeUp 0.35s ease both",
                  }}
                >
                  <div style={{
                    maxWidth: "85%",
                    padding: "10px 12px",
                    borderRadius: 14,
                    whiteSpace: "pre-wrap",
                    fontSize: 13,
                    lineHeight: 1.35,
                    background: isUser ? "var(--brand)" : "rgba(255,255,255,0.92)",
                    color: isUser ? "white" : "var(--text-primary)",
                    border: isUser ? "none" : "1px solid rgba(0,0,0,0.06)",
                    boxShadow: isUser
                      ? "0 8px 18px rgba(164,0,93,0.14)"
                      : "0 2px 12px rgba(30,21,16,0.05)",
                  }}>
                    {m.content}
                  </div>
                </div>
              );
            })}

            {sending && (
              <div style={{ color: "var(--text-muted)", fontSize: 12 }}>Thinking…</div>
            )}
            {error && (
              <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>{error}</div>
            )}
          </div>

          {/* INPUT BAR */}
          <div style={{
            margin: "0 10px 10px",
            padding: "10px 10px",
            borderRadius: 16,
            display: "flex", gap: 8,
            borderTop: "1px solid rgba(0,0,0,0.06)",
            background: "rgba(255,255,255,0.92)",
            flexShrink: 0,
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a message…"
              rows={1}
              style={{
                flex: 1, resize: "none",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
                padding: "10px 10px",
                fontSize: 13, outline: "none",
                background: "white",
              }}
            />
            <button
              type="button"
              onClick={send}
              disabled={sending || !String(input).trim()}
              style={{
                padding: "10px 12px", borderRadius: 12,
                border: "none",
                background: sending || !String(input).trim()
                  ? "rgba(164,0,93,0.35)"
                  : "var(--brand)",
                color: "white", fontWeight: 600, fontSize: 13,
                cursor: sending || !String(input).trim() ? "not-allowed" : "pointer",
              }}
            >Send</button>
          </div>
        </div>

        <GuestBottomNav />
      </div>
    </>
  );
}