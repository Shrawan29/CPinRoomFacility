import { Link, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminSidebar() {
  const location = useLocation();
  const { admin } = useAdminAuth();

  const role = admin?.role;

  /* ---------------- ROLE BASED MENUS ---------------- */

  const superAdminMenu = [
    { label: "Dashboard", path: "/admin/super/dashboard" },
    { label: "Foints Loyalty", path: "/admin/super/foints" },
    { label: "Guest Sessions", path: "/admin/super/guest-sessions" },
    { label: "Create Admin", path: "/admin/super/create-admin" },
    { label: "Manage Admins", path: "/admin/super/admins" },
    { label: "Rooms", path: "/admin/super/rooms" },
    { label: "QR Codes", path: "/admin/qr-codes" },
    { label: "Events", path: "/admin/events" },
    { label: "Reports", path: "/admin/reports" },
    { label: "Feedbacks", path: "/admin/complaints" },
  ];

  const diningAdminMenu = [
    { label: "Orders", path: "/admin/kitchen/dashboard" },
    { label: "Menu", path: "/admin/kitchen/menu" },
    { label: "Create Staff Login", path: "/admin/kitchen/create-login" },
    { label: "Manage Staff Logins", path: "/admin/kitchen/manage-logins" },
    { label: "Escalated Housekeeping", path: "/admin/housekeeping/supervisor" },
  ];

  const housekeepingAdminMenu = [
    { label: "Housekeeping", path: "/admin/housekeeping" },
    { label: "Supervisor Mobile", path: "/admin/housekeeping/supervisor" },
  ];

  const housekeepingSupervisorMenu = [
    { label: "Supervisor Dashboard", path: "/admin/housekeeping/supervisor" },
  ];

  const housekeepingStaffMenu = [
    { label: "My Tasks", path: "/admin/housekeeping/supervisor" },
  ];

  /* ---------------- SELECT MENU ---------------- */

  const menu =
    role === "SUPER_ADMIN"
      ? superAdminMenu
      : role === "HOUSEKEEPING_ADMIN"
      ? housekeepingAdminMenu
      : role === "HOUSEKEEPING_SUPERVISOR"
      ? housekeepingSupervisorMenu
      : role === "HOUSEKEEPING_STAFF"
      ? housekeepingStaffMenu
      : diningAdminMenu;

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-[#1f1f1f] text-white flex flex-col">

      {/* Brand */}
      <div className="px-6 py-5 text-xl font-serif border-b border-white/10">
        CENTRE POINT
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4">
        {menu.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                block px-6 py-3 text-sm transition
                ${
                  active
                    ? "bg-(--brand) text-white"
                    : "text-white/80 hover:bg-white/10"
                }
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 text-xs text-white/60 border-t border-white/10">
        © Centre Point Hotel
      </div>
    </aside>
  );
}
