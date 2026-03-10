import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useGuestAuth } from "../context/GuestAuthContext";
import api from "../services/api";

export default function GuestProtectedRoute({ children }) {
  const { token, loading } = useGuestAuth();

  useEffect(() => {
    if (loading || !token) return;

    let cancelled = false;

    const validate = async () => {
      try {
        await api.get("/guest/dashboard");
      } catch {
        // 401 handling + redirects are managed centrally in api interceptors.
      }
    };

    validate();

    const intervalId = setInterval(() => {
      if (cancelled) return;
      validate();
    }, 15_000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [loading, token]);

  // Loading screen
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
          <div
            className="animate-spin rounded-full h-12 w-12 mx-auto mb-4"
            style={{
              border: "3px solid var(--brand-soft)",
              borderTopColor: "transparent",
            }}
          />
          <p style={{ color: "var(--text-muted)" }}>
            Loading…
          </p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!token) {
    return <Navigate to="/guest/access-fallback" replace />;
  }

  // ✅ THE IMPORTANT PART (THIS WAS MISSING)
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))",
        color: "var(--text-primary)",
      }}
    >
      {children}
    </div>
  );
}
