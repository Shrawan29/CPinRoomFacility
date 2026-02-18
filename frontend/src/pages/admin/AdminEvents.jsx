import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../services/event.service";
import { normalizeExternalUrl } from "../../services/url.util";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    eventDate: "",
    eventTime: "",
    location: "",
    contact: "",
    link: "",
    status: "UPCOMING",
  });

  const handleImageFile = (file) => {
    setError("");
    if (!file) {
      setForm({ ...form, image: "" });
      return;
    }

    const maxBytes = 1024 * 1024; // 1MB
    if (file.size > maxBytes) {
      setError("Image too large (max 1MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setForm((prev) => ({ ...prev, image: dataUrl }));
    };
    reader.onerror = () => {
      setError("Failed to read image");
    };
    reader.readAsDataURL(file);
  };

  const updateEventImage = async (eventId, file) => {
    setError("");
    setMessage("");

    if (!file) return;
    const maxBytes = 1024 * 1024; // 1MB
    if (file.size > maxBytes) {
      setError("Image too large (max 1MB)");
      return;
    }

    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      await updateEvent(eventId, { image: dataUrl });
      setMessage("Event image updated");
      loadEvents();
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setError("Failed to update event image");
    }
  };

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
      const payload = {
        ...form,
        link: normalizeExternalUrl(form.link),
      };
      await createEvent(payload);

      setMessage("Event added successfully");
      setForm({
        title: "",
        description: "",
        image: "",
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
      <div className="max-w-6xl mx-auto h-screen flex flex-col overflow-hidden px-2 sm:px-4">
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg mb-4 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError("")} className="text-red-500 hover:text-red-700">
                ✕
              </button>
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-lg mb-4 flex items-center justify-between">
              <span>{message}</span>
              <button onClick={() => setMessage("")} className="text-green-500 hover:text-green-700">
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
          {/* ADD EVENT CARD */}
          <div className="lg:col-span-1 overflow-hidden">
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-black/5 p-6 h-full overflow-y-auto">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                Add New Event
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Title and date are required. Optional image max 1MB.
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-medium text-[var(--text-primary)] mb-1">
                      Event Title *
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full text-base bg-white border border-black/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
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
                      className="w-full text-base bg-white border border-black/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
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
                      className="w-full text-base bg-white border border-black/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Location
                    </label>
                    <input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full text-base bg-white border border-black/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
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
                      className="w-full text-base bg-white border border-black/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
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
                    className="w-full text-base bg-white border border-black/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition"
                    placeholder="e.g. https://example.com/event-details"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Event Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFile(e.target.files?.[0])}
                    className="w-full text-sm"
                  />
                  {form.image ? (
                    <div
                      className="mt-3 w-full rounded-lg border border-black/10 overflow-hidden bg-[var(--bg-secondary)]"
                      style={{ aspectRatio: "16 / 9" }}
                    >
                      <img
                        src={form.image}
                        alt="Event"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null}
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
                    className="w-full text-base bg-white border border-black/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition resize-none"
                    rows={3}
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
                    active:opacity-95
                  "
                >
                  {loading ? "Adding Event..." : "+ Add Event"}
                </button>
              </div>
            </div>
          </div>

          {/* EVENT LIST */}
          <div className="lg:col-span-1 h-full overflow-hidden">
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-black/5 p-6 h-full flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    All Events ({events.length})
                  </h2>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    Change image or delete events from the list.
                  </p>
                </div>
              </div>

              <div className="space-y-4 overflow-y-auto pr-1">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="bg-[var(--bg-primary)] rounded-xl border border-black/5 p-4"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {event.image ? (
                        <div
                          className="w-full sm:w-48 rounded-lg border border-black/10 overflow-hidden bg-[var(--bg-secondary)] shrink-0"
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
                          className="w-full sm:w-48 rounded-lg border border-dashed border-black/10 bg-[var(--bg-secondary)] flex items-center justify-center text-sm text-[var(--text-muted)] shrink-0"
                          style={{ aspectRatio: "16 / 9" }}
                        >
                          No image
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-lg text-[var(--text-primary)] truncate">
                              {event.title}
                            </h3>
                            <div className="mt-1 text-sm text-[var(--text-muted)] flex flex-col gap-1">
                              <span>
                                📅 {formatDateDDMMYYYY(event.eventDate)} {event.eventTime && `@ ${event.eventTime}`}
                              </span>
                              <span>📍 {event.location || "Location TBD"}</span>
                            </div>
                          </div>

                          <span
                            className={`text-xs font-medium px-3 py-1.5 rounded-full border whitespace-nowrap ${getStatusColor(
                              event.status
                            )}`}
                          >
                            {event.status}
                          </span>
                        </div>

                        {event.description && (
                          <p className="text-sm text-[var(--text-muted)] mt-3 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                          {event.contact && (
                            <div className="text-[var(--text-muted)]">
                              📞 Contact:{" "}
                              <span className="font-semibold text-[var(--text-primary)]">
                                {event.contact}
                              </span>
                            </div>
                          )}

                          {event.link && (
                            <a
                              href={normalizeExternalUrl(event.link)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--brand)] font-semibold hover:underline truncate"
                              title={event.link}
                            >
                              🔗 {event.link}
                            </a>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between gap-2">
                          <p className="text-xs text-[var(--text-muted)]">
                            Status updates automatically based on event date
                          </p>

                          <div className="flex items-center gap-2 shrink-0">
                            <label
                              className="text-xs px-3 py-1.5 rounded-lg border border-black/10 bg-[var(--bg-secondary)] font-semibold cursor-pointer"
                              style={{ color: "var(--brand)" }}
                            >
                              Change Image
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  updateEventImage(event._id, e.target.files?.[0])
                                }
                                className="hidden"
                              />
                            </label>

                            <button
                              onClick={() => handleDelete(event._id)}
                              className="text-xs px-3 py-1.5 rounded-lg border border-black/10 bg-[var(--bg-secondary)] font-semibold text-red-600 hover:bg-red-50 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {events.length === 0 && (
                  <div className="text-center py-12 bg-[var(--bg-primary)] rounded-xl border border-dashed border-black/10">
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
      </div>
    </AdminLayout>
  );
}