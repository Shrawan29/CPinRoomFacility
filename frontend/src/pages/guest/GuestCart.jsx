import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";

export default function GuestCart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("guest_cart")) || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      navigate("/guest/orders");
    } catch (err) {
      setError("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--bg-primary)" }}>
      <h1 className="text-xl font-bold mb-4">🛒 Your Cart</h1>

      {cart.length === 0 && (
        <p style={{ color: "var(--text-muted)" }}>Your cart is empty</p>
      )}

      <div className="space-y-4">
        {cart.map((item, index) => (
          <div
            key={item._id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">₹{item.price}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQty(index, -1)}
                className="px-3 py-1 rounded bg-gray-200"
              >
                −
              </button>
              <span>{item.qty}</span>
              <button
                onClick={() => updateQty(index, 1)}
                className="px-3 py-1 rounded bg-gray-200"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg">
          <div className="flex justify-between mb-2">
            <span>Total</span>
            <strong>₹{totalAmount}</strong>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-2">{error}</p>
          )}

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold"
            style={{ backgroundColor: "var(--brand)" }}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
}
