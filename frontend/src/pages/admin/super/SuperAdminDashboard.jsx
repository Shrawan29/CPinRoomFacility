import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import api from "../../../services/api";

function UsageCard({ label, value }) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const { token, loading: authLoading } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState(null);

  useEffect(() => {
    if (authLoading || !token) {
      setLoading(authLoading);
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard/stats");
        setStats(res.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load stats");
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchReports = async () => {
      try {
        const dailyRes = await api.get("/admin/reports/daily");
        setDaily(dailyRes.data);
        const now = new Date();
        const monthlyRes = await api.get(
          `/admin/reports/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`
        );
        setMonthly(monthlyRes.data);
      } catch (err) {
        // ignore for now, can add error handling if needed
      }
    };

    fetchStats();
    fetchReports();
  }, [token, authLoading]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl">
          Loading dashboard…
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
      <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
        Welcome, Super Admin
      </h2>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
          <p className="text-blue-700 text-sm font-medium mb-2">Total Rooms</p>
          <p className="text-3xl font-bold text-blue-900">
            {stats?.totalRooms || 0}
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-100">
          <p className="text-green-700 text-sm font-medium mb-2">Available Rooms</p>
          <p className="text-3xl font-bold text-green-900">
            {stats?.availableRooms || 0}
          </p>
        </div>

        <div className="bg-orange-50 p-6 rounded-xl shadow-sm border border-orange-100">
          <p className="text-orange-700 text-sm font-medium mb-2">Active Guests</p>
          <p className="text-3xl font-bold text-orange-900">
            {stats?.activeSessions || 0}
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl shadow-sm border border-purple-100">
          <p className="text-purple-700 text-sm font-medium mb-2">Orders Today</p>
          <p className="text-3xl font-bold text-purple-900">
            {stats?.todayOrders || 0}
          </p>
        </div>
      </div>

      {/* Usage Report Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Usage Report</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <UsageCard label="Today's Orders Placed" value={daily?.totalOrders ?? '—'} />
          <UsageCard label="Today's Guest Sessions" value={daily?.newGuestSessions ?? '—'} />
          <UsageCard label="Occupied Rooms Today" value={daily?.occupiedRooms ?? '—'} />
        </div>
        {monthly && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">Monthly Summary</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <UsageCard label="Orders This Month" value={monthly?.monthlyOrders ?? '—'} />
              <UsageCard label="Guest Sessions This Month" value={monthly?.monthlyGuestSessions ?? '—'} />
            </div>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Room Status Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-muted)]">Occupied</span>
              <span className="text-xl font-bold text-[var(--text-primary)]">
                {stats?.occupiedRooms || 0}
              </span>
            </div>
            <div className="h-2 bg-black/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500"
                style={{
                  width: `${
                    stats?.totalRooms
                      ? ((stats?.occupiedRooms || 0) / stats?.totalRooms) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Quick Actions
          </h3>
          <p className="text-[var(--text-muted)] text-sm mb-4">
            Navigate to manage guests, rooms, or create new admins from the sidebar menu.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
