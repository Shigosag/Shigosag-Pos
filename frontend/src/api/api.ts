import axios from "axios";

const isProd = import.meta.env.PROD;
const BASE_URL = isProd 
  ? `${window.location.origin}/api` 
  : (import.meta.env.VITE_API_URL || "http://localhost:5000/api");

export const api = axios.create({ 
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getSocketUrl = () => {
  return isProd ? window.location.origin : "http://localhost:5000";
};
