import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAdminAuth } from "../../context/AdminAuthContext";
import api from "../../services/api";

export default function CheckOut() {
  const { token } = useAdminAuth();

  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingRoom, setProcessingRoom] = useState(null);
  const [error, setError] = useState("");

  /* 🔹 Fetch ACTIVE stays */
  useEffect(() => {
    if (!token) return;

    const fetchStays = async () => {
      try {
        const res = await api.get("/admin/stay/active", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStays(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to load active stays");
      } finally {
        setLoading(false);
      }
    };

    fetchStays();
  }, [token]);

  /* 🔹 Handle checkout */
  const handleCheckout = async (roomNumber) => {
    const confirm = window.confirm(
      `Check out guest from Room ${roomNumber}?`
    );

    if (!confirm) return;

    try {
      setProcessingRoom(roomNumber);

      await api.post(
        "/admin/stay/checkout",
        { roomNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove checked-out stay from UI
      setStays((prev) =>
        prev.filter((stay) => stay.roomNumber !== roomNumber)
      );
    } catch (err) {
      alert(
        err.response?.data?.message || "Checkout failed"
      );
    } finally {
      setProcessingRoom(null);
    }
  };

  return (
    <AdminLayout>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Guest Check-Out
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Active stays currently checked-in
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl">
          Loading active stays…
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-[var(--bg-secondary)] rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left text-[var(--text-muted)]">
                <th className="px-5 py-3">Room</th>
                <th className="px-5 py-3">Guest</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Check-in</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {stays.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-6 text-center text-[var(--text-muted)]"
                  >
                    No active stays
                  </td>
                </tr>
              ) : (
                stays.map((stay) => (
                  <tr
                    key={stay._id}
                    className="border-t border-black/10"
                  >
                    <td className="px-5 py-4">
                      Room {stay.roomNumber}
                    </td>

                    <td className="px-5 py-4">
                      {stay.guestName}
                    </td>

                    <td className="px-5 py-4">
                      {stay.phone}
                    </td>

                    <td className="px-5 py-4 text-[var(--text-muted)]">
                      {new Date(stay.checkInAt).toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleCheckout(stay.roomNumber)}
                        disabled={processingRoom === stay.roomNumber}
                        className={`
                          px-4 py-1 rounded-lg text-sm font-medium
                          ${
                            processingRoom === stay.roomNumber
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }
                        `}
                      >
                        {processingRoom === stay.roomNumber
                          ? "Checking out..."
                          : "Check-out"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

    </AdminLayout>
  );
}
