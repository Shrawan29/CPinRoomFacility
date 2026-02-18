import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const guestClient = axios.create({ baseURL });
const adminClient = axios.create({ baseURL });

const getGuestSession = () => localStorage.getItem("guest_session");
const getAdminToken = () => localStorage.getItem("admin_token");

export const createHousekeepingRequest = async ({ items, note }) => {
  const session = getGuestSession();
  const res = await guestClient.post(
    "/api/housekeeping/request",
    { items, note },
    {
      headers: {
        "x-guest-session": session,
      },
    },
  );
  return res.data;
};

export const getHousekeepingRequests = async ({ status } = {}) => {
  const session = getGuestSession();
  const res = await guestClient.get("/api/housekeeping", {
    params: status ? { status } : {},
    headers: {
      "x-guest-session": session,
    },
  });
  return res.data;
};

export const acceptHousekeepingRequest = async (id) => {
  const token = getAdminToken();
  const res = await adminClient.patch(`/api/housekeeping/${id}/accept`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const completeHousekeepingRequest = async (id) => {
  const token = getAdminToken();
  const res = await adminClient.patch(`/api/housekeeping/${id}/complete`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
