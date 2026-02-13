import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import api from "../../../services/api";

export default function RoomsList() {
  const { token, loading: authLoading } = useAdminAuth();
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !token) {
      setLoading(authLoading);
      return;
    }

    const fetchRoomsAndGuests = async () => {
      try {
        const [roomsRes, guestsRes] = await Promise.all([
          api.get("/admin/dashboard/rooms"),
          api.get("/admin/dashboard/guests"),
        ]);

        setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : []);
        setGuests(Array.isArray(guestsRes.data) ? guestsRes.data : []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load rooms");
        setRooms([]);
        setGuests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomsAndGuests();
  }, [token, authLoading]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl">
          Loading rooms…
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
          <p className="text-red-700">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  const availableRooms = rooms.filter((r) => r.status === "AVAILABLE");
  const occupiedRooms = rooms.filter((r) => r.status === "OCCUPIED");

  const guestsByRoom = guests.reduce((acc, guest) => {
    const roomNumber = String(guest?.roomNumber ?? "").trim();
    if (!roomNumber) return acc;

    const guestName = String(guest?.guestName ?? "").trim();
    if (!guestName) return acc;

    if (!acc[roomNumber]) acc[roomNumber] = new Set();
    acc[roomNumber].add(guestName);
    return acc;
  }, {});

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          All Rooms
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          View all hotel rooms and their status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow-sm">
          <p className="text-[var(--text-muted)] text-sm mb-2">Total Rooms</p>
          <p className="text-3xl font-bold text-[var(--text-primary)]">
            {rooms.length}
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-xl shadow-sm">
          <p className="text-green-700 text-sm mb-2">Available</p>
          <p className="text-3xl font-bold text-green-700">
            {availableRooms.length}
          </p>
        </div>

        <div className="bg-orange-50 p-6 rounded-xl shadow-sm">
          <p className="text-orange-700 text-sm mb-2">Occupied</p>
          <p className="text-3xl font-bold text-orange-700">
            {occupiedRooms.length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-secondary)] rounded-xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black/5 text-left text-sm text-[var(--text-muted)]">
              <th className="px-5 py-3">Room Number</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Guests</th>
              <th className="px-5 py-3">Created At</th>
              <th className="px-5 py-3">Last Updated</th>
            </tr>
          </thead>

          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-5 py-6 text-center text-[var(--text-muted)]"
                >
                  No rooms found
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr
                  key={room._id}
                  className="border-t border-black/10 hover:bg-black/5 transition"
                >
                  <td className="px-5 py-4 text-[var(--text-primary)] font-medium">
                    {room.roomNumber}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        room.status === "AVAILABLE"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {room.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-[var(--text-muted)] text-sm">
                    {(() => {
                      const set = guestsByRoom[String(room.roomNumber)] || null;
                      if (!set || set.size === 0) return "-";
                      return Array.from(set).join(", ");
                    })()}
                  </td>

                  <td className="px-5 py-4 text-[var(--text-muted)] text-sm">
                    {new Date(room.createdAt).toLocaleDateString()} at{" "}
                    {new Date(room.createdAt).toLocaleTimeString()}
                  </td>

                  <td className="px-5 py-4 text-[var(--text-muted)] text-sm">
                    {new Date(room.updatedAt).toLocaleDateString()} at{" "}
                    {new Date(room.updatedAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
