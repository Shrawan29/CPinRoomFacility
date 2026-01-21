import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import api from "../../../services/api";

export default function KitchenDashboard() {
  const { token, loading: authLoading } = useAdminAuth();
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (authLoading || !token) return;

    const fetchOrders = async () => {
      const res = await api.get("/admin/kitchen/orders");
      setOrders(res.data || []);
    };

    fetchOrders();
  }, [token, authLoading]);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);

    const res = await api.patch(
      `/admin/kitchen/orders/${orderId}/status`,
      { status }
    );

    setOrders((prev) =>
      prev.map((o) => (o._id === res.data._id ? res.data : o))
    );

    setUpdating(null);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">
        Kitchen Orders
      </h1>

      <div className="space-y-4">
        {orders.length === 0 && (
          <p className="text-[var(--text-muted)]">
            No active orders
          </p>
        )}

        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-[var(--bg-secondary)] p-5 rounded-xl shadow-sm"
          >
            <div className="flex justify-between mb-2">
              <div>
                <h3 className="font-semibold">
                  Room {order.roomNumber}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Total ₹{order.totalAmount}
                </p>
              </div>

              <span className="text-sm font-medium">
                {order.status}
              </span>
            </div>

            <ul className="text-sm mb-3">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.qty} × {item.name}
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              {order.status === "PLACED" && (
                <Action
                  label="Start Preparing"
                  onClick={() => updateStatus(order._id, "PREPARING")}
                  loading={updating === order._id}
                />
              )}

              {order.status === "PREPARING" && (
                <Action
                  label="Mark Ready"
                  onClick={() => updateStatus(order._id, "READY")}
                  loading={updating === order._id}
                />
              )}

              {order.status === "READY" && (
                <Action
                  label="Delivered"
                  onClick={() => updateStatus(order._id, "DELIVERED")}
                  loading={updating === order._id}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

function Action({ label, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-4 py-1 bg-[var(--brand)] text-white rounded"
    >
      {loading ? "Updating..." : label}
    </button>
  );
}
