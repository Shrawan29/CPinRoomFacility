import { createContext, useContext, useEffect, useState } from "react";

const GuestAuthContext = createContext();

export function GuestAuthProvider({ children }) {
  const [guest, setGuest] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Restore auth on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("guest_token");
    const storedGuest = localStorage.getItem("guest_data");

    if (storedToken && storedGuest) {
      setToken(storedToken);
      setGuest(JSON.parse(storedGuest));
    }

    setLoading(false);
  }, []);


  const login = (sessionId, guest) => {
    setToken(sessionId);
    setGuest(guest);

    // 🔑 THIS IS REQUIRED
    localStorage.setItem("guest_session", sessionId);
  };



  const logout = () => {
    setToken(null);
    setGuest(null);
    localStorage.removeItem("guest_session");
  };


  return (
    <GuestAuthContext.Provider
      value={{ guest, token, login, logout, loading }}
    >
      {children}
    </GuestAuthContext.Provider>
  );
}

export function useGuestAuth() {
  return useContext(GuestAuthContext);
}
