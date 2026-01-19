import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAdminAuth } from "../../context/AdminAuthContext";
import api from "../../services/api";

export default function AdminDashboard() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (error) {
        console.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl">
          Loading dashboard…
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
        <StatCard title="Active Stays" value={stats.activeStays} />
        <StatCard title="Today's Check-ins" value={stats.todayCheckIns} />
        <StatCard title="Today's Check-outs" value={stats.todayCheckOuts} />

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
