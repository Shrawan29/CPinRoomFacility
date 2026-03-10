import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import api from "../../../services/api";

const hoursSince = (isoDate) => {
  const started = isoDate ? new Date(isoDate).getTime() : NaN;
  if (!Number.isFinite(started)) return "—";
  const hours = (Date.now() - started) / (1000 * 60 * 60);
  if (!Number.isFinite(hours) || hours < 0) return "—";
  return hours.toFixed(1);
};

export default function ActiveGuestSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/dashboard/guests");
        if (cancelled) return;
        setSessions(Array.isArray(res.data) ? res.data : []);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err?.response?.data?.message || "Failed to load active sessions");
        setSessions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    const copy = Array.isArray(sessions) ? [...sessions] : [];
    copy.sort((a, b) => String(a?.roomNumber || "").localeCompare(String(b?.roomNumber || ""), "en", { numeric: true }));
    return copy;
  }, [sessions]);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-(--text-primary)">Active Guest Sessions</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-(--bg-secondary) text-sm text-(--text-primary)"
        >
          Refresh
        </button>
      </div>

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
                  <th className="text-left px-5 py-3 font-semibold text-(--text-primary)">Active For (hrs)</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-6 text-(--text-muted)">
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
                        {hoursSince(s?.createdAt)}
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
