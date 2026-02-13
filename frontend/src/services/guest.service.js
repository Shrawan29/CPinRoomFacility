import api from "./api.js";

// 🔑 GUEST AUTHENTICATION
export const guestLogin = async (guestName, roomNumber, password) => {
  const res = await api.post("/guest/auth/login", {
    guestName,
    roomNumber,
    password,
  });
  return res.data;
};

// 📊 GUEST DASHBOARD
export const getGuestDashboard = async () => {
  const res = await api.get("/guest/dashboard");
  return res.data;
};

// 🍽️ GUEST ORDERS
export const placeOrder = async (items) => {
  const session = localStorage.getItem("guest_session");

  const res = await api.post("/guest/orders", items, {
    headers: {
      "x-guest-session": session,
    },
  });

  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get("/guest/orders");
  return res.data;
};

// 📋 MENU
export const getGuestMenu = async () => {
  const res = await api.get("/menu/guest");
  return res.data;
};
