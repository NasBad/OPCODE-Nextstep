import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout, register as apiRegister } from "../api/auth.api";
import { getProfile } from "../api/user.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: if a token exists, load the user profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    getProfile()
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const register = async ({ name, email, password }) => {
    const res = await apiRegister({ name, email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const login = async ({ email, password }) => {
    const res = await apiLogin({ email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const logout = async () => {
    try { await apiLogout(); } catch { /* ignore */ }
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
