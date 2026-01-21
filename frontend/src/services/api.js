import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000"
});

// Add Authorization header interceptor
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("admin_token");
    const guestToken = localStorage.getItem("guest_token");
    const token = adminToken || guestToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No token found in localStorage for request:", config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
