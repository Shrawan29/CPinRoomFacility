import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAdminAuth();

  // ⏳ Wait until auth is initialized
  if (loading) return null; // or loader later

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
