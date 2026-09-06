import axios from "axios";

const isProd = import.meta.env.PROD;
// In Production, the backend serves the frontend from the same origin
const BASE_URL = isProd 
  ? `${window.location.origin}/api` 
  : (import.meta.env.VITE_API_URL || "http://localhost:5000/api");

export const api = axios.create({ 
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper for real-time socket connection
export const getSocketUrl = () => {
  return isProd ? window.location.origin : (import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
};
