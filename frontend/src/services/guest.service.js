import api from "./api.js";

// 🔑 GUEST AUTHENTICATION
export const sendGuestOTP = async (qrToken, phone) => {
  const res = await api.post("/guest/auth/send-otp", { qrToken, phone });
  return res.data;
};

export const verifyGuestOTP = async (qrToken, phone, otp, deviceId) => {
  const res = await api.post("/guest/auth/verify-otp", { qrToken, phone, otp, deviceId });
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

  const res = await api.post(
    "/guest/orders",
    items,
    {
      headers: {
        "x-guest-session": session,
      },
    }
  );

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
