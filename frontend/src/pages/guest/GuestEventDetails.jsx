import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GuestHeader from "../../components/guest/GuestHeader";
import { getGuestEventById } from "../../services/event.service";

const formatDateDDMMYYYY = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getStatusColor = (status) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-700 border-green-200";
    case "UPCOMING":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function GuestEventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const eventId = useMemo(() => String(id || ""), [id]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getGuestEventById(eventId);
        setEvent(data);
      } catch (e) {
        setError(e?.response?.data?.message || "Unable to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      load();
    } else {
      setLoading(false);
      setError("Invalid event");
    }
  }, [eventId]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <GuestHeader />

      <div className="px-4 py-4">
        <div className="mb-4">
          <Link
            to="/guest/events"
            className="text-sm font-semibold"
            style={{ color: "var(--brand)" }}
          >
            ← Back to events
          </Link>
        </div>

        {loading && <p className="text-sm text-[var(--text-muted)]">Loading…</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {!loading && !error && event && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="w-full max-h-64 object-cover rounded-lg mb-4"
              />
            ) : null}

            <div className="flex justify-between items-start gap-3 mb-2">
              <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                {event.title}
              </h1>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full border whitespace-nowrap ${getStatusColor(
                  event.status
                )}`}
              >
                {event.status}
              </span>
            </div>

            <p className="text-sm text-[var(--text-muted)] mt-1">
              📍 {event.location || "Hotel Premises"}
            </p>

            <p className="text-sm text-[var(--text-muted)]">
              📅 {formatDateDDMMYYYY(event.eventDate)} {event.eventTime && `@ ${event.eventTime}`}
            </p>

            {event.description ? (
              <div className="mt-4">
                <div className="text-sm font-semibold text-[var(--text-primary)]">Details</div>
                <div className="text-sm text-[var(--text-primary)] mt-1 whitespace-pre-wrap">
                  {event.description}
                </div>
              </div>
            ) : null}

            {event.contact ? (
              <p className="text-sm mt-4 text-[var(--text-muted)]">
                📞 Contact: {" "}
                <span className="font-semibold text-[var(--text-primary)]">{event.contact}</span>
              </p>
            ) : null}

            {event.link ? (
              <div className="mt-4">
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white px-3 py-2 rounded-lg font-semibold"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  🔗 More Info
                </a>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
