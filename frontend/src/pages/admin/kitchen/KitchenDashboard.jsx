import { useEffect, useState, useRef } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import api from "../../../services/api";
import notificationSound from "../../../assets/notification.mp3"; // Add your notification sound file

export default function KitchenDashboard() {
  const { token, loading: authLoading } = useAdminAuth();
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  
  const previousOrderCountRef = useRef(0);
  const audioRef = useRef(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioError, setAudioError] = useState("");

  // Initialize notification sound
  useEffect(() => {
    try {
      audioRef.current = new Audio(notificationSound);
      audioRef.current.volume = 0.7;
      
      // Add event listeners for debugging
      audioRef.current.addEventListener('loadeddata', () => {
        console.log('Audio loaded successfully');
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setAudioError('Failed to load audio file');
      });
      
      // Preload the audio
      audioRef.current.load();
    } catch (err) {
      console.error('Audio initialization error:', err);
      setAudioError(err.message);
    }
  }, []);

  // Enable audio on first user interaction with test
  const enableAudio = async () => {
    if (!audioRef.current) {
      setAudioError('Audio not initialized');
      return;
    }
    
    try {
      // Test play
      await audioRef.current.play();
      console.log('Audio played successfully');
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioEnabled(true);
      setAudioError('');
    } catch (err) {
      console.error('Audio enable failed:', err);
      setAudioError(`Enable failed: ${err.message}`);
    }
  };
  
  // Manual test sound button
  const testSound = async () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      console.log('Test sound played');
    } catch (err) {
      console.error('Test sound failed:', err);
      setAudioError(`Test failed: ${err.message}`);
    }
  };

  // Fetch orders with auto-refresh
  useEffect(() => {
    if (authLoading || !token) return;

    const fetchOrders = async () => {
      try {
        const res = await api.get("/admin/kitchen/orders");
        const newOrders = res.data || [];
        
        console.log('Previous order count:', previousOrderCountRef.current);
        console.log('Current order count:', newOrders.length);
        
        // Check if new order arrived - only check PLACED orders
        const newPlacedOrders = newOrders.filter(o => o.status === "PLACED");
        const previousPlacedCount = orders.filter(o => o.status === "PLACED").length;
        
        if (previousOrderCountRef.current > 0 && newPlacedOrders.length > previousPlacedCount) {
          console.log('🔔 NEW ORDER DETECTED!');
          
          // Play sound
          if (audioRef.current && audioEnabled) {
            console.log('Attempting to play sound...');
            audioRef.current.currentTime = 0;
            audioRef.current.play()
              .then(() => console.log('Sound played successfully'))
              .catch(err => console.error("Audio play failed:", err));
          } else {
            console.log('Audio not enabled or ref missing');
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
  }, [token, authLoading, audioEnabled, orders]);

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
      {/* Audio Enable Button */}
      {!audioEnabled && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <span>🔔 Click to enable sound notifications</span>
          <button
            onClick={enableAudio}
            className="bg-white text-yellow-600 px-4 py-1 rounded font-semibold hover:bg-yellow-50"
          >
            Enable Sound
          </button>
        </div>
      )}

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
        <div className="flex items-center gap-4">
          {/* Test Sound Button */}
          {audioEnabled && (
            <button
              onClick={testSound}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              🔊 Test Sound
            </button>
          )}
          <div className="text-sm text-[var(--text-muted)]">
            Auto-refreshing every 5s
          </div>
        </div>
      </div>

      {/* Error Display */}
      {audioError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Audio Error:</strong> {audioError}
        </div>
      )}

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