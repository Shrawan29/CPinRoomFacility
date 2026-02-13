import { Routes, Route } from "react-router-dom";
import LoginWrapper from "./routes/LoginWrapper";

// Super Admin
import SuperAdminDashboard from "./pages/admin/super/SuperAdminDashboard";
import CreateAdmin from "./pages/admin/super/CreateAdmin";
import AdminList from "./pages/admin/super/AdminList";

// Reports & Events (SUPER_ADMIN only)
import Reports from "./pages/admin/Reports";
import AdminEvents from "./pages/admin/AdminEvents";

// Kitchen
import KitchenDashboard from "./pages/admin/kitchen/KitchenDashboard";
import KitchenMenu from "./pages/admin/kitchen/KitchenMenu";

// QR
import QRCodeManager from "./pages/admin/QRCodeManager";

// Guest
import GuestLogin from "./pages/guest/GuestLogin";
import GuestAccessFallback from "./pages/guest/GuestAccessFallback";
import GuestDashboard from "./pages/guest/GuestDashboard";


// Guest pages
import MenuBrowse from "./pages/guest/MenuBrowse";
import GuestCart from "./pages/guest/GuestCart";
import GuestOrders from "./pages/guest/GuestOrders";
import GuestEvent from "./pages/guest/GuestEvent";
import GuestHotelInfo from "./pages/guest/GuestHotelInfo";


// Routes
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestProtectedRoute from "./components/GuestProtectedRoute";

function App() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/" element={<LoginWrapper />} />

      {/* SUPER ADMIN */}
      <Route
        path="/admin/super/dashboard"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/super/create-admin"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <CreateAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/super/admins"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <AdminList />
          </ProtectedRoute>
        }
      />

      {/* REPORTS (SUPER_ADMIN only) */}
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* KITCHEN */}
      <Route
        path="/admin/kitchen/dashboard"
        element={
          <ProtectedRoute allowedRoles={["DINING_ADMIN"]}>
            <KitchenDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/kitchen/menu"
        element={
          <ProtectedRoute allowedRoles={["DINING_ADMIN"]}>
            <KitchenMenu />
          </ProtectedRoute>
        }
      />

      {/* QR MANAGER */}
      <Route
        path="/admin/qr-codes"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <QRCodeManager />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/events"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <AdminEvents />
          </ProtectedRoute>
        }
      />

      {/* PUBLIC — MUST NOT BE PROTECTED */}
      <Route path="/guest/login" element={<GuestLogin />} />
      <Route path="/guest/access-fallback" element={<GuestAccessFallback />} />

      {/* PROTECTED AFTER LOGIN */}
      <Route
        path="/guest/dashboard"
        element={
          <GuestProtectedRoute>
            <GuestDashboard />
          </GuestProtectedRoute>
        }
      />

      <Route
        path="/guest/menu"
        element={
          <GuestProtectedRoute>
            <MenuBrowse />
          </GuestProtectedRoute>
        }
      />

      <Route
        path="/guest/cart"
        element={
          <GuestProtectedRoute>
            <GuestCart />
          </GuestProtectedRoute>
        }
      />

      <Route
        path="/guest/orders"
        element={
          <GuestProtectedRoute>
            <GuestOrders />
          </GuestProtectedRoute>
        }
      />

      <Route
        path="/guest/events"
        element={
          <GuestProtectedRoute>
            <GuestEvent />
          </GuestProtectedRoute>
        }
      />

      <Route
        path="/guest/hotel-info"
        element={
          <GuestProtectedRoute>
            <GuestHotelInfo />
          </GuestProtectedRoute>
        }
      />


      </Routes>
      );
}

      export default App;
