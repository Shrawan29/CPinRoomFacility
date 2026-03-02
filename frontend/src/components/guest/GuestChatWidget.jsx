import { useEffect, useMemo, useRef, useState } from "react";
import { guestChat } from "../../services/chat.service";

const MAX_LOCAL_HISTORY = 10;

export default function GuestChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Ask me about today’s menu or upcoming events.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const listRef = useRef(null);
  const inputRef = useRef(null);

  const historyForApi = useMemo(() => {
    return messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && m.content)
      .slice(-MAX_LOCAL_HISTORY)
      .map((m) => ({ role: m.role, content: m.content }));
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [open, messages.length]);

  const send = async () => {
    const text = String(input || "").trim();
    if (!text || sending) return;

    setError("");
    setSending(true);
    setInput("");

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);

    try {
      const data = await guestChat({
        message: text,
        history: historyForApi,
      });

      const reply = String(data?.reply || "").trim();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply || "Sorry — I couldn’t generate a reply." },
      ]);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Chat failed. Please try again.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I couldn’t reach the chat service. Please try again.",
        },
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
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 9999,
        fontFamily: "var(--font-sans)",
      }}
    >
      {open && (
        <div
          style={{
            width: 320,
            maxWidth: "calc(100vw - 32px)",
            height: 420,
            maxHeight: "calc(100vh - 120px)",
            background: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(164,0,93,0.14)",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 12px 28px rgba(164,0,93,0.14)",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              background: "linear-gradient(90deg, var(--brand), var(--brand-soft))",
              color: "white",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 14 }}>Guest Assistant</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: 18,
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          <div
            ref={listRef}
            style={{
              padding: 12,
              height: "calc(100% - 106px)",
              overflowY: "auto",
              background: "linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))",
            }}
          >
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "10px 12px",
                      borderRadius: 14,
                      whiteSpace: "pre-wrap",
                      fontSize: 13,
                      lineHeight: 1.35,
                      background: isUser ? "var(--brand)" : "rgba(255,255,255,0.9)",
                      color: isUser ? "white" : "var(--text-primary)",
                      border: isUser ? "none" : "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}

            {sending && (
              <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
                Thinking…
              </div>
            )}

            {error && (
              <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>
                {error}
              </div>
            )}
          </div>

          <div
            style={{
              padding: 10,
              display: "flex",
              gap: 8,
              borderTop: "1px solid rgba(0,0,0,0.06)",
              background: "rgba(255,255,255,0.92)",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a message…"
              rows={1}
              style={{
                flex: 1,
                resize: "none",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
                padding: "10px 10px",
                fontSize: 13,
                outline: "none",
                background: "white",
              }}
            />
            <button
              type="button"
              onClick={send}
              disabled={sending || !String(input).trim()}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "none",
                background: sending || !String(input).trim() ? "rgba(164,0,93,0.35)" : "var(--brand)",
                color: "white",
                fontWeight: 600,
                fontSize: 13,
                cursor: sending || !String(input).trim() ? "not-allowed" : "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{
          width: 56,
          height: 56,
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(90deg, var(--brand), var(--brand-soft))",
          color: "white",
          boxShadow: "0 12px 28px rgba(164,0,93,0.16)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        Chat
      </button>
    </div>
  );
}
