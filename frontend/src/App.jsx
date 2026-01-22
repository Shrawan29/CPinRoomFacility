import { Routes, Route } from "react-router-dom";
import LoginWrapper from "./routes/LoginWrapper";

// Super Admin
import SuperAdminDashboard from "./pages/admin/super/SuperAdminDashboard";
import CreateAdmin from "./pages/admin/super/CreateAdmin";
import AdminList from "./pages/admin/super/AdminList";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import CheckIn from "./pages/admin/CheckIn";
import CheckOut from "./pages/admin/CheckOut";
import Reports from "./pages/admin/Reports";

// Kitchen
import KitchenDashboard from "./pages/admin/kitchen/KitchenDashboard";
import KitchenMenu from "./pages/admin/kitchen/KitchenMenu";

// QR
import QRCodeManager from "./pages/admin/QRCodeManager";

// Guest
import GuestLogin from "./pages/guest/GuestLogin";
import GuestAccessFallback from "./pages/guest/GuestAccessFallback";
import GuestDashboard from "./pages/guest/GuestDashboard";

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

      {/* ADMIN */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/checkin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <CheckIn />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/checkout"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <CheckOut />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
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

      {/* ✅ GUEST ROUTES */}
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

    </Routes>
  );
}

export default App;
