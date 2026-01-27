import { useEffect, useState } from "react";
import api from "../../services/api";

export default function GuestOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await api.get("/guest/orders");
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading orders:", err);
        setLoading(false);
      }
    };

    // Load orders immediately
    loadOrders();

    // Set up auto-refresh every 5 seconds
    const intervalId = setInterval(loadOrders, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <p className="p-4">Loading orders...</p>;
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--bg-primary)" }}>
      <h1 className="text-xl font-bold mb-4">📦 My Orders</h1>

      {orders.length === 0 && (
        <p style={{ color: "var(--text-muted)" }}>
          No orders placed yet
        </p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-4 rounded-xl shadow"
          >
            <div className="flex justify-between mb-2">
              <strong>Status</strong>
              <span>{order.status}</span>
            </div>

            {order.items.map((item, i) => (
              <div key={i} className="text-sm text-gray-600">
                {item.qty} × {item.name}
              </div>
            ))}

            <div className="mt-2 font-semibold">
              Total ₹{order.totalAmount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
