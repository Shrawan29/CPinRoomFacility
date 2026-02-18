import { useEffect, useState } from "react";
import { getGuestEvents } from "../../services/event.service";
import GuestHeader from "../../components/guest/GuestHeader";
import { Link } from "react-router-dom";

export default function GuestEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to format date as DD/MM/YYYY
  const formatDateDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to get status color
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

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getGuestEvents();
        setEvents(data);
      } catch {
        setError("Unable to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* HEADER */}
      <GuestHeader />

      <div className="px-4 py-4 max-w-xl mx-auto">
        {/* PAGE TITLE */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            🎉 Hotel Events
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            What's happening during your stay
          </p>
        </div>

      {/* STATES */}
        {/* STATES */}
        {loading && (
          <p className="text-sm text-[var(--text-muted)]">Loading events…</p>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {!loading && events.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">
            No upcoming events right now
          </p>
        )}

        {/* EVENTS LIST */}
        <div className="space-y-4 mt-4">
          {events.map((event) => (
            <Link
              key={event._id}
              to={`/guest/events/${event._id}`}
              className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden block"
            >
              {event.image ? (
                <div
                  className="w-full bg-[var(--bg-secondary)]"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div
                  className="w-full bg-[var(--bg-secondary)] flex items-center justify-center text-sm text-[var(--text-muted)]"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  No image
                </div>
              )}

              <div className="p-4">
                <div className="flex justify-between items-start gap-3">
                  <h2 className="font-semibold text-lg text-[var(--text-primary)] leading-snug">
                    {event.title}
                  </h2>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full border whitespace-nowrap ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {event.status}
                  </span>
                </div>

                <div className="mt-2 text-sm text-[var(--text-muted)] space-y-1">
                  <div>📍 {event.location || "Hotel Premises"}</div>
                  <div>
                    📅 {formatDateDDMMYYYY(event.eventDate)}{" "}
                    {event.eventTime && `@ ${event.eventTime}`}
                  </div>
                </div>

                {event.description ? (
                  <p className="mt-3 text-sm text-[var(--text-primary)] opacity-80 line-clamp-2">
                    {event.description}
                  </p>
                ) : null}

                <div
                  className="mt-4 text-sm font-semibold"
                  style={{ color: "var(--brand)" }}
                >
                  View details
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}