import axios from "axios";

// Në prodhim vendosni VITE_API_URL (p.sh. https://emungesat.shkolla.edu) gjatë build; për dev përdoret /api (proxy).
const apiBase = import.meta.env.VITE_API_URL
  ? `${String(import.meta.env.VITE_API_URL).replace(/\/$/, "")}/api`
  : "/api";

const axiosInstance = axios.create({
  baseURL: apiBase,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
