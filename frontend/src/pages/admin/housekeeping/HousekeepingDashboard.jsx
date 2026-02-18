import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import {
  acceptHousekeepingRequest,
  completeHousekeepingRequest,
  getHousekeepingRequestsAdmin,
} from "../../../services/housekeeping.service";

const formatDateTime = (value) => {
  try {
    const d = new Date(value);
    return d.toLocaleString();
  } catch {
    return "";
  }
};

const StatusPill = ({ status }) => {
  const styles =
    status === "pending"
      ? { bg: "#fef3c7", text: "#92400e" }
      : status === "accepted"
      ? { bg: "#dbeafe", text: "#1e40af" }
      : { bg: "#d1fae5", text: "#065f46" };

  return (
    <span
      className="text-xs font-semibold px-3 py-1 rounded-full"
      style={{ backgroundColor: styles.bg, color: styles.text }}
    >
      {String(status || "pending").toUpperCase()}
    </span>
  );
};

export default function HousekeepingDashboard() {
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState([]);

  const statusParam = useMemo(() => {
    if (!status || status === "all") return undefined;
    return status;
  }, [status]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHousekeepingRequestsAdmin({ status: statusParam });
      setRequests(data?.requests || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusParam]);

  const accept = async (id) => {
    setUpdatingId(id);
    setError(null);
    try {
      await acceptHousekeepingRequest(id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to accept request");
    } finally {
      setUpdatingId(null);
    }
  };

  const complete = async (id) => {
    setUpdatingId(id);
    setError(null);
    try {
      await completeHousekeepingRequest(id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to complete request");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Housekeeping Requests
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Filter by status and update request progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-black/10 bg-[var(--bg-secondary)]"
          >
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
            <option value="all">All</option>
          </select>

          <button
            onClick={load}
            className="text-sm px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "rgba(0,0,0,0.08)",
              color: "var(--text-primary)",
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl">Loading…</div>
      ) : requests.length === 0 ? (
        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl text-[var(--text-muted)]">
          No requests.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div
              key={r._id}
              className="bg-[var(--bg-secondary)] p-5 rounded-xl shadow-sm border border-black/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg text-[var(--text-primary)]">
                    Room {r.roomNumber}
                  </h3>
                  <div className="text-xs text-[var(--text-muted)]">
                    {formatDateTime(r.createdAt)}
                  </div>
                </div>
                <StatusPill status={r.status} />
              </div>

              <div className="mt-3 text-sm text-[var(--text-muted)]">
                {(r.items || []).map((it) => `${it.quantity} × ${it.name}`).join(", ")}
              </div>

              {r.note ? (
                <div className="mt-2 text-sm">
                  <span className="font-medium text-[var(--text-primary)]">Note:</span>{" "}
                  <span className="text-[var(--text-muted)]">{r.note}</span>
                </div>
              ) : null}

              <div className="mt-4 flex gap-2">
                {r.status === "pending" && (
                  <button
                    onClick={() => accept(r._id)}
                    disabled={updatingId === r._id}
                    className="text-sm px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
                    style={{ backgroundColor: "var(--brand)", color: "white" }}
                  >
                    {updatingId === r._id ? "Accepting..." : "Accept"}
                  </button>
                )}

                {r.status === "accepted" && (
                  <button
                    onClick={() => complete(r._id)}
                    disabled={updatingId === r._id}
                    className="text-sm px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
                    style={{ backgroundColor: "var(--brand)", color: "white" }}
                  >
                    {updatingId === r._id ? "Completing..." : "Mark Completed"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
