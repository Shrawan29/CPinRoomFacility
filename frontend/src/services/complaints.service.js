import api from "./api";

export const submitComplaint = async ({ type, category, subject, message }) => {
  const res = await api.post("/api/complaints", {
    type,
    category,
    subject,
    message,
  });
  return res.data;
};

export const getComplaintsAdmin = async () => {
  const res = await api.get("/api/complaints");
  return res.data;
};
