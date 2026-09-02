import React, { useState } from "react";
import { api } from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // UI-based error, no browser alert
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800 p-4">
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-[40px] shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-4xl font-black text-gray-800 mb-2 text-center tracking-tight">Create Account</h2>
        <p className="text-gray-500 text-center mb-8 font-medium">Join Shigosag POS and get ₦10M</p>
        
        {/* Modern UI Error Message (Replaces browser alert) */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-3 rounded-xl animate-in fade-in zoom-in">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            required
            className="w-full p-4 bg-gray-100/50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            placeholder="Full Name" 
            onChange={e => setForm({...form, name: e.target.value})} 
          />
          <input 
            required
            type="email"
            className="w-full p-4 bg-gray-100/50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            placeholder="Email Address" 
            onChange={e => setForm({...form, email: e.target.value})} 
          />
          <input 
            required
            type="password" 
            className="w-full p-4 bg-gray-100/50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            placeholder="Password" 
            onChange={e => setForm({...form, password: e.target.value})} 
          />
          <button 
            disabled={loading}
            className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-red-700 active:scale-95 transition-all flex justify-center items-center gap-2 shadow-lg shadow-red-200"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Already have an account? <Link to="/login" className="text-red-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
