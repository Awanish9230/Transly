// src/utils/api.js
import axios from "axios";

// 🌐 Base API URL (Express backend)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// 🧩 Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach JWT token from stored user to every request
api.interceptors.request.use(
  (config) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = user?.token;
      if (token && token !== "undefined") {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn("Failed to parse user token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Global response interceptor for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("⚠️ Unauthorized — redirecting to login...");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        console.error(
          `❌ API Error [${error.response.status}]:`,
          error.response.data?.message || error.message
        );
      }
    } else {
      console.error("❌ Network or CORS error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
