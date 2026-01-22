import { Navigate } from "react-router-dom";
import { useGuestAuth } from "../context/GuestAuthContext";

export default function GuestProtectedRoute({ children }) {
  const { token, loading } = useGuestAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/guest/access-fallback" replace />;
  }

  return children;
}
