import api from "./api.js";

export const getKitchenMenu = async () => {
  const res = await api.get("/menu/kitchen");
  return res.data;
};

export const createMenuItem = async (data) => {
  const res = await api.post("/menu/kitchen", data);
  return res.data;
};

export const updateMenuItem = async (id, data) => {
  const res = await api.put(`/menu/kitchen/${id}`, data);
  return res.data;
};

export const deleteMenuItem = async (id) => {
  const res = await api.delete(`/menu/kitchen/${id}`);
  return res.data;
};

export const getGuestMenu = async () => {
  const res = await api.get("/menu/guest");
  return res.data.data;     // ✅ unwrap here
};

