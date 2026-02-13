import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import AdminLogin from "../pages/admin/AdminLogin";

export default function LoginWrapper() {
  const { admin, loading } = useAdminAuth();

  // Wait for auth restoration
  if (loading) {
    return null; // or loader
  }

  // Already logged in → redirect by role
  if (admin) {
    if (admin.role === "SUPER_ADMIN") {
      return <Navigate to="/admin/super/dashboard" replace />;
    }
    if (admin.role === "DINING_ADMIN") {
      return <Navigate to="/admin/kitchen/dashboard" replace />;
    }
  }

  // Not logged in → show login page
  return <AdminLogin />;
}
