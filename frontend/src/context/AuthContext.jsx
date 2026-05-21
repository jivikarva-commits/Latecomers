import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    try { await api.post("/auth/logout"); } catch {}
    // Sign out from Google too (clears their session so next login shows account picker)
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    setUser(null);
    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider value={{
      user, setUser, loading, refresh, logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
