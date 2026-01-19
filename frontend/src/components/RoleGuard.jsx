import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function RoleGuard({ allowedRoles, children }) {
  const { admin, loading } = useAdminAuth();

  // ⏳ Wait until admin is restored
  if (loading) return null;

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!allowedRoles.includes(admin.role)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
