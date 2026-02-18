import { useLocation, useNavigate } from "react-router-dom";
import { useGuestAuth } from "../../context/GuestAuthContext";
import hotelbg from "../../assets/hotel-bg.jpg";
import GuestHeader from "../../components/guest/GuestHeader";

export default function GuestDashboard() {
  const { guest } = useGuestAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const guestFirstName = guest?.name
    ? guest.name.split(" ")[0]
    : guest?.guestName
    ? guest.guestName.split(" ")[0]
    : "Guest";

  const Icon = ({ children, className = "" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );

  const icons = {
    home: (
      <Icon className="w-5 h-5">
        <path d="M3 10.5l9-7 9 7" />
        <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
      </Icon>
    ),
    housekeeping: (
      <Icon className="w-6 h-6">
        <path d="M6 3l12 12" />
        <path d="M10 7l-2 2" />
        <path d="M14 11l-2 2" />
        <path d="M4 20h7" />
        <path d="M4 20c1.2-3.4 3.6-5.8 7-7" />
        <path d="M11 13c1.2 0 2.7 1.1 3.6 2.1" />
      </Icon>
    ),
    food: (
      <Icon className="w-6 h-6">
        <path d="M6 18h12" />
        <path d="M7 18v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1" />
        <path d="M8 12h8" />
        <path d="M5 12a7 7 0 0 1 14 0" />
        <path d="M12 9v-1" />
      </Icon>
    ),
    menu: (
      <Icon className="w-5 h-5">
        <path d="M6 7h12" />
        <path d="M6 12h12" />
        <path d="M6 17h12" />
      </Icon>
    ),
    services: (
      <Icon className="w-5 h-5">
        <path d="M4 7h7" />
        <path d="M4 17h7" />
        <path d="M13 7h7" />
        <path d="M13 17h7" />
        <path d="M4 12h16" />
      </Icon>
    ),
    events: (
      <Icon className="w-5 h-5">
        <path d="M8 3v3" />
        <path d="M16 3v3" />
        <path d="M4 7h16" />
        <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
        <path d="M8 11h4" />
      </Icon>
    ),
    orders: (
      <Icon className="w-5 h-5">
        <path d="M21 8l-9 5-9-5" />
        <path d="M3 8l9 5 9-5" />
        <path d="M12 13v8" />
        <path d="M3 8V6a2 2 0 0 1 1-1.73L11 1a2 2 0 0 1 2 0l7 3.27A2 2 0 0 1 21 6v2" />
      </Icon>
    ),
    info: (
      <Icon className="w-5 h-5">
        <path d="M12 17v-6" />
        <path d="M12 8h.01" />
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </Icon>
    ),
    profile: (
      <Icon className="w-5 h-5">
        <path d="M20 21a8 8 0 1 0-16 0" />
        <path d="M12 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
      </Icon>
    ),
    chevronRight: (
      <Icon className="w-5 h-5">
        <path d="M10 7l5 5-5 5" />
      </Icon>
    ),
    spa: (
      <Icon className="w-6 h-6">
        <path d="M12 20c4-2 6-5 6-8-3 0-5 1.2-6 3-1-1.8-3-3-6-3 0 3 2 6 6 8z" />
        <path d="M12 15c0-3-1.4-6-4-8" />
        <path d="M12 15c0-3 1.4-6 4-8" />
      </Icon>
    ),
    laundry: (
      <Icon className="w-6 h-6">
        <path d="M6 9h12" />
        <path d="M7 9l1.2-3.5A2 2 0 0 1 10.1 4h3.8a2 2 0 0 1 1.9 1.5L17 9" />
        <path d="M6 9v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9" />
        <path d="M9 13h6" />
        <path d="M9 16h6" />
      </Icon>
    ),
    assistance: (
      <Icon className="w-5 h-5">
        <path d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" />
        <path d="M9 21h6" />
      </Icon>
    ),
  };

  const cardHoverClassName = "hover:bg-white/70 hover:shadow-[0_14px_34px_rgba(0,0,0,0.06)]";

  const bottomNav = [
    {
      key: "home",
      label: "Home",
      iconKey: "home",
      path: "/guest/dashboard",
      match: ["/guest/dashboard"],
    },
    {
      key: "orders",
      label: "Orders",
      iconKey: "orders",
      path: "/guest/orders",
      match: ["/guest/orders"],
    },
    {
      key: "services",
      label: "Services",
      iconKey: "services",
      path: "/guest/menu",
      match: ["/guest/menu", "/guest/cart", "/guest/housekeeping"],
    },
    {
      key: "profile",
      label: "Profile",
      iconKey: "profile",
      path: "/guest/hotel-info",
      match: ["/guest/hotel-info"],
    },
  ];

  const isNavActive = (navItem) =>
    navItem.match.some(
      (prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`)
    );

  const primaryActions = [
    {
      iconKey: "housekeeping",
      title: "Housekeeping",
      path: "/guest/housekeeping",
    },
    {
      iconKey: "food",
      title: "Food Order",
      path: "/guest/menu",
    },
    {
      iconKey: "spa",
      title: "Spa",
      path: "/guest/hotel-info",
    },
    {
      iconKey: "laundry",
      title: "Laundry",
      path: "/guest/hotel-info",
    },
  ];

  const secondaryActions = [
    {
      iconKey: "menu",
      title: "Browse Menu",
      subtitle: "View full food & beverage menu",
      path: "/guest/menu",
    },
    {
      iconKey: "events",
      title: "Events",
      subtitle: "Discover events and activities",
      path: "/guest/events",
    },
    {
      iconKey: "info",
      title: "Hotel Information",
      subtitle: "Amenities, Wi‑Fi & hotel details",
      path: "/guest/hotel-info",
    },
  ];

  const PrimaryCard = ({ iconKey, title, path }) => (
    <button
      type="button"
      onClick={() => navigate(path)}
      className={`w-full rounded-[18px] bg-white/65 shadow-[0_10px_22px_rgba(0,0,0,0.06)] px-4 py-4 active:scale-[0.99] transition ${cardHoverClassName} focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30`}
      aria-label={title}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className="h-11 w-11 rounded-[16px] bg-white/75 shadow-[0_8px_16px_rgba(0,0,0,0.04)] flex items-center justify-center"
          style={{ color: "var(--text-muted)" }}
        >
          {icons[iconKey]}
        </div>
        <div className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
          {title}
        </div>
      </div>
    </button>
  );

  const SecondaryCard = ({ iconKey, title, subtitle, path }) => (
    <button
      type="button"
      onClick={() => navigate(path)}
      className={`group shrink-0 w-[280px] rounded-[18px] bg-white/60 shadow-[0_10px_22px_rgba(0,0,0,0.06)] ${cardHoverClassName} px-4 py-4 active:scale-[0.99] transition focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30`}
      aria-label={title}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-[18px] bg-white/75 flex items-center justify-center border border-black/5 shadow-[0_8px_16px_rgba(0,0,0,0.04)]"
          style={{ color: "var(--text-muted)" }}
        >
          {icons[iconKey]}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
            {title}
          </div>
          <div className="mt-2 text-xs leading-snug" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </div>
        </div>
        <div
          className="transition-transform group-hover:translate-x-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          {icons.chevronRight}
        </div>
      </div>
    </button>
  );

  const SectionHeader = ({ title, subtitle }) => (
    <div>
      <div className="text-base font-semibold tracking-wide" style={{ color: "var(--text-primary)" }}>
        {title}
      </div>
      {subtitle ? (
        <div className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          {subtitle}
        </div>
      ) : null}
    </div>
  );


  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)" }}>
      <GuestHeader />
      {/* Remove extra top/bottom padding, attach hero to header */}
      <main className="flex-1 px-4 pt-0 pb-0">
        <div className="max-w-xl mx-auto">
          {/* Hero Section */}
          <section
            className="relative overflow-hidden -mx-4"
            style={{
              backgroundImage: `url(${hotelbg})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              minHeight: 180,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(0deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.10) 60%, rgba(246,234,219,0.0) 100%)",
              }}
            />
            <div className="relative px-6 py-6 flex flex-col justify-end min-h-[180px]" style={{ zIndex: 1 }}>
              <h1
                className="text-[30px] leading-[1.1] font-display font-semibold text-white drop-shadow-md"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.18)" }}
              >
                Make yourself at home
              </h1>
              <div className="mt-2 text-sm font-medium text-white/80" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.12)" }}>
                Room {guest?.roomNumber || "—"}
              </div>
            </div>
          </section>

          {/* In-Room Services */}
          <div className="mt-8">
            <SectionHeader
              title="In-Room Services"
              subtitle="Everything you need during your stay"
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              {primaryActions.map((item) => (
                <PrimaryCard key={item.title} {...item} />
              ))}
            </div>
          </div>

          {/* More Section */}
          <div className="mt-8">
            <SectionHeader title="More" subtitle="Explore the hotel" />
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {secondaryActions.map((item) => (
                <SecondaryCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}