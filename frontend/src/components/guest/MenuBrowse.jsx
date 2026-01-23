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
      const items = Array.isArray(response) ? response : response.items || [];
      
      // 🔍 DEBUG: Log the first item to see its structure
      if (items.length > 0) {
        console.log("🔍 DEBUG - First menu item:", items[0]);
        console.log("🔍 Available field value:", items[0].available);
        console.log("🔍 Available field type:", typeof items[0].available);
        console.log("🔍 All fields:", Object.keys(items[0]));
      }
      
      setMenuItems(items);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["ALL", ...new Set(menuItems.map((item) => item.category))];

  const filteredItems =
    selectedCategory === "ALL"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const addToCart = (item) => {
    const existingItem = cart.find((c) => c._id === item._id);
    if (existingItem) {
      setCart(
        cart.map((c) =>
          c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((c) => c._id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(
        cart.map((c) => (c._id === itemId ? { ...c, quantity } : c))
      );
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError("Please add items to your order");
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

      setSuccessMessage("✅ Order placed successfully!");
      setCart([]);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔍 Helper function to check if item is available
  const isItemAvailable = (item) => {
    // Try different possible field names and values
    if (item.available === true) return true;
    if (item.available === false) return false;
    if (item.isAvailable === true) return true;
    if (item.isAvailable === false) return false;
    if (item.status === "available") return true;
    if (item.status === "unavailable") return false;
    if (item.inStock === true) return true;
    if (item.inStock === false) return false;
    
    // Default to available if field doesn't exist
    return true;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* MENU ITEMS */}
      <div className="lg:col-span-3">
        {/* CATEGORY FILTER */}
        <div className="mb-8 flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
            {successMessage}
          </div>
        )}

        {/* LOADING STATE */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading menu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No items available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => {
              const available = isItemAvailable(item);
              
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  {/* 🔍 DEBUG BADGE - Remove this after debugging */}
                  <div className="bg-yellow-100 px-2 py-1 text-xs">
                    DEBUG: available={String(item.available)} | 
                    isAvailable={String(item.isAvailable)} | 
                    status={item.status} | 
                    computed={String(available)}
                  </div>

                  {/* ITEM IMAGE */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  {/* ITEM DETAILS */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">
                          ₹{item.price}
                        </span>
                        {!available && (
                          <p className="text-red-500 text-xs font-semibold mt-1">
                            Not Available
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={!available}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CART SIDEBAR */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            🛒 Cart ({cartItemCount})
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Your cart is empty</p>
          ) : (
            <>
              {/* CART ITEMS */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="border-b pb-3 last:border-b-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {item.name}
                        </p>
                        <p className="text-blue-600 font-semibold">
                          ₹{item.price}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700 text-xl"
                      >
                        ✕
                      </button>
                    </div>

                    {/* QUANTITY CONTROLS */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg w-fit">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="px-2 py-1 text-gray-700 font-bold hover:bg-gray-200 rounded"
                      >
                        −
                      </button>
                      <span className="px-3 font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="px-2 py-1 text-gray-700 font-bold hover:bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">₹{cartTotal}</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  Total: ₹{cartTotal}
                </div>
              </div>

              {/* ORDER BUTTON */}
              <button
                onClick={handlePlaceOrder}
                disabled={submitting || cart.length === 0}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition"
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}