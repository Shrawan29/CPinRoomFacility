import AdminLayout from "../../../layouts/AdminLayout";

export default function SuperAdminDashboard() {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">
        Welcome, Super Admin
      </h2>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Total Admins</p>
          <p className="text-2xl font-bold">5</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Active Rooms</p>
          <p className="text-2xl font-bold">120</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Orders Today</p>
          <p className="text-2xl font-bold">34</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Events</p>
          <p className="text-2xl font-bold">3</p>
        </div>
      </div>
    </AdminLayout>
  );
}
