import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// ✅ SAFE INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    if (typeof window === "undefined") return config;

    // Public routes
    const isPublic =
      config.url?.startsWith("/menu/guest") ||
      config.url?.startsWith("/hotel-info") ||
      config.url?.includes("/guest/auth");

    if (isPublic) return config;

    // 🔑 Guest session header
    const guestSession = localStorage.getItem("guest_session");
    if (guestSession) {
      config.headers["x-guest-session"] = guestSession;
    }

    // Admin JWT (separate system)
    const adminToken = localStorage.getItem("admin_token");
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
