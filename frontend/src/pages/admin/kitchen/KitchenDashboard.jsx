import { useEffect, useState, useRef } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import api from "../../../services/api";
import notificationSound from "../../../assets/notification.mp3";

export default function KitchenDashboard() {
  const { token, loading: authLoading } = useAdminAuth();
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  
  const previousOrderCountRef = useRef(0);
  const audioRef = useRef(null);

  // Initialize notification sound
  useEffect(() => {
    // Replace '/notification.mp3' with your audio file path
    // Example: '/sounds/notification.mp3' or '/assets/order-alert.wav'
    audioRef.current = new Audio(notificationSound);
    audioRef.current.volume = 0.7; // Adjust volume (0.0 to 1.0)
  }, []);

  // Fetch orders with auto-refresh
  useEffect(() => {
    if (authLoading || !token) return;

    const fetchOrders = async () => {
      try {
        const res = await api.get("/admin/kitchen/orders");
        const newOrders = res.data || [];
        
        // Check if new order arrived
        if (previousOrderCountRef.current > 0 && newOrders.length > previousOrderCountRef.current) {
          // Play sound
          if (audioRef.current) {
            audioRef.current.play().catch(err => console.log("Audio play failed:", err));
          }
          
          // Show visual alert
          setNewOrderAlert(true);
          setTimeout(() => setNewOrderAlert(false), 3000);
        }
        
        previousOrderCountRef.current = newOrders.length;
        setOrders(newOrders);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchOrders();

    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, [token, authLoading]);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);

    try {
      const res = await api.patch(
        `/admin/kitchen/orders/${orderId}/status`,
        { status }
      );

      setOrders((prev) =>
        prev.map((o) => (o._id === res.data._id ? res.data : o))
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <AdminLayout>
      {/* New Order Alert */}
      {newOrderAlert && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce z-50">
          🔔 New Order Received!
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          Kitchen Orders
        </h1>
        <div className="text-sm text-[var(--text-muted)]">
          Auto-refreshing every 5s
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[var(--bg-secondary)] p-5 rounded-xl animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/3 mb-3"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="text-[var(--text-muted)] text-center py-8">
            No active orders
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-[var(--bg-secondary)] p-5 rounded-xl shadow-sm border-l-4"
              style={{
                borderLeftColor: 
                  order.status === "PLACED" ? "#f59e0b" :
                  order.status === "PREPARING" ? "#3b82f6" :
                  order.status === "READY" ? "#10b981" : "#6b7280"
              }}
            >
              <div className="flex justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">
                    Room {order.roomNumber}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    Total ₹{order.totalAmount}
                  </p>
                </div>

                <span 
                  className="text-sm font-medium px-3 py-1 rounded-full h-fit"
                  style={{
                    backgroundColor: 
                      order.status === "PLACED" ? "#fef3c7" :
                      order.status === "PREPARING" ? "#dbeafe" :
                      order.status === "READY" ? "#d1fae5" : "#e5e7eb",
                    color:
                      order.status === "PLACED" ? "#92400e" :
                      order.status === "PREPARING" ? "#1e40af" :
                      order.status === "READY" ? "#065f46" : "#374151"
                  }}
                >
                  {order.status}
                </span>
              </div>

              <ul className="text-sm mb-3 space-y-1">
                {order.items.map((item, i) => (
                  <li key={i} className="flex items-center">
                    <span className="font-semibold mr-2">{item.qty} ×</span>
                    <span>{item.name}</span>
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
          ))
        )}
      </div>
    </AdminLayout>
  );
}

function Action({ label, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-4 py-2 bg-[var(--brand)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {loading ? "Updating..." : label}
    </button>
  );
}