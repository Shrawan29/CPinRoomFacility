import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// ✅ SAFE INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // Guard: build / SSR / node
    if (typeof window === "undefined") {
      return config;
    }

    // Public guest APIs (NO AUTH)
    const isPublic =
      config.url?.startsWith("/menu/guest") ||
      config.url?.startsWith("/hotel-info");

    if (isPublic) {
      return config;
    }

    const adminToken = window.localStorage.getItem("admin_token");
    const guestToken = window.localStorage.getItem("guest_token");
    const token = adminToken || guestToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
