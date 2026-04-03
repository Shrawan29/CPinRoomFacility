import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import notificationSound from "../../../assets/notification.mp3";
import {
  acceptHousekeepingRequest,
  assignHousekeepingRequest,
  completeHousekeepingRequest,
  getHousekeepingRequestsAdmin,
  getHousekeepingTeam,
  markHousekeepingRequestInProgress,
} from "../../../services/housekeeping.service";

const formatDateTime = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "-";
  }
};

const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-blue-100 text-blue-800",
  in_progress: "bg-violet-100 text-violet-800",
  completed: "bg-emerald-100 text-emerald-800",
};

const canAssignRole = (role) =>
  ["SUPER_ADMIN", "HOUSEKEEPING_ADMIN", "HOUSEKEEPING_SUPERVISOR"].includes(
    role
  );

const canAcceptRole = (role) =>
  ["SUPER_ADMIN", "HOUSEKEEPING_ADMIN", "HOUSEKEEPING_SUPERVISOR"].includes(
    role
  );

const canInProgressRole = (role) =>
  [
    "SUPER_ADMIN",
    "HOUSEKEEPING_ADMIN",
    "HOUSEKEEPING_SUPERVISOR",
    "HOUSEKEEPING_STAFF",
  ].includes(role);

const canCompleteRole = canInProgressRole;

export default function SupervisorMobileDashboard() {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();

  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [team, setTeam] = useState([]);
  const [error, setError] = useState("");
  const [actionBusyKey, setActionBusyKey] = useState("");
  const [assignmentDrafts, setAssignmentDrafts] = useState({});

  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState(null);

  const audioRef = useRef(null);
  const knownPendingIdsRef = useRef(new Set());
  const firstLoadDoneRef = useRef(false);

  const staffMembers = useMemo(
    () => team.filter((member) => member.role === "HOUSEKEEPING_STAFF"),
    [team]
  );

  const canAssign = canAssignRole(admin?.role);
  const canAccept = canAcceptRole(admin?.role);
  const canInProgress = canInProgressRole(admin?.role);
  const canComplete = canCompleteRole(admin?.role);
  const isHousekeepingAdmin = admin?.role === "HOUSEKEEPING_ADMIN";

  const playNotification = async () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(notificationSound);
      }
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
    } catch {
      // Ignore autoplay restrictions for mobile browsers.
    }
  };

  const notifyNewRequest = async (request) => {
    await playNotification();

    if (!notificationEnabled || typeof window === "undefined" || !window.Notification) {
      return;
    }

    if (Notification.permission !== "granted") return;

    const itemSummary = (request.items || [])
      .map((item) => `${item.quantity} x ${item.name}`)
      .join(", ");

    const body = itemSummary
      ? `Room ${request.roomNumber} requested: ${itemSummary}`
      : `Room ${request.roomNumber} has a housekeeping request.`;

    const notification = new Notification("New Housekeeping Request", {
      body,
      icon: "/logo.png",
      tag: `housekeeping-${request._id}`,
    });

    setTimeout(() => notification.close(), 8_000);
  };

  const enableNotifications = async () => {
    if (typeof window === "undefined" || !window.Notification) return;

    const permission = await Notification.requestPermission();
    setNotificationEnabled(permission === "granted");
  };

  const loadDashboard = async ({ showLoader = false } = {}) => {
    if (showLoader) setLoading(true);
    setError("");

    try {
      const [requestData, teamData] = await Promise.all([
        getHousekeepingRequestsAdmin({ status }),
        getHousekeepingTeam(),
      ]);

      const nextRequests = requestData?.requests || [];
      const nextTeam = teamData?.team || [];

      setRequests(nextRequests);
      setTeam(nextTeam);

      const nextPendingIds = new Set(
        nextRequests.filter((request) => request.status === "pending").map((request) => request._id)
      );

      if (firstLoadDoneRef.current) {
        for (const request of nextRequests) {
          if (request.status !== "pending") continue;
          if (!knownPendingIdsRef.current.has(request._id)) {
            await notifyNewRequest(request);
            break;
          }
        }
      }

      knownPendingIdsRef.current = nextPendingIds;
      firstLoadDoneRef.current = true;
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to load supervisor dashboard");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard({ showLoader: true });

    const interval = setInterval(() => {
      loadDashboard({ showLoader: false });
    }, 5_000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.Notification) return;
    setNotificationEnabled(Notification.permission === "granted");
  }, []);

  const runAction = async (key, handler) => {
    setActionBusyKey(key);
    setError("");
    try {
      await handler();
      await loadDashboard({ showLoader: false });
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Request update failed");
    } finally {
      setActionBusyKey("");
    }
  };

  const handleAssign = async (requestId) => {
    const assignedStaffId = assignmentDrafts[requestId] || null;
    await runAction(`assign-${requestId}`, async () => {
      await assignHousekeepingRequest(requestId, { assignedStaffId });
    });
  };

  const handleInstallApp = async () => {
    if (!installPromptEvent) return;
    await installPromptEvent.prompt();
    await installPromptEvent.userChoice;
    setInstallPromptEvent(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="sticky top-0 z-20 bg-[var(--brand)] text-white px-4 py-3 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">
              {isHousekeepingAdmin ? "Escalated Housekeeping" : "Supervisor Dashboard"}
            </h1>
            <p className="text-xs opacity-85">{admin?.name || "Housekeeping"}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-white/30 px-3 py-1 text-xs font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="px-4 py-4 pb-28 space-y-4">
        <section className="bg-[var(--bg-secondary)] rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <button
              type="button"
              onClick={enableNotifications}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
            >
              {notificationEnabled ? "Notifications On" : "Enable Notifications"}
            </button>

            <button
              type="button"
              onClick={handleInstallApp}
              disabled={!installPromptEvent}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm disabled:opacity-50"
            >
              {installPromptEvent ? "Install App" : "Install Unavailable"}
            </button>

            {admin?.role === "HOUSEKEEPING_ADMIN" && (
              <Link
                to="/admin/housekeeping"
                className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
              >
                Open Admin View
              </Link>
            )}
          </div>

          {!installPromptEvent && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              If install is unavailable, open browser menu and choose Add to Home screen.
            </p>
          )}

          {isHousekeepingAdmin && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Housekeeping admin sees requests only after supervisor escalation.
            </p>
          )}
        </section>

        {error && (
          <section className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </section>
        )}

        {loading ? (
          <section className="rounded-xl bg-[var(--bg-secondary)] px-4 py-5 text-sm text-[var(--text-muted)]">
            Loading requests...
          </section>
        ) : requests.length === 0 ? (
          <section className="rounded-xl bg-[var(--bg-secondary)] px-4 py-5 text-sm text-[var(--text-muted)]">
            No housekeeping requests.
          </section>
        ) : (
          requests.map((request) => {
            const statusClass = statusStyles[request.status] || "bg-gray-100 text-gray-700";
            const assignBusy = actionBusyKey === `assign-${request._id}`;
            const acceptBusy = actionBusyKey === `accept-${request._id}`;
            const progressBusy = actionBusyKey === `progress-${request._id}`;
            const completeBusy = actionBusyKey === `complete-${request._id}`;

            return (
              <article
                key={request._id}
                className="rounded-2xl bg-[var(--bg-secondary)] p-4 shadow-sm border border-black/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-[var(--text-primary)]">
                      Room {request.roomNumber}
                    </h2>
                    <p className="text-xs text-[var(--text-muted)]">Created: {formatDateTime(request.createdAt)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
                    {String(request.status || "pending").toUpperCase()}
                  </span>
                </div>

                <p className="mt-2 text-sm text-[var(--text-primary)]">
                  {(request.items || []).map((item) => `${item.quantity} x ${item.name}`).join(", ") || "Service request"}
                </p>

                {request.note ? (
                  <p className="mt-1 text-xs text-[var(--text-muted)]">Note: {request.note}</p>
                ) : null}

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--text-muted)]">
                  <div>Floor: {request.roomFloor ?? "-"}</div>
                  <div>Call Attempts: {request.callAttemptCount ?? 0}</div>
                  <div>Notified: {formatDateTime(request.notifiedAt)}</div>
                  <div>Accepted: {formatDateTime(request.acceptedAt)}</div>
                  <div>Escalated: {formatDateTime(request.escalatedAt)}</div>
                  <div>Assigned Supervisor: {request.assignedSupervisorId?.name || "-"}</div>
                  <div>Assigned Staff: {request.assignedStaffId?.name || "-"}</div>
                  <div>Accepted By: {request.acceptedByAdminId?.name || "-"}</div>
                </div>

                {canAssign && request.status !== "completed" && (
                  <div className="mt-3 rounded-xl border border-black/10 bg-white p-3">
                    <label className="mb-1 block text-xs font-medium text-[var(--text-primary)]">
                      Assign housekeeping staff
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        className="flex-1 rounded-lg border border-black/10 px-2 py-2 text-sm"
                        value={assignmentDrafts[request._id] ?? request.assignedStaffId?._id ?? ""}
                        onChange={(event) =>
                          setAssignmentDrafts((prev) => ({
                            ...prev,
                            [request._id]: event.target.value,
                          }))
                        }
                      >
                        <option value="">Unassigned</option>
                        {staffMembers.map((member) => (
                          <option key={member._id} value={member._id}>
                            {member.name}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleAssign(request._id)}
                        disabled={assignBusy}
                        className="rounded-lg bg-[var(--brand)] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        {assignBusy ? "Saving..." : "Assign"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {request.status === "pending" && canAccept && (
                    <button
                      type="button"
                      onClick={() =>
                        runAction(`accept-${request._id}`, async () => {
                          await acceptHousekeepingRequest(request._id);
                        })
                      }
                      disabled={acceptBusy}
                      className="rounded-lg bg-[var(--brand)] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {acceptBusy ? "Accepting..." : "Accept"}
                    </button>
                  )}

                  {request.status === "accepted" && canInProgress && (
                    <button
                      type="button"
                      onClick={() =>
                        runAction(`progress-${request._id}`, async () => {
                          await markHousekeepingRequestInProgress(request._id);
                        })
                      }
                      disabled={progressBusy}
                      className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {progressBusy ? "Updating..." : "Mark In Progress"}
                    </button>
                  )}

                  {["accepted", "in_progress"].includes(request.status) && canComplete && (
                    <button
                      type="button"
                      onClick={() =>
                        runAction(`complete-${request._id}`, async () => {
                          await completeHousekeepingRequest(request._id);
                        })
                      }
                      disabled={completeBusy}
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {completeBusy ? "Completing..." : "Complete"}
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </main>
    </div>
  );
}
