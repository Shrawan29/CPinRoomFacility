import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import api from "../../../services/api";

const toLocalInputValue = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (!Number.isFinite(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const parseLocalInputValue = (value) => {
  if (!value) return null;
  const d = new Date(String(value));
  return Number.isFinite(d.getTime()) ? d : null;
};

const fmt = (value) => {
  const d = value ? new Date(value) : null;
  if (!d || !Number.isFinite(d.getTime())) return "—";
  return d.toLocaleString();
};

const hoursBetween = (from, to) => {
  const a = from ? new Date(from).getTime() : NaN;
  const b = to ? new Date(to).getTime() : NaN;
  if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) return "—";
  return ((b - a) / (1000 * 60 * 60)).toFixed(1);
};

export default function ActiveGuestSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowMode, setWindowMode] = useState("active");
  const [fromInput, setFromInput] = useState(() => {
    const to = new Date();
    const from = new Date(to.getTime() - 24 * 60 * 60 * 1000);
    return toLocalInputValue(from);
  });
  const [toInput, setToInput] = useState(() => toLocalInputValue(new Date()));
  const [serverFrom, setServerFrom] = useState(null);
  const [serverTo, setServerTo] = useState(null);
  const [serverMode, setServerMode] = useState("");

  const applyPreset = (mode) => {
    const to = new Date();
    const from = new Date(
      to.getTime() - (mode === "week" ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000),
    );
    setFromInput(toLocalInputValue(from));
    setToInput(toLocalInputValue(to));
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const from = parseLocalInputValue(fromInput);
        const to = parseLocalInputValue(toInput);
        const params = {};
        if (windowMode === "active") {
          params.mode = "active";
        } else if (from && to) {
          params.from = from.toISOString();
          params.to = to.toISOString();
        } else {
          params.window = windowMode === "week" ? "week" : "24h";
        }

        const res = await api.get("/admin/dashboard/guests", { params });
        if (cancelled) return;
        const payload = res?.data;
        setServerFrom(payload?.from || null);
        setServerTo(payload?.to || null);
        setSessions(Array.isArray(payload?.sessions) ? payload.sessions : []);
        setError(null);
        setServerMode(typeof payload?.mode === "string" ? payload.mode : "");
      } catch (err) {
        if (cancelled) return;
        setError(err?.response?.data?.message || "Failed to load active sessions");
        setSessions([]);
        setServerFrom(null);
        setServerTo(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [fromInput, toInput, windowMode]);

  const rows = useMemo(() => {
    const copy = Array.isArray(sessions) ? [...sessions] : [];
    copy.sort((a, b) => String(a?.roomNumber || "").localeCompare(String(b?.roomNumber || ""), "en", { numeric: true }));
    return copy;
  }, [sessions]);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-(--text-primary)">Active Guest Sessions</h2>
        <div className="flex items-center gap-3">
          <select
            value={windowMode}
            onChange={(e) => {
              const next = String(e.target.value);
              setWindowMode(next);
              if (next === "week" || next === "24h") {
                applyPreset(next);
              }
            }}
            className="px-3 py-2 rounded-lg bg-(--bg-secondary) text-sm text-(--text-primary)"
          >
            <option value="active">Active now</option>
            <option value="24h">Previous 24 hours</option>
            <option value="week">Previous 7 days</option>
          </select>

          <div className="flex items-center gap-2">
            <label className="text-sm text-(--text-muted)">From</label>
            <input
              type="datetime-local"
              value={fromInput}
              onChange={(e) => setFromInput(e.target.value)}
              className="px-3 py-2 rounded-lg bg-(--bg-secondary) text-sm text-(--text-primary)"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-(--text-muted)">To</label>
            <input
              type="datetime-local"
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              className="px-3 py-2 rounded-lg bg-(--bg-secondary) text-sm text-(--text-primary)"
            />
          </div>
        </div>
      </div>

      {serverFrom && serverTo && (
        <div className="mb-4 text-sm text-(--text-muted)">
          {serverMode === "active" ? (
            <>
              Showing sessions active at <span className="font-medium text-(--text-primary)">{fmt(serverTo)}</span>.
            </>
          ) : (
            <>
              Showing sessions active between <span className="font-medium text-(--text-primary)">{fmt(serverFrom)}</span> and{" "}
              <span className="font-medium text-(--text-primary)">{fmt(serverTo)}</span>.
            </>
          )}
        </div>
      )}

      {loading && (
        <div className="bg-(--bg-secondary) p-6 rounded-xl">Loading sessions…</div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-(--bg-secondary) rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-black/5">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-(--text-primary)">Room</th>
                  <th className="text-left px-5 py-3 font-semibold text-(--text-primary)">Guest Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-(--text-primary)">Active From</th>
                  <th className="text-left px-5 py-3 font-semibold text-(--text-primary)">Active To</th>
                  <th className="text-left px-5 py-3 font-semibold text-(--text-primary)">Duration (hrs)</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-(--text-muted)">
                      No active guest sessions.
                    </td>
                  </tr>
                ) : (
                  rows.map((s) => (
                    <tr key={s?._id || s?.sessionId} className="border-t border-black/5">
                      <td className="px-5 py-3 font-medium text-(--text-primary)">
                        {s?.roomNumber || "—"}
                      </td>
                      <td className="px-5 py-3 text-(--text-primary)">
                        {s?.guestName || "—"}
                      </td>
                      <td className="px-5 py-3 text-(--text-primary)">
                        {fmt(s?.activeFrom || s?.createdAt)}
                      </td>
                      <td className="px-5 py-3 text-(--text-primary)">
                        {fmt(s?.activeTo || s?.authExpiresAt)}
                      </td>
                      <td className="px-5 py-3 text-(--text-primary)">
                        {hoursBetween(s?.activeFrom || s?.createdAt, s?.activeTo || s?.authExpiresAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
