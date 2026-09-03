import React, { useState } from "react";
import { api } from "../../api/api";
import { useAuthStore } from "../../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, UserPlus } from "lucide-react";
import AuthLayout from "../../components/AuthLayout";
import Toast from "../../components/Toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "error" | "success" } | null>(null);
  
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err: any) {
      setToast({ 
        msg: err.response?.data?.error || "Registration Failed", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[45px] shadow-2xl border border-white/20 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <UserPlus size={32} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h2>
        <p className="text-gray-500 mb-8 mt-2">Get ₦10,000,000 instantly</p>
        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <input required className="w-full p-4 bg-gray-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all" placeholder="Full Name" onChange={e => setForm({...form, name: e.target.value})} />
          <input required type="email" className="w-full p-4 bg-gray-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
          <input required type="password" className="w-full p-4 bg-gray-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
          <button disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-red-700 shadow-lg shadow-red-200 flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Sign Up Now"}
          </button>
        </form>
        <p className="mt-8 text-gray-400 text-sm font-medium">Already a member? <Link to="/login" className="text-red-600 font-bold hover:underline">Login</Link></p>
      </div>
    </AuthLayout>
  );
}
