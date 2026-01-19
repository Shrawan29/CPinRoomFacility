import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAdminAuth } from "../../context/AdminAuthContext";
import api from "../../services/api";

export default function CheckIn() {
  const { token } = useAdminAuth();

  const [rooms, setRooms] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* 🔹 Fetch AVAILABLE rooms */
  useEffect(() => {
    if (!token) return;

    const fetchRooms = async () => {
      try {
        const res = await api.get("/rooms/available", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRooms(res.data || []);
      } catch (err) {
        setError("Failed to load rooms");
      }
    };

    fetchRooms();
  }, [token]);

  /* 🔹 Handle check-in */
  const handleCheckIn = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!roomNumber || !guestName || !phone) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/admin/stay/checkin",
        { roomNumber, guestName, phone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || "Guest checked in successfully");

      // Reset form
      setRoomNumber("");
      setGuestName("");
      setPhone("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Check-in failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Guest Check-In
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Assign a guest to an available room
        </p>
      </div>

      {/* Check-in Card */}
      <div className="bg-[var(--bg-secondary)] rounded-xl shadow-sm p-6 max-w-xl">

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

        <form onSubmit={handleCheckIn} className="space-y-4">

          {/* Room */}
          <div>
            <label className="block text-sm mb-1 text-[var(--text-primary)]">
              Room
            </label>
            <select
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select available room</option>
              {rooms.map((room) => (
                <option key={room.roomNumber} value={room.roomNumber}>
                  Room {room.roomNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Guest Name */}
          <div>
            <label className="block text-sm mb-1 text-[var(--text-primary)]">
              Guest Name
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Enter guest name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm mb-1 text-[var(--text-primary)]">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Enter phone number"
            />
          </div>

          {/* Submit */}
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
            {loading ? "Checking in..." : "Check-In Guest"}
          </button>

        </form>
      </div>

    </AdminLayout>
  );
}
