import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Përdorim URL relative që Vite t’i dërgojë te API (proxy)
const apiBase = import.meta.env.VITE_API_URL
  ? `${String(import.meta.env.VITE_API_URL).replace(/\/$/, "")}/api`
  : "/api";
const api = axios.create({
  baseURL: apiBase,
  headers: { "Content-Type": "application/json" },
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState("");

  // Kur kemi token, marrim rolin nga /account/me (serveri përdor prioritet: Administrator > Drejtori > Kujdestar > Prindi)
  useEffect(() => {
    if (!token) {
      setUser(null);
      setRole("");
      return;
    }
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    api
      .get("/account/me")
      .then((res) => {
        const data = res.data;
        const serverRole = data.role || "";
        setRole(serverRole);
        setUser({
          userName: data.userName,
          email: data.email ?? "",
          role: serverRole,
        });
      })
      .catch(() => {
        setUser(null);
        setRole("");
      });
  }, [token]);

  const login = async (username, password) => {
    const response = await api.post("/account/login", { username, password });
    const { token: newToken, userName, email, role: userRole } = response.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setRole(userRole || "");
    setUser({ userName: userName || username, email: email || "", role: userRole || "" });
    return { role: userRole || "" };
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setRole("");
  };

  const register = async (username, emri, mbiemri, email, password, role = "Kujdestar", adminUserName, adminPassword) => {
    const body = {
      username,
      emri,
      mbiemri,
      email,
      password,
      role: role === "Prindi" ? "Prindi" : role === "Drejtori" ? "Drejtori" : "Kujdestar",
    };
    if ((role === "Kujdestar" || role === "Drejtori") && (adminUserName != null && adminUserName !== "")) {
      body.adminUserName = adminUserName;
      body.adminPassword = adminPassword ?? "";
    }
    const response = await api.post("/account/register", body);
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
  const isPrindi = role === "Prindi";
  const isDrejtori = role === "Drejtori";

  return (
    <AuthContext.Provider value={{ user, token, role, isAdministrator, isKujdestar, isPrindi, isDrejtori, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
