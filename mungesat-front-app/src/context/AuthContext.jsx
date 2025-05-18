import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5050/api/Kujdestaret", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUser(response.data))
        .catch(() => logout());
    }
  }, [token]);

  // LOGIN FUNCTION (Authenticates user and fetches user info)
  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5050/api/account/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);

      // Fetch user info after login
      const userResponse = await axios.get(
        "http://localhost:5050/api/Kujdestaret",
        {
          headers: { Authorization: `Bearer ${response.data.token}` },
        }
      );
      setUser(userResponse.data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // LOGOUT FUNCTION (removes token and user)
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // REGISTER FUNCTION
  const register = async (username, emri, mbiemri, email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5050/api/account/register",
        {
          username,
          emri,
          mbiemri,
          email,
          password,
        }
      );

      console.log("Registration successful:", response.data);
      return response.data; // Return data to handle in UI if needed
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
