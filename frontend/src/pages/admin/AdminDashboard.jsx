import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAdminAuth } from "../../context/AdminAuthContext";
import api from "../../services/api";

export default function AdminDashboard() {
  const { token, loading: authLoading } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wait for auth to load, then check if token exists
    if (authLoading || !token) {
      setLoading(authLoading);
      return;
    }

    const fetchStats = async () => {
      try {
        console.log("Token available, fetching stats...");
        const res = await api.get("/admin/dashboard/stats");
        setStats(res.data);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
        setError(error.response?.data?.message || error.message);
        setLoading(false);
        setStats(null);
      }
    };

    fetchStats();
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
          <h2 className="text-red-700 font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600">{error}</p>
          <p className="text-red-500 text-sm mt-2">Token: {token ? "Available" : "Missing"}</p>
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
          <p className="text-yellow-700">No data available</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Admin Dashboard
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Live hotel operations overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <StatCard title="Total Rooms" value={stats.totalRooms} />
        <StatCard title="Available Rooms" value={stats.availableRooms} />
        <StatCard title="Occupied Rooms" value={stats.occupiedRooms} />
        <StatCard title="Active Guest Sessions" value={stats.activeSessions} />
        <StatCard title="Today's Orders" value={stats.todayOrders} />

      </div>

    </AdminLayout>
  );
}

/* ---------- Reusable Card ---------- */

function StatCard({ title, value }) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl p-6 shadow-sm">
      <p className="text-sm text-[var(--text-muted)]">{title}</p>
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-2">
        {value}
      </h2>
    </div>
  );
}
