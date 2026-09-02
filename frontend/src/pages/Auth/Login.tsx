import React, { useState } from "react";
import { api } from "../../api/api";
import { useAuthStore } from "../../store/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input className="w-full p-4 bg-gray-50 border rounded-2xl outline-none" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
          <input type="password" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
          <button className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold">Login</button>
        </form>
        <p className="mt-6 text-center text-sm">Don't have an account? <Link to="/register" className="text-red-600 font-bold">Sign Up</Link></p>
      </div>
    </div>
  );
}
