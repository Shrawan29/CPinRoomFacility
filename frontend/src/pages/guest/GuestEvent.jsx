import { useEffect, useState } from "react";
import { getGuestEvents } from "../../services/event.service";
import GuestHeader from "../../components/guest/GuestHeader";

export default function GuestEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      <div className="px-4 py-4">
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
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-sm p-4"
            >
              <h2 className="font-semibold text-lg text-[var(--text-primary)]">
                {event.title}
              </h2>

              <p className="text-sm text-[var(--text-muted)] mt-1">
                📍 {event.location || "Hotel Premises"}
              </p>

              <p className="text-sm text-[var(--text-muted)]">
                📅 {new Date(event.eventDate).toDateString()}
              </p>

              {event.description && (
                <p className="text-sm mt-2 text-[var(--text-primary)]">
                  {event.description}
                </p>
              )}

              {event.contact && (
                <p className="text-sm mt-2 text-[var(--text-muted)]">
                  📞 Contact: <span className="font-semibold text-[var(--text-primary)]">{event.contact}</span>
                </p>
              )}

              {event.link && (
                <p className="text-sm mt-2">
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-white px-3 py-1 rounded-lg font-semibold"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    🔗 More Info
                  </a>
                </p>
              )}

              <span
                className="inline-block mt-3 text-xs px-3 py-1 rounded-full"
                style={{
                  backgroundColor:
                    event.status === "ACTIVE"
                      ? "var(--brand)"
                      : "var(--bg-secondary)",
                  color:
                    event.status === "ACTIVE"
                      ? "white"
                      : "var(--text-muted)",
                }}
              >
                {event.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}