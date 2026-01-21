import { createContext, useContext, useEffect, useState } from "react";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Restore auth on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    const storedAdmin = localStorage.getItem("admin_data");

    if (storedToken && storedAdmin) {
      console.log("✅ Restoring admin auth from localStorage");
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    }

    setLoading(false);
  }, []);

  const login = (token, admin) => {
    console.log("🔐 Logging in admin:", admin.email);
    setToken(token);
    setAdmin(admin);

    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_data", JSON.stringify(admin));
  };

  const logout = () => {
    console.log("🚪 Logging out admin");
    setToken(null);
    setAdmin(null);

    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_data");
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, token, login, logout, loading }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
