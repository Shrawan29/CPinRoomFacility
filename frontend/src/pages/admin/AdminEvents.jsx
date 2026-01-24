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
  const handleSubmit = async (e) => {
    e.preventDefault();
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
        status: "UPCOMING",
      });

      loadEvents();
    } catch {
      setError("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 Change status */
  const changeStatus = async (id, status) => {
    await updateEvent(id, { status });
    loadEvents();
  };

  /* 🔹 Delete */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await deleteEvent(id);
    loadEvents();
  };

  return (
    <AdminLayout>

      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Events Management
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Create and manage hotel events
        </p>
      </div>

      {/* ADD EVENT CARD */}
      <div className="bg-[var(--bg-secondary)] rounded-xl shadow-sm p-6 max-w-xl mb-8">

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm mb-1">Event Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Event Date</label>
            <input
              type="date"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="e.g. Rooftop / Banquet Hall"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-[var(--brand)]
              text-white
              py-2
              rounded-lg
              font-medium
              hover:opacity-90
              disabled:opacity-60
            "
          >
            {loading ? "Adding Event..." : "Add Event"}
          </button>
        </form>
      </div>

      {/* EVENT LIST */}
      <div className="space-y-4 max-w-4xl">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-start"
          >
            <div>
              <h2 className="font-semibold text-[var(--text-primary)]">
                {event.title}
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                {event.location || "—"} •{" "}
                {new Date(event.eventDate).toDateString()}
              </p>
              <span className="text-xs mt-1 inline-block px-2 py-1 rounded-full bg-black/5">
                {event.status}
              </span>
            </div>

            <div className="space-x-2">
              {["UPCOMING", "ACTIVE", "COMPLETED"].map((s) => (
                <button
                  key={s}
                  onClick={() => changeStatus(event._id, s)}
                  className="text-xs px-2 py-1 border rounded"
                >
                  {s}
                </button>
              ))}
              <button
                onClick={() => handleDelete(event._id)}
                className="text-red-600 text-xs ml-2"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">
            No events created yet
          </p>
        )}
      </div>

    </AdminLayout>
  );
}