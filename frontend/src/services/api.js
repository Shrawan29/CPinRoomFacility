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
      config.url?.includes("/guest/auth") ||
      config.url?.startsWith("/admin/login");

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window === "undefined") return Promise.reject(error);

    const status = error?.response?.status;
    if (status !== 401) return Promise.reject(error);

    const requestUrl = String(error?.config?.url || "");

    const headers = error?.config?.headers;
    const getHeader = (name) => {
      if (!headers) return undefined;
      if (typeof headers.get === "function") return headers.get(name);
      return headers[name] ?? headers[name.toLowerCase()];
    };

    // Avoid redirect loops / interference on login endpoints.
    const isAuthEndpoint =
      requestUrl.startsWith("/admin/login") || requestUrl.includes("/guest/auth");
    if (isAuthEndpoint) return Promise.reject(error);

    const isAdminRequest = requestUrl.startsWith("/admin");
    const isGuestRequest = requestUrl.startsWith("/guest");

    const hasAdminAuthHeader = Boolean(getHeader("Authorization"));
    const hasGuestSessionHeader = Boolean(getHeader("x-guest-session"));

    if (isAdminRequest || hasAdminAuthHeader) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_data");
      if (window.location.pathname !== "/") {
        window.location.assign("/");
      }
      return Promise.reject(error);
    }

    if (isGuestRequest || hasGuestSessionHeader) {
      localStorage.removeItem("guest_session");
      localStorage.removeItem("guest_token");
      localStorage.removeItem("guest_data");
      if (!window.location.pathname.startsWith("/guest/access-fallback")) {
        window.location.assign("/guest/access-fallback?reason=session-expired");
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api;
