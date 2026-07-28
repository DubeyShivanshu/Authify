import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const { data } = await api.get("/dashboard");
          setUser(data.user);
        } catch {
          localStorage.removeItem("accessToken");
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const signup = async (name, email, password) => {
    const { data } = await api.post("/signup", { name, email, password });
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await api.post("/login", { email, password });
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
