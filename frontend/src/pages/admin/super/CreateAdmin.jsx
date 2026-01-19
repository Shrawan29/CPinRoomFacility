import { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { createAdmin } from "../../../services/admin.service";
import { useAdminAuth } from "../../../context/AdminAuthContext";

export default function CreateAdmin() {
  const { token } = useAdminAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "ADMIN",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await createAdmin(form, token);
      setSuccess("Admin created successfully");
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "ADMIN",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>

      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          Create New Admin
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Add a new admin or dining manager for hotel operations
        </p>
      </div>

      {/* Form Card */}
      <div>
        <div className="w-full max-w-5xl bg-[var(--bg-secondary)] rounded-xl shadow-sm p-8">

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@hotel.com"
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>

              {/* Role — Full Width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Admin Role
                </label>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-white
                    border border-gray-300
                    rounded-xl
                    px-4 py-2
                    text-[var(--text-primary)]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[var(--brand)]
                  "
                >
                  <option value="ADMIN">Admin (Front Desk)</option>
                  <option value="DINING_ADMIN">Dining Admin (Kitchen)</option>
                </select>

                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Dining Admin can manage menu items and order statuses only
                </p>
              </div>


            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[var(--brand)] text-white px-8 py-2 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Admin"}
              </button>
            </div>

          </form>

        </div>
      </div>
    </AdminLayout>
  );
}
