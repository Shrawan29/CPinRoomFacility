import api from "./api";

export const adminLogin = async (email, password) => {
  const res = await api.post("/admin/login", {
    email,
    password,
  });

  return res.data;
};

export const createAdmin = async (adminData) => {
  const res = await api.post("/admin/manage/create", adminData);

  return res.data;
};

/* GET ADMINS */
export const getAllAdmins = async () => {
  const res = await api.get("/admin/manage/admins");

  // ✅ Normalize response safely
  if (Array.isArray(res.data)) {
    return res.data;
  }

  if (Array.isArray(res.data.admins)) {
    return res.data.admins;
  }

  return []; // ⛑️ ALWAYS return array
};

/* TOGGLE ACTIVE */
export const toggleAdminStatus = async (adminId) => {
  const res = await api.patch(
    `/admin/manage/deactivate/${adminId}`,
    {},
  );
  return res.data.admin;
};

/* UPDATE ADMIN */
export const updateAdmin = async (adminId, payload) => {
  const res = await api.patch(`/admin/manage/update/${adminId}`, payload);
  return res.data.admin;
};

/* DELETE ADMIN */
export const deleteAdmin = async (adminId) => {
  const res = await api.delete(`/admin/manage/delete/${adminId}`);
  return res.data.admin;
};
