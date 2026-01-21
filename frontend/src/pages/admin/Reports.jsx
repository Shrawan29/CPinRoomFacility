import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAdminAuth } from "../../context/AdminAuthContext";
import api from "../../services/api";

export default function Reports() {
  const { token, loading: authLoading } = useAdminAuth();
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState(null);

  useEffect(() => {
    if (authLoading || !token) return;

    const fetchReports = async () => {
      const dailyRes = await api.get("/admin/reports/daily");

      const now = new Date();
      const monthlyRes = await api.get(
        `/admin/reports/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`
      );

      setDaily(dailyRes.data);
      setMonthly(monthlyRes.data);
    };

    fetchReports();
  }, [token, authLoading]);

  return (
    <AdminLayout>

      <h1 className="text-2xl font-semibold mb-6">
        Reports
      </h1>

      {/* Daily */}
      {daily && (
        <Section title={`Daily Report — ${daily.date}`}>
          <Card label="Check-ins" value={daily.todayCheckIns} />
          <Card label="Check-outs" value={daily.todayCheckOuts} />
          <Card label="Occupied Rooms" value={daily.occupiedRooms} />
        </Section>
      )}

      {/* Monthly */}
      {monthly && (
        <Section title={`Monthly Report — ${monthly.month}/${monthly.year}`}>
          <Card label="Check-ins" value={monthly.monthlyCheckIns} />
          <Card label="Check-outs" value={monthly.monthlyCheckOuts} />
        </Section>
      )}

    </AdminLayout>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}
