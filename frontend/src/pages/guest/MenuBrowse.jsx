import { useState, useEffect } from "react";
import { useGuestAuth } from "../../context/GuestAuthContext";
import { getGuestMenu, placeOrder } from "../../services/guest.service";

export default function MenuBrowse() {
  const { token } = useGuestAuth();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await getGuestMenu();
      setMenuItems(Array.isArray(response) ? response : response.items || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["ALL", ...new Set(menuItems.map((i) => i.category))];

  const filteredItems =
    selectedCategory === "ALL"
      ? menuItems
      : menuItems.filter((i) => i.category === selectedCategory);

  const addToCart = (item) => {
    const existing = cart.find((c) => c._id === item._id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((c) => c._id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map((c) => (c._id === id ? { ...c, quantity: qty } : c)));
    }
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError("Please add items to your cart");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const orderData = {
        items: cart.map((item) => ({
          menuItemId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await placeOrder(orderData);

      setSuccessMessage("✅ Order placed successfully");
      setCart([]);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* MENU */}
        <div className="lg:col-span-3">
          {/* CATEGORIES */}
          <div className="sticky top-0 z-10 bg-[var(--bg-primary)] py-4 mb-6 flex gap-3 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition
                  ${
                    selectedCategory === cat
                      ? "bg-[var(--brand)] text-white shadow"
                      : "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--brand-soft)] hover:text-white"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-700 border border-green-300">
              {successMessage}
            </div>
          )}

          {/* MENU ITEMS */}
          {loading ? (
            <p className="text-center py-20 text-[var(--text-muted)] animate-pulse">
              Loading menu...
            </p>
          ) : filteredItems.length === 0 ? (
            <p className="text-center py-20 text-[var(--text-muted)]">
              No items available in this category
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-44 object-cover"
                    />
                  )}

                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-1">
                      {item.name}
                    </h3>

                    <p className="text-sm text-[var(--text-muted)] mb-4">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-[var(--brand)]">
                          ₹{item.price}
                        </span>
                        {!item.isAvailable && (
                          <p className="text-xs text-red-600 mt-1">
                            Not Available
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        disabled={!item.isAvailable}
                        className="px-4 py-2 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-soft)] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold transition active:scale-95"
                      >
                        Add +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CART */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--bg-secondary)] rounded-xl shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4">
              🛒 Cart ({cartItemCount})
            </h2>

            {cart.length === 0 ? (
              <p className="text-center py-10 text-[var(--text-muted)]">
                Your cart is empty
                <br />
                <span className="text-sm">
                  Add items from the menu
                </span>
              </p>
            ) : (
              <>
                <div className="space-y-4 max-h-80 overflow-y-auto mb-6">
                  {cart.map((item) => (
                    <div key={item._id} className="border-b pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-sm">
                            {item.name}
                          </p>
                          <p className="text-[var(--brand)] font-semibold">
                            ₹{item.price}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-600 hover:text-red-800 text-lg"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mt-2 bg-white rounded-xl px-2 py-1 shadow-sm w-fit">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] hover:bg-gray-200 font-bold"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] hover:bg-gray-200 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-[var(--brand)]">
                      ₹{cartTotal}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting || cart.length === 0}
                  title={cart.length === 0 ? "Add items to cart first" : ""}
                  className="w-full py-3 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-soft)] disabled:bg-gray-400 text-white font-bold transition"
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
