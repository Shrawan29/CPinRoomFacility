import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAdminAuth } from "../../context/AdminAuthContext";
import api from "../../services/api";

export default function Reports() {
  const { token, loading: authLoading } = useAdminAuth();
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [orders, setOrders] = useState([]);

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

      // Super Admin order report: status + items
      const ordersRes = await api.get("/admin/orders");
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data.slice(0, 20) : []);
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
          <Card label="New Guest Sessions" value={daily.newGuestSessions} />
          <Card label="Total Orders" value={daily.totalOrders} />
          <Card label="Occupied Rooms" value={daily.occupiedRooms} />
        </Section>
      )}

      {/* Monthly */}
      {monthly && (
        <Section title={`Monthly Report — ${monthly.month}/${monthly.year}`}>
          <Card label="Guest Sessions" value={monthly.monthlyGuestSessions} />
          <Card label="Orders" value={monthly.monthlyOrders} />
        </Section>
      )}

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 text-[var(--text-muted)]">
            No orders found.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o._id} className="bg-[var(--bg-secondary)] rounded-xl p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">Room {o.roomNumber}</div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/70">
                    {o.status}
                  </span>
                </div>

                <div className="mt-3 text-sm text-[var(--text-muted)]">
                  {(o.items || []).map((it, idx) => (
                    <div key={idx}>
                      {it.qty} × {it.name}
                    </div>
                  ))}
                </div>

                <div className="mt-3 font-semibold">
                  Total ₹{o.totalAmount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
