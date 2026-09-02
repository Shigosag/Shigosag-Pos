import React, { useState } from "react";
import { api } from "../../api/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      alert("Account created! You have ₦10,000,000.00 ready.");
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-black text-gray-800 mb-2 text-center">Create Account</h2>
        <p className="text-gray-500 text-center mb-8">Join Shigosag POS and get ₦10M</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-red-500"
            placeholder="Full Name" 
            onChange={e => setForm({...form, name: e.target.value})} 
          />
          <input 
            className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-red-500"
            placeholder="Email Address" 
            onChange={e => setForm({...form, email: e.target.value})} 
          />
          <input 
            type="password" 
            className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-red-500"
            placeholder="Password" 
            onChange={e => setForm({...form, password: e.target.value})} 
          />
          <button className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-red-700">
            Sign Up
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-red-600 font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}
