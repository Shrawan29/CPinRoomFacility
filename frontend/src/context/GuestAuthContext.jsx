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

    if (storedToken && storedGuest && storedGuest !== "undefined") {
      setToken(storedToken);
      try {
        setGuest(JSON.parse(storedGuest));
      } catch (e) {
        setGuest(null);
        localStorage.removeItem("guest_data");
      }
    }

    setLoading(false);
  }, []);


  const login = (sessionId, guest) => {
    setToken(sessionId);
    setGuest(guest);

    // 🔑 Store in localStorage for persistence
    localStorage.setItem("guest_session", sessionId);
    localStorage.setItem("guest_token", sessionId);
    localStorage.setItem("guest_data", JSON.stringify(guest));
  };



  const logout = () => {
    setToken(null);
    setGuest(null);
    localStorage.removeItem("guest_session");
    localStorage.removeItem("guest_token");
    localStorage.removeItem("guest_data");
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
