import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminNavbar() {
  const { admin, logout } = useAdminAuth();
  const role = admin?.role; // ✅ FIX

  return (
    <header className="h-16 bg-[var(--bg-secondary)] border-b border-black/10 flex items-center justify-between px-6">

      {/* Page Title */}
      <h1 className="text-lg font-semibold text-[var(--text-primary)]">
        {role === "SUPER_ADMIN"
          ? "Super Admin Dashboard"
          : role === "ADMIN"
          ? "Admin Dashboard"
          : "Kitchen Dashboard"}
      </h1>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-[var(--text-muted)]">
          {admin?.name || "Admin"}
        </span>

        <button
          onClick={logout}
          className="text-sm text-[var(--brand)] hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
