import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const guestClient = axios.create({ baseURL });
const adminClient = axios.create({ baseURL });

const getGuestSession = () => localStorage.getItem("guest_session");
const getAdminToken = () => localStorage.getItem("admin_token");

const redirectGuestExpired = () => {
  localStorage.removeItem("guest_session");
  localStorage.removeItem("guest_token");
  localStorage.removeItem("guest_data");

  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/guest/access-fallback")) {
    window.location.assign("/guest/access-fallback?reason=session-expired");
  }
};

const redirectAdminExpired = () => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_data");

  if (typeof window !== "undefined" && window.location.pathname !== "/") {
    window.location.assign("/");
  }
};

guestClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      redirectGuestExpired();
    }
    return Promise.reject(error);
  },
);

adminClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      redirectAdminExpired();
    }
    return Promise.reject(error);
  },
);

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

export const getHousekeepingRequestsAdmin = async ({ status } = {}) => {
  const token = getAdminToken();
  const res = await adminClient.get("/api/housekeeping", {
    params: status ? { status } : {},
    headers: {
      Authorization: `Bearer ${token}`,
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
