import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { createAdmin } from "../../../services/admin.service";
import { useAdminAuth } from "../../../context/AdminAuthContext";

export default function CreateAdmin() {
  const { admin, loading: authLoading } = useAdminAuth();

  const roleOptions =
    admin?.role === "DINING_ADMIN"
      ? [
          { value: "HOUSEKEEPING_SUPERVISOR", label: "Housekeeping Supervisor" },
          { value: "HOUSEKEEPING_STAFF", label: "Housekeeping Staff" },
        ]
      : [
          { value: "DINING_ADMIN", label: "Kitchen Admin" },
          { value: "HOUSEKEEPING_ADMIN", label: "Housekeeping Admin" },
          { value: "HOUSEKEEPING_SUPERVISOR", label: "Housekeeping Supervisor" },
          { value: "HOUSEKEEPING_STAFF", label: "Housekeeping Staff" },
        ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: roleOptions[0].value,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState("");

  const supervisorAppLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/admin/housekeeping/supervisor`
      : "/admin/housekeeping/supervisor";

  useEffect(() => {
    if (!roleOptions.some((option) => option.value === form.role)) {
      setForm((prev) => ({ ...prev, role: roleOptions[0].value }));
    }
  }, [admin?.role]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generatePassword = () => {
    const random = Math.random().toString(36).slice(-6);
    const generated = `CP@${random}9`;
    setForm((prev) => ({ ...prev, password: generated }));
  };

  const generateLoginId = () => {
    const cleanName = String(form.name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/^\.+|\.+$/g, "")
      .slice(0, 24);

    const rolePrefix = form.role === "HOUSEKEEPING_SUPERVISOR" ? "sup" : "staff";
    const suffix = String(Date.now()).slice(-4);
    const generated = `${cleanName || rolePrefix}.${rolePrefix}${suffix}@cpstaff.local`;

    setForm((prev) => ({ ...prev, email: generated }));
  };

  const copyText = async (value, label) => {
    try {
      if (!value) return;
      await navigator.clipboard.writeText(value);
      setCopyFeedback(`${label} copied`);
      setTimeout(() => setCopyFeedback(""), 1800);
    } catch {
      setCopyFeedback(`Unable to copy ${label.toLowerCase()}`);
      setTimeout(() => setCopyFeedback(""), 1800);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setCopyFeedback("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        email: String(form.email || "").trim().toLowerCase(),
        phone: String(form.phone || "").trim(),
      };

      await createAdmin(payload);
      setSuccess("Login generated successfully");
      setCreatedCredentials({
        role: payload.role,
        loginId: payload.email,
        password: payload.password,
        appLink: supervisorAppLink,
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: roleOptions[0].value,
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
          {admin?.role === "DINING_ADMIN"
            ? "Create Supervisor/Staff Login"
            : "Create New Admin"}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {admin?.role === "DINING_ADMIN"
            ? "Create login credentials for housekeeping supervisors and staff"
            : "Add a new admin for hotel operations"}
        </p>
      </div>

      {authLoading && (
        <div className="mb-4 p-3 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)] text-sm">
          Loading permissions...
        </div>
      )}

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

          {createdCredentials && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
              <p className="font-semibold mb-2">Created Login Credentials</p>
              <p>
                Role: <span className="font-medium">{createdCredentials.role.replaceAll("_", " ")}</span>
              </p>
              <p>
                Login ID: <span className="font-mono">{createdCredentials.loginId}</span>
              </p>
              <p>
                Password: <span className="font-mono">{createdCredentials.password}</span>
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      `Login ID: ${createdCredentials.loginId}\nPassword: ${createdCredentials.password}`,
                      "Credentials"
                    )
                  }
                  className="px-3 py-2 rounded-lg border border-green-300 bg-white text-xs font-semibold"
                >
                  Copy Credentials
                </button>

                <button
                  type="button"
                  onClick={() => copyText(createdCredentials.appLink, "App link")}
                  className="px-3 py-2 rounded-lg border border-green-300 bg-white text-xs font-semibold"
                >
                  Copy App Link
                </button>
              </div>

              <p className="mt-3 mb-1 font-medium">Phone Download/Login Link</p>
              <a
                href={createdCredentials.appLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs break-all underline"
              >
                {createdCredentials.appLink}
              </a>

              <p className="mt-2 text-xs text-green-800">
                Share this link with supervisor/staff. They can login and install the app using Add to Home screen.
              </p>

              {copyFeedback && <p className="mt-2 text-xs font-medium">{copyFeedback}</p>}
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
                <div className="flex gap-2">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@hotel.com"
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                  <button
                    type="button"
                    onClick={generateLoginId}
                    className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white"
                  >
                    Generate
                  </button>
                </div>
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
                <div className="flex gap-2">
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white"
                  >
                    Generate
                  </button>
                </div>
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
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {admin?.role === "DINING_ADMIN"
                    ? "Kitchen admin can create only supervisor/staff logins"
                    : "Choose which area this admin can manage"}
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
