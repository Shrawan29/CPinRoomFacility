import api from "./api";

export const getKitchenMenu = (token) =>
  api.get("/menu/kitchen", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createMenuItem = (data, token) =>
  api.post("/menu/kitchen", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateMenuItem = (id, data, token) =>
  api.put(`/menu/kitchen/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteMenuItem = (id, token) =>
  api.delete(`/menu/kitchen/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getGuestMenu = () =>
  api.get("/menu/guest");
