import React, { useState } from "react";
import { api } from "../../api/api";
import { useAuthStore } from "../../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, UserPlus, AlertCircle } from "lucide-react";
import AuthLayout from "../../components/AuthLayout";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "error" | "success" } | null>(null);
  
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null); // Clear previous errors
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.data.user, res.data.data.token);
      navigate("/");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "An account with this email already exists.";
      setToast({ msg: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[45px] shadow-2xl border border-white/20 text-center relative overflow-hidden">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <UserPlus size={32} />
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h2>
        <p className="text-gray-500 mb-8 mt-2">Join Shigosag Institutional POS</p>

        {/* INLINE ERROR BANNER */}
        {toast && toast.type === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in slide-in-from-top-2 duration-300">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-left">{toast.msg}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <input required className="w-full p-4 bg-gray-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold" placeholder="Full Name" onChange={e => setForm({...form, name: e.target.value})} />
          <input required type="email" className="w-full p-4 bg-gray-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
          <input required type="password" className="w-full p-4 bg-gray-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
          
          <button disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex justify-center items-center gap-2 transition-all active:scale-[0.98]">
            {loading ? <Loader2 className="animate-spin" /> : "Sign Up Now"}
          </button>
        </form>
        
        <p className="mt-8 text-gray-400 text-sm font-medium">Already a member? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Login</Link></p>
      </div>
    </AuthLayout>
  );
}
