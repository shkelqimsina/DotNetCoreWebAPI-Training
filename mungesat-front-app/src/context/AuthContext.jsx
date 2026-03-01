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

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]) || "{}");
        setUser({ userName: payload.given_name || payload.email, email: payload.email });
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (username, password) => {
    const response = await api.post("/account/login", { username, password });
    const { token: newToken, userName, email } = response.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser({ userName: userName || username, email: email || "" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const register = async (username, emri, mbiemri, email, password) => {
    const response = await api.post("/account/register", {
      username,
      emri,
      mbiemri,
      email,
      password,
    });
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
