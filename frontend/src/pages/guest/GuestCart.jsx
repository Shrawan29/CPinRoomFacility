import { useNavigate } from "react-router-dom";
import GuestLuxuryTheme from "../../components/guest/GuestLuxuryTheme";
import { useState } from "react";
import api from "../../services/api";

export default function GuestCart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("guest_cart")) || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const updateQty = (index, delta) => {
    const updated = [...cart];
    updated[index].qty += delta;

    if (updated[index].qty <= 0) {
      updated.splice(index, 1);
    }

    setCart(updated);
    localStorage.setItem("guest_cart", JSON.stringify(updated));
  };

  const confirmPlaceOrder = () => {
    setShowConfirmation(true);
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const payload = {
        items: cart.map((item) => ({
          menuItemId: item._id,
          qty: item.qty,
        })),
      };

      await api.post("/guest/orders", payload);

      localStorage.removeItem("guest_cart");
      setShowConfirmation(false);
      navigate("/guest/orders");
    } catch (err) {
      setError("Failed to place order");
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestLuxuryTheme>
      <div className="min-h-screen pb-24">
        <div className="max-w-xl mx-auto px-4 pt-6">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>
            🛒 My Cart
          </h1>
          {error && (
            <div className="mb-4 text-red-600 text-sm font-semibold text-center">
              {error}
            </div>
          )}
          {cart.length === 0 ? (
            <p className="text-center" style={{ color: "var(--text-muted)" }}>Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div key={item._id} className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg" style={{ color: "var(--text)" }}>{item.name}</div>
                    <div className="text-sm" style={{ color: "var(--text-muted)" }}>₹{item.price} × {item.qty}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(idx, -1)} className="px-2 py-1 rounded bg-gray-200">-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(idx, 1)} className="px-2 py-1 rounded bg-gray-200">+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {cart.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between font-semibold mb-2">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
              <button
                className="w-full py-3 rounded-lg text-white font-bold mt-2"
                style={{ backgroundColor: "var(--rose)" }}
                onClick={confirmPlaceOrder}
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          )}
          {/* CONFIRMATION MODAL */}
          {showConfirmation && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">Confirm Order</h2>
                <div className="mb-4 bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between mb-2 text-sm">
                      <span>{item.name} × {item.qty}</span>
                      <span>₹{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-xs text-red-700 font-semibold">⚠️ Once ordered, it cannot be cancelled</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 py-2 rounded-lg border-2 font-semibold"
                    style={{
                      borderColor: "var(--text-muted)",
                      color: "var(--text)"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={placeOrder}
                    disabled={loading}
                    className="flex-1 py-2 rounded-lg text-white font-semibold"
                    style={{ backgroundColor: "var(--rose)" }}
                  >
                    {loading ? "Processing..." : "Confirm Order"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GuestLuxuryTheme>
  );
}
