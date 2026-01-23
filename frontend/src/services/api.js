import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000"
});

// Add Authorization header interceptor
api.interceptors.request.use(
  (config) => {
    // Do NOT attach token for public guest menu
    const isPublicGuestAPI =
      config.url?.startsWith("/menu/guest") ||
      config.url?.startsWith("/hotel-info");

    if (isPublicGuestAPI) {
      return config; // 🚫 no Authorization header
    }

    const adminToken = localStorage.getItem("admin_token");
    const guestToken = localStorage.getItem("guest_token");
    const token = adminToken || guestToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

