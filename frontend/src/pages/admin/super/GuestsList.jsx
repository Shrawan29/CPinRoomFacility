import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import api from "../../../services/api";

export default function GuestsList() {
  const { token, loading: authLoading } = useAdminAuth();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !token) {
      setLoading(authLoading);
      return;
    }

    const fetchGuests = async () => {
      try {
        const res = await api.get("/admin/dashboard/guests");
        setGuests(Array.isArray(res.data) ? res.data : []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load guests");
        setGuests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, [token, authLoading]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl">
          Loading guests…
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

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          All Guests
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          View all active guest sessions
        </p>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-secondary)] rounded-xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black/5 text-left text-sm text-[var(--text-muted)]">
              <th className="px-5 py-3">Guest Name</th>
              <th className="px-5 py-3">Room Number</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Check-in</th>
              <th className="px-5 py-3">Expires At</th>
            </tr>
          </thead>

          <tbody>
            {guests.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-5 py-6 text-center text-[var(--text-muted)]"
                >
                  No active guest sessions
                </td>
              </tr>
            ) : (
              guests.map((guest) => (
                <tr
                  key={guest._id}
                  className="border-t border-black/10 hover:bg-black/5 transition"
                >
                  <td className="px-5 py-4 text-[var(--text-primary)]">
                    {guest.guestName}
                  </td>

                  <td className="px-5 py-4 text-[var(--text-muted)]">
                    {guest.roomNumber}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        new Date(guest.expiresAt) > new Date()
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {new Date(guest.expiresAt) > new Date()
                        ? "ACTIVE"
                        : "EXPIRED"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-[var(--text-muted)] text-sm">
                    {new Date(guest.createdAt).toLocaleDateString()} at{" "}
                    {new Date(guest.createdAt).toLocaleTimeString()}
                  </td>

                  <td className="px-5 py-4 text-[var(--text-muted)] text-sm">
                    {new Date(guest.expiresAt).toLocaleDateString()} at{" "}
                    {new Date(guest.expiresAt).toLocaleTimeString()}
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
