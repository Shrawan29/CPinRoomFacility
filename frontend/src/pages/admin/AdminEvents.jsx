import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getEvents,
  createEvent,
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
    eventTime: "",
    location: "",
    contact: "",
    link: "",
    status: "UPCOMING",
  });

  // Helper function to format date as DD/MM/YYYY
  const formatDateDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to convert DD/MM/YYYY to YYYY-MM-DD format
  const convertDDMMYYYYToYYYYMMDD = (ddmmyyyy) => {
    const parts = ddmmyyyy.split('/');
    if (parts.length !== 3) return '';
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    if (day.length !== 2 || month.length !== 2 || year.length !== 4) return '';
    return `${year}-${month}-${day}`;
  };

  // Helper function to convert YYYY-MM-DD to DD/MM/YYYY
  const convertYYYYMMDDToDDMMYYYY = (yyyymmdd) => {
    const parts = yyyymmdd.split('-');
    if (parts.length !== 3) return '';
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const handleEventDateChange = (e) => {
    const inputValue = e.target.value;
    // Allow both DD/MM/YYYY and numbers
    const cleaned = inputValue.replace(/[^\d/]/g, '');
    
    // Auto-format as user types DD/MM/YYYY
    let formatted = cleaned;
    if (cleaned.length >= 2 && cleaned.length <= 4) {
      formatted = cleaned.slice(0, 2) + (cleaned.length > 2 ? '/' + cleaned.slice(2) : '');
    } else if (cleaned.length >= 5) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + (cleaned.length > 4 ? '/' + cleaned.slice(4, 8) : '');
    }
    
    // If we have a complete date, convert to YYYY-MM-DD format for storage
    if (formatted.length === 10) {
      const converted = convertDDMMYYYYToYYYYMMDD(formatted);
      if (converted) {
        setForm({ ...form, eventDate: converted });
      }
    } else {
      // Store the formatted input temporarily
      setForm({ ...form, eventDate: formatted });
    }
  };

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
        eventTime: "",
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

        <div className="grid lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
          {/* ADD EVENT CARD */}
          <div className="lg:col-span-1 overflow-hidden">
            <div className="bg-[var(--bg-secondary)] bg-opacity-50 rounded-xl shadow-sm p-4 -y-auto">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                Add New Event
              </h2>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-base font-medium text-[var(--text-primary)] mb-1">
                      Event Title *
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full text-base border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
                      placeholder="Enter event title"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-medium text-[var(--text-primary)] mb-1">
                      Event Date * (DD/MM/YYYY)
                    </label>
                    <DatePicker
                      selected={form.eventDate ? new Date(form.eventDate) : null}
                      onChange={(date) => {
                        if (date) {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          setForm({ ...form, eventDate: `${year}-${month}-${day}` });
                        }
                      }}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="DD/MM/YYYY"
                      className="w-full text-base border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
                      calendarClassName="shadow-lg rounded-lg"
                      wrapperClassName="w-full"
                    />
                    {form.eventDate && form.eventDate.includes('-') && (
                      <p className="text-xs text-[var(--text-muted)] mt-1 font-semibold">
                        ✓ Selected: {formatDateDDMMYYYY(form.eventDate)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Event Time
                    </label>
                    <input
                      type="time"
                      value={form.eventTime}
                      onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
                      className="w-full text-base border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Location
                    </label>
                    <input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full text-base border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
                      placeholder="e.g. Rooftop / Banquet Hall"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Contact Information
                    </label>
                    <input
                      value={form.contact}
                      onChange={(e) => setForm({ ...form, contact: e.target.value })}
                      className="w-full text-base border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
                      placeholder="e.g. +91-9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    More Info Link
                  </label>
                  <input
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="w-full text-base border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
                    placeholder="e.g. https://example.com/event-details"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full text-base border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition resize-none"
                    rows={2}
                    placeholder="Event details and description..."
                  />
                </div>

                

                <button
                  onClick={submitEvent}
                  disabled={loading}
                  className="
                    w-full
                    bg-[var(--brand)]
                    text-white
                    py-2
                    rounded-lg
                    font-semibold
                    text-sm
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
          <div className="lg:col-span-1 overflow-y-auto h-full">
            <div className="flex items-center justify-between mb-6">
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
                              📅 {formatDateDDMMYYYY(event.eventDate)} {event.eventTime && `@ ${event.eventTime}`}
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

                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 justify-between">
                        <p className="text-xs text-[var(--text-muted)]">
                          📝 Status updates automatically based on event date
                        </p>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="text-xs px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md font-medium transition-all"
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