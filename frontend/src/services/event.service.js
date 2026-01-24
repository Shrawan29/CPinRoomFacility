import api from "./api";

export const getEvents = async () => {
  const res = await api.get("/admin/events");
  return res.data;
};

export const createEvent = async (data) => {
  const res = await api.post("/admin/events", data);
  return res.data;
};

export const updateEvent = async (id, data) => {
  const res = await api.put(`/admin/events/${id}`, data);
  return res.data;
};

export const deleteEvent = async (id) => {
  await api.delete(`/admin/events/${id}`);
};