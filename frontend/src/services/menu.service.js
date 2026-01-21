import api from "./api";

export const getKitchenMenu = () =>
  api.get("/menu/kitchen");

export const createMenuItem = (data) =>
  api.post("/menu/kitchen", data);

export const updateMenuItem = (id, data) =>
  api.put(`/menu/kitchen/${id}`, data);

export const deleteMenuItem = (id) =>
  api.delete(`/menu/kitchen/${id}`);

export const getGuestMenu = () =>
  api.get("/menu/guest");
