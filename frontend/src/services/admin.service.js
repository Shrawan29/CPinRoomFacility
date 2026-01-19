import api from "./api";

export const adminLogin = async (email, password) => {
  const res = await api.post("/admin/login", {
    email,
    password,
  });

  return res.data;
};

export const createAdmin = async (adminData, token) => {
  const res = await api.post("/admin/create", adminData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

/* GET ADMINS */
export const getAllAdmins = async (token) => {
  const res = await api.get("/admin/manage/admins", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
export const toggleAdminStatus = async (adminId, token) => {
  const res = await api.patch(
    `/admin/manage/deactivate/${adminId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data.admin;
};

/* UPDATE ADMIN */
export const updateAdmin = async (adminId, payload, token) => {
  const res = await api.patch(`/admin/manage/update/${adminId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.admin;
};

/* DELETE ADMIN */
export const deleteAdmin = async (adminId, token) => {
  const res = await api.delete(`/admin/manage/delete/${adminId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.admin;
};
