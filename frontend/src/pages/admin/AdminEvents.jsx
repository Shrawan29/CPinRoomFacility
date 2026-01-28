import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../services/event.service";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    contact: "",
    link: "",
    status: "UPCOMING",
  });

  /* 🔹 Load events */
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch {
      setError("Failed to load events");
    }
  };

  /* 🔹 Add event */
  const handleSubmit = (e) => {
    e.preventDefault();
    submitEvent();
  };

  const submitEvent = async () => {
    setError("");
    setMessage("");

    if (!form.title || !form.eventDate) {
      setError("Title and Event Date are required");
      return;
    }

    try {
      setLoading(true);
      await createEvent(form);

      setMessage("Event added successfully");
      setForm({
        title: "",
        description: "",
        eventDate: "",
        location: "",
        contact: "",
        link: "",
        status: "UPCOMING",
      });

      loadEvents();
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setError("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 Change status */
  const changeStatus = async (id, status) => {
    try {
      await updateEvent(id, { status });
      loadEvents();
      setMessage("Status updated successfully");
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setError("Failed to update status");
    }
  };

  /* 🔹 Delete */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      loadEvents();
      setMessage("Event deleted successfully");
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setError("Failed to delete event");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "ACTIVE":
        return "bg-green-100 text-green-700 border-green-200";
      case "COMPLETED":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto h-screen flex flex-col overflow-hidden">
        {/* PAGE HEADER */}
        <div className="mb-4 shrink-0">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Events Management
          </h1>
          <p className="text-[var(--text-muted)] mt-2">
            Create and manage hotel events and activities
          </p>
        </div>

        {/* NOTIFICATIONS */}
        <div className="shrink-0">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError("")} className="text-red-500 hover:text-red-700">
                ✕
              </button>
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <span>{message}</span>
              <button onClick={() => setMessage("")} className="text-green-500 hover:text-green-700">
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
          {/* ADD EVENT CARD */}
          <div className="lg:col-span-1 overflow-y-auto">
            <div className="bg-[var(--bg-secondary)] rounded-xl shadow-sm p-6 sticky top-0">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
                Add New Event
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Event Title *
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
                      placeholder="Enter event title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Location
                    </label>
                    <input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
                      placeholder="e.g. Rooftop / Banquet Hall"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Contact Information
                    </label>
                    <input
                      value={form.contact}
                      onChange={(e) => setForm({ ...form, contact: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
                      placeholder="e.g. +91-9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    More Info Link
                  </label>
                  <input
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
                    placeholder="e.g. https://example.com/event-details"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition resize-none"
                    rows={3}
                    placeholder="Event details and description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>

                <button
                  onClick={submitEvent}
                  disabled={loading}
                  className="
                    w-full
                    bg-[var(--brand)]
                    text-white
                    py-3
                    rounded-lg
                    font-semibold
                    hover:opacity-90
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    transition-all
                    transform
                    active:scale-95
                  "
                >
                  {loading ? "Adding Event..." : "+ Add Event"}
                </button>
              </div>
            </div>
          </div>

          {/* EVENT LIST */}
          <div className="lg:col-span-2 overflow-y-auto">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white py-2">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                All Events ({events.length})
              </h2>
            </div>

            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-1">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                            <span className="flex items-center gap-1">
                              📍 {event.location || "Location TBD"}
                            </span>
                            <span className="flex items-center gap-1">
                              📅 {new Date(event.eventDate).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>

                      {event.description && (
                        <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      {event.contact && (
                        <p className="text-sm text-[var(--text-muted)] mb-2">
                          📞 Contact: <span className="font-semibold text-[var(--text-primary)]">{event.contact}</span>
                        </p>
                      )}

                      {event.link && (
                        <p className="text-sm mb-3">
                          <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--brand)] font-semibold hover:underline inline-flex items-center gap-1"
                          >
                            🔗 {event.link}
                          </a>
                        </p>
                      )}

                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <span className="text-xs text-[var(--text-muted)] mr-2">
                          Update Status:
                        </span>
                        {["UPCOMING", "ACTIVE", "COMPLETED"].map((s) => (
                          <button
                            key={s}
                            onClick={() => changeStatus(event._id, s)}
                            disabled={event.status === s}
                            className={`
                              text-xs px-3 py-1.5 rounded-md font-medium transition-all
                              ${event.status === s 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[var(--brand)] hover:text-[var(--brand)]'
                              }
                            `}
                          >
                            {s}
                          </button>
                        ))}
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="ml-auto text-xs px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md font-medium transition-all"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {events.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="text-4xl mb-3">📅</div>
                  <p className="text-[var(--text-muted)] font-medium">
                    No events created yet
                  </p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    Create your first event using the form
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}