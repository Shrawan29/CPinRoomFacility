import { Navigate } from "react-router-dom";
import { useGuestAuth } from "../context/GuestAuthContext";

export default function GuestProtectedRoute({ children }) {
  const { token, loading } = useGuestAuth();

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          background:
            "linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))",
          color: "var(--text-primary)",
        }}
      >
        <div className="text-center">
          {/* Spinner */}
          <div
            className="animate-spin rounded-full h-12 w-12 mx-auto mb-4"
            style={{
              borderWidth: "3px",
              borderStyle: "solid",
              borderColor: "var(--brand-soft)",
              borderTopColor: "transparent",
            }}
          ></div>

          {/* Text */}
          <p style={{ color: "var(--text-muted)" }}>
            Loading your experience…
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/guest/access-fallback" replace />;
  }

  return children;
}
