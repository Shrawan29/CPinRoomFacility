import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, admin, loading } = useAdminAuth();

  // ⏳ Wait until auth state is restored
  if (loading) {
    return null; // or loader
  }

  // ❌ Not logged in → redirect to ROOT login
  if (!token || !admin) {
    return <Navigate to="/" replace />;
  }

  // ❌ Role not allowed
  if (allowedRoles && !allowedRoles.includes(admin.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Access granted
  return children;
}
