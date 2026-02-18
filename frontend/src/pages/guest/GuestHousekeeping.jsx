import { useEffect, useMemo, useState } from "react";
import GuestHeader from "../../components/guest/GuestHeader";
import {
  createHousekeepingRequest,
  getHousekeepingRequests,
} from "../../services/housekeeping.service";

const ITEM_NAMES = [
  "Towel",
  "Shampoo",
  "Soap",
  "Bedsheet",
  "Water Bottle",
  "Room Cleaning",
];

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

export default function GuestHousekeeping() {
  const [quantities, setQuantities] = useState(() => {
    const init = {};
    for (const name of ITEM_NAMES) init[name] = 0;
    return init;
  });
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const itemsPayload = useMemo(() => {
    return ITEM_NAMES.map((name) => ({ name, quantity: Number(quantities[name] || 0) }))
      .filter((i) => i.quantity > 0)
      .map((i) => ({ name: i.name, quantity: Math.min(5, Math.max(1, i.quantity)) }));
  }, [quantities]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHousekeepingRequests();
      setRequests(data?.requests || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // no auto-refresh; keep minimal
  }, []);

  const onChangeQty = (name, value) => {
    const parsed = Number.parseInt(String(value || "0"), 10);
    const qty = Number.isFinite(parsed) ? parsed : 0;
    setQuantities((prev) => ({ ...prev, [name]: Math.max(0, Math.min(5, qty)) }));
  };

  const submit = async () => {
    setError(null);
    setSuccess(null);

    if (itemsPayload.length === 0) {
      setError("Select at least one item with quantity (1-5). ");
      return;
    }

    setSubmitting(true);
    try {
      await createHousekeepingRequest({ items: itemsPayload, note });
      setSuccess("Request created successfully.");
      setNote("");
      setQuantities(() => {
        const init = {};
        for (const n of ITEM_NAMES) init[n] = 0;
        return init;
      });
      await load();
    } catch (e) {
      const apiMsg = e?.response?.data?.message;
      const violations = e?.response?.data?.violations;
      if (violations && Array.isArray(violations) && violations.length > 0) {
        setError(
          `${apiMsg || "Daily limit exceeded"}. ` +
            violations
              .map(
                (v) =>
                  `${v.name}: already ${v.alreadyRequestedToday}, requested ${v.requestedNow} (max ${v.limit})`,
              )
              .join(" | "),
        );
      } else {
        setError(apiMsg || "Failed to create request");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <GuestHeader />

      <div className="px-4 py-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            🧹 Housekeeping
          </h1>
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

        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5">
          <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            Create request
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ITEM_NAMES.map((name) => (
              <div key={name} className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {name}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Max 5 per day
                  </div>
                </div>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={quantities[name]}
                  onChange={(e) => onChangeQty(name, e.target.value)}
                  className="w-20 px-3 py-2 rounded-lg border border-black/10"
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="mt-2 w-full px-3 py-2 rounded-lg border border-black/10"
              placeholder="Any special instructions"
              maxLength={500}
            />
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {note.length}/500
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              onClick={submit}
              disabled={submitting}
              className="text-sm px-5 py-2.5 rounded-lg font-semibold disabled:opacity-60"
              style={{ backgroundColor: "var(--brand)", color: "white" }}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            My requests
          </h2>

          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5">
              Loading…
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 text-sm" style={{ color: "var(--text-muted)" }}>
              No housekeeping requests yet.
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((r) => (
                <div
                  key={r._id}
                  className="bg-white rounded-2xl shadow-sm border border-black/5 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        Request #{String(r._id).slice(-6)}
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {formatDateTime(r.createdAt)}
                      </div>
                    </div>
                    <StatusPill status={r.status} />
                  </div>

                  <div className="mt-3">
                    <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      Items
                    </div>
                    <div className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                      {(r.items || []).map((it) => `${it.quantity} × ${it.name}`).join(", ")}
                    </div>
                  </div>

                  {r.note ? (
                    <div className="mt-3">
                      <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        Note
                      </div>
                      <div className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                        {r.note}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
