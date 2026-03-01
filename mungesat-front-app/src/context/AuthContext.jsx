import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Përdorim URL relative që Vite t’i dërgojë te API (proxy)
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const getRoleFromToken = (payload) =>
    payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "";

  const [role, setRole] = useState(() => {
    try {
      const t = localStorage.getItem("token");
      if (!t) return "";
      const payload = JSON.parse(atob(t.split(".")[1]) || "{}");
      return getRoleFromToken(payload);
    } catch {
      return "";
    }
  });

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]) || "{}");
        const roleClaim = getRoleFromToken(payload);
        setUser({
          userName: payload.given_name || payload.email,
          email: payload.email,
          role: roleClaim || role,
        });
        if (roleClaim) setRole(roleClaim);
      } catch {
        setUser(null);
        setRole("");
      }
    } else {
      setUser(null);
      setRole("");
    }
  }, [token]);

  const login = async (username, password) => {
    const response = await api.post("/account/login", { username, password });
    const { token: newToken, userName, email, role: userRole } = response.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setRole(userRole || "");
    setUser({ userName: userName || username, email: email || "", role: userRole || "" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setRole("");
  };

  const register = async (username, emri, mbiemri, email, password) => {
    const response = await api.post("/account/register", {
      username,
      emri,
      mbiemri,
      email,
      password,
    });
    const data = response.data;
    if (data.token) {
      setToken(data.token);
      setRole(data.role || "");
      setUser({ userName: data.userName, email: data.email || "", role: data.role || "" });
    }
    return data;
  };

  const isAdministrator = role === "Administrator";
  const isKujdestar = role === "Kujdestar";

  return (
    <AuthContext.Provider value={{ user, token, role, isAdministrator, isKujdestar, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
