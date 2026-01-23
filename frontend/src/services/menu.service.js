import api from "./api.js";

export const getKitchenMenu = async () => {
  const res = await api.get("/menu/kitchen");
  return res.data;
};

export const createMenuItem = async (data) => {
  const res = await api.post("/menu/kitchen", data);
  return res.data;
};

export const updateMenuItem = async (id, data) => {
  const res = await api.put(`/menu/kitchen/${id}`, data);
  return res.data;
};

export const deleteMenuItem = async (id) => {
  const res = await api.delete(`/menu/kitchen/${id}`);
  return res.data;
};

export const getGuestMenu = async () => {
  const res = await api.get("/menu/guest");
  return res.data.data; // ✅ unwrap here
};

/**
 * GUEST → Add to cart
 */
export const addToCart = async (itemId) => {
  try {
    const existingItem = cart.find((item) => item._id.toString() === itemId);

    if (existingItem) {
      // If the item is already in the cart, increment the quantity
      existingItem.qty += 1;
    } else {
      // If the item is not in the cart, add it with a quantity of 1
      cart.push({ _id: itemId, qty: 1 });
    }

    return cart;
  } catch (error) {
    throw new Error(error.message);
  }
};
