import api from "./api";

export const guestChat = async ({ message, history }) => {
  const res = await api.post("/guest/chat", {
    message,
    history: Array.isArray(history) ? history : [],
  });
  return res.data;
};
