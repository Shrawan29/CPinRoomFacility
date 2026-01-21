import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import {
  getAllAdmins,
  toggleAdminStatus,
  updateAdmin,
  deleteAdmin
} from "../../../services/admin.service";

import { useAdminAuth } from "../../../context/AdminAuthContext";



export default function AdminList() {

  const { token, loading: authLoading } = useAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);

  // 🔹 Fetch admins

    useEffect(() => {
      if (authLoading || !token) {
        setLoading(authLoading);
        return;
      }

      const fetchAdmins = async () => {
        try {
          const data = await getAllAdmins();
          setAdmins(Array.isArray(data) ? data : []);
        } catch (err) {
          setError(
            err.response?.data?.message || "Failed to load admins"
          );
          setAdmins([]); // 🔐 prevent undefined
        } finally {
          setLoading(false);
        }
      };

      fetchAdmins();
    }, [token, authLoading]);



    // 🔹 Activate / Deactivate handler
    const handleToggleStatus = async (adminId) => {
      const confirmAction = window.confirm(
        "Are you sure you want to change this admin's status?"
      );

      if (!confirmAction) return;

      setUpdatingId(adminId);

      try {
        const updatedAdmin = await toggleAdminStatus(adminId);

        if (!updatedAdmin || !updatedAdmin._id) {
          throw new Error("Invalid admin response");
        }

        setAdmins((prev) =>
          Array.isArray(prev)
            ? prev.map((a) =>
              a && a._id === updatedAdmin._id ? updatedAdmin : a
            )
            : []
        );
      } catch (err) {
        alert(
          err.response?.data?.message ||
          err.message ||
          "Failed to update admin status"
        );
      } finally {
        setUpdatingId(null);
      }
    };
    const handleEditClick = (admin) => {
      setEditingAdmin({
        _id: admin._id,
        role: admin.role,
        phone: admin.phone
      });
    };

    const handleUpdateAdmin = async () => {
      if (!editingAdmin?._id) return;

      try {
        const updated = await updateAdmin(
          editingAdmin._id,
          {
            role: editingAdmin.role,
            phone: editingAdmin.phone,
          }
        );

        setAdmins((prev) =>
          prev.map((a) =>
            a._id === updated._id ? updated : a
          )
        );

        setEditingAdmin(null);
      } catch (err) {
        console.error(err);
        alert("Update failed");
      }
    };


    const handleDeleteAdmin = async (adminId) => {
      const confirmDelete = window.confirm(
        "This will deactivate the admin. Continue?"
      );

      if (!confirmDelete) return;

      try {
        const deleted = await deleteAdmin(adminId);

        setAdmins((prev) =>
          prev.map((a) =>
            a._id === deleted._id ? deleted : a
          )
        );
      } catch (err) {
        alert(err.response?.data?.message || "Delete failed");
      }
    };



    return (
      <AdminLayout>

        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            Manage Admins
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            View and manage all admin accounts
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 text-[var(--text-muted)]">
            Loading admins…
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="bg-[var(--bg-secondary)] rounded-xl shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-black/5 text-left text-sm text-[var(--text-muted)]">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {admins.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-6 text-center text-[var(--text-muted)]"
                    >
                      No admins found
                    </td>
                  </tr>
                ) : (
                  admins
                    .filter(Boolean)
                    .map((admin) => (
                      <tr
                        key={admin._id}
                        className="border-t border-black/10 hover:bg-black/5 transition"
                      >
                        <td className="px-5 py-4 text-[var(--text-primary)]">
                          {admin.name}
                        </td>

                        <td className="px-5 py-4 text-[var(--text-muted)]">
                          {admin.email}
                        </td>

                        <td className="px-5 py-4 text-[var(--text-muted)]">
                          {admin.phone}
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4">
                          <span
                            className={`
                            px-3 py-1 rounded-full text-xs font-medium
                            ${admin.role === "SUPER_ADMIN"
                                ? "bg-purple-100 text-purple-700"
                                : admin.role === "ADMIN"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-orange-100 text-orange-700"
                              }
                          `}
                          >
                            {admin.role.replace("_", " ")}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`text-xs font-medium ${admin.isActive
                              ? "text-green-700"
                              : "text-red-600"
                              }`}
                          >
                            {admin.isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>


                        {/* Actions */}
                        <td className="px-5 py-4 text-right space-x-3 text-sm">
                          <button
                            onClick={() => handleEditClick(admin)}
                            className="text-[var(--brand)] hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteAdmin(admin._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>


                          {admin.isActive ? (
                            <button
                              onClick={() => handleToggleStatus(admin._id)}
                              disabled={updatingId === admin._id}
                              className={`hover:underline ${updatingId === admin._id
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-orange-600"
                                }`}
                            >
                              {updatingId === admin._id ? "Deactivating..." : "Deactivate"}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(admin._id)}
                              disabled={updatingId === admin._id}
                              className={`hover:underline ${updatingId === admin._id
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-green-700"
                                }`}
                            >
                              {updatingId === admin._id ? "Activating..." : "Activate"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {editingAdmin && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                Edit Admin
              </h3>

              <label className="block mb-2 text-sm">Phone</label>
              <input
                value={editingAdmin.phone || ""}
                onChange={(e) =>
                  setEditingAdmin({ ...editingAdmin, phone: e.target.value })
                }
              />

              <label className="block mb-2 text-sm">Role</label>
              <select
                value={editingAdmin.role}
                onChange={(e) =>
                  setEditingAdmin({ ...editingAdmin, role: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mb-6"
              >
                <option value="ADMIN">Admin</option>
                <option value="DINING_ADMIN">Dining Admin</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingAdmin(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAdmin}
                  className="px-4 py-2 bg-[var(--brand)] text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}


      </AdminLayout>
    );
  }
