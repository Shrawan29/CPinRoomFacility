import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminLayout({ children }) {
  const { admin } = useAdminAuth();
  const role = admin?.role;

  return (
    <div className="flex bg-[var(--bg-primary)] min-h-screen">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="ml-64 flex flex-col w-full">

        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-[var(--bg-primary)]">
          {children}
        </main>
      </div>
    </div>
  );
}
