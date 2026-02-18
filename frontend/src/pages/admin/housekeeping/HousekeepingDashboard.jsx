import { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import {
  acceptHousekeepingRequest,
  completeHousekeepingRequest,
  getHousekeepingRequestsAdmin,
} from "../../../services/housekeeping.service";
import notificationSound from "../../../assets/notification.mp3";

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
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState([]);

  const audioRef = useRef(null);
  const didInitRef = useRef(false);
  const lastPendingIdsRef = useRef(new Set());
  const audioPrimedRef = useRef(false);

  const statusParam = useMemo(() => status, [status]);

  const primeAudioOnce = async () => {
    if (audioPrimedRef.current) return;
    audioPrimedRef.current = true;

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(notificationSound);
      }
      const audio = audioRef.current;
      audio.muted = false;
      audio.volume = 0.05;
      audio.currentTime = 0;

      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => {
            setTimeout(() => {
              try {
                audio.pause();
                audio.currentTime = 0;
              } catch {
                // ignore
              }
            }, 50);
          })
          .catch((e) => {
            console.debug("[Housekeeping] Audio prime failed", e);
          });
      }
    } catch (e) {
      // Autoplay policies vary; real notifications will still attempt to play.
      console.debug("[Housekeeping] Audio prime failed", e);
    }
  };

  const playNotification = async () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(notificationSound);
      }
      audioRef.current.muted = false;
      audioRef.current.volume = 1;
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch((e) => {
          console.debug("[Housekeeping] Notification sound blocked", e);
        });
      }
    } catch (e) {
      // Some browsers block autoplay until user interaction.
      console.debug("[Housekeeping] Notification sound blocked", e);
    }
  };

  const load = async ({ showLoading } = {}) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const data = await getHousekeepingRequestsAdmin({ status: statusParam });
      const nextRequests = data?.requests || [];
      setRequests(nextRequests);

      // Notify on *new* pending requests after first successful load.
      const nextPendingIds = new Set(
        nextRequests.filter((r) => r.status === "pending").map((r) => r._id)
      );

      if (didInitRef.current) {
        for (const id of nextPendingIds) {
          if (!lastPendingIdsRef.current.has(id)) {
            await playNotification();
            break;
          }
        }
      }

      lastPendingIdsRef.current = nextPendingIds;
      didInitRef.current = true;
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load requests");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    const onFirstInteraction = () => {
      primeAudioOnce();
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };

    window.addEventListener("pointerdown", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);

    didInitRef.current = false;
    lastPendingIdsRef.current = new Set();
    setLoading(true);
    load({ showLoading: true });

    const intervalMs = 5000;
    const interval = setInterval(() => {
      load({ showLoading: false });
    }, intervalMs);

    return () => {
      clearInterval(interval);
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, [statusParam]);

  const accept = async (id) => {
    setUpdatingId(id);
    setError(null);
    try {
      await acceptHousekeepingRequest(id);
      await load({ showLoading: false });
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
      await load({ showLoading: false });
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
            Pending/accepted requests show here; completed requests are in history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-black/10 bg-[var(--bg-secondary)]"
          >
            <option value="active">Active (Pending + Accepted)</option>
            <option value="completed">History (Completed)</option>
          </select>
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
