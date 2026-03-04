import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getComplaintsAdmin } from "../../services/complaints.service";

const formatDateTime = (value) => {
  try {
    const d = new Date(value);
    return d.toLocaleString();
  } catch {
    return "";
  }
};

export default function ComplaintsAdmin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [complaints, setComplaints] = useState([]);

  const count = useMemo(() => complaints.length, [complaints.length]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getComplaintsAdmin();
      setComplaints(Array.isArray(data?.complaints) ? data.complaints : []);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Failed to load";
      setError(msg);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Complaints & Feedback</h1>
          <div className="text-sm text-[var(--text-muted)] mt-1">
            {loading ? "Loading…" : `${count} submission${count === 1 ? "" : "s"}`}
          </div>
        </div>

        <button
          type="button"
          onClick={load}
          className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-500">{error}</div>
      )}

      {!loading && complaints.length === 0 && !error && (
        <div className="text-sm text-[var(--text-muted)]">No submissions yet.</div>
      )}

      <div className="space-y-4">
        {complaints.map((c) => (
          <div
            key={c._id}
            className="bg-[var(--bg-secondary)] rounded-xl p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-sm">
                <span className="font-semibold">Room {c.roomNumber}</span>
                <span className="text-[var(--text-muted)]"> · {c.guestName}</span>
              </div>
              <div className="text-xs text-[var(--text-muted)]">{formatDateTime(c.createdAt)}</div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Pill>{c.type}</Pill>
              <Pill>{c.category}</Pill>
            </div>

            <div className="mt-3 font-semibold">{c.subject}</div>
            <div className="mt-2 text-sm text-[var(--text-muted)] whitespace-pre-wrap">{c.message}</div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

function Pill({ children }) {
  return (
    <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10">
      {String(children || "").trim() || "-"}
    </span>
  );
}
