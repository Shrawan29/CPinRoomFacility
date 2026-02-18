import { Link, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminSidebar() {
  const location = useLocation();
  const { admin } = useAdminAuth();

  const role = admin?.role;

  /* ---------------- ROLE BASED MENUS ---------------- */

  const superAdminMenu = [
    { label: "Create Admin", path: "/admin/super/create-admin" },
    { label: "Manage Admins", path: "/admin/super/admins" },
    { label: "Reports", path: "/admin/reports" },
  ];

  const diningAdminMenu = [
    { label: "Orders", path: "/admin/kitchen/dashboard" },
    { label: "Menu", path: "/admin/kitchen/menu" },
  ];

  const housekeepingAdminMenu = [
    { label: "Housekeeping", path: "/admin/housekeeping" },
  ];

  /* ---------------- SELECT MENU ---------------- */

  const menu =
    role === "SUPER_ADMIN"
      ? superAdminMenu
      : role === "HOUSEKEEPING_ADMIN"
      ? housekeepingAdminMenu
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
                    ? "bg-[var(--brand)] text-white"
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
