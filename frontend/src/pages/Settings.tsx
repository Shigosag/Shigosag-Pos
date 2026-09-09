import React, { useState } from "react";
import { User, Shield, Trash2, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { api } from "../api/api";
import ConfirmModal from "../components/ConfirmModal";

export default function Settings() {
  const { user, login, token, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const payload: any = { name, email };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      const res = await api.put("/auth/profile", payload);
      login({ ...user, ...res.data.data }, token || "");
      setStatus({ msg: "Settings saved successfully", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setStatus({ msg: err.response?.data?.message || "Failed to update profile", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/auth/delete-account");
      logout();
    } catch (e) {
      setStatus({ msg: "Failed to delete account", type: "error" });
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
      {showDeleteModal && (
        <ConfirmModal 
          title="Deactivate Terminal Account?"
          message="This action will revoke terminal liquidity and disable login credentials."
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* Nav Tabs */}
      <div className="w-full md:w-56 space-y-2">
        <button
          onClick={() => { setActiveTab("profile"); setStatus(null); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
            activeTab === "profile" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-600 bg-white hover:bg-gray-50"
          }`}
        >
          <User size={18} /> Profile Details
        </button>
        <button
          onClick={() => { setActiveTab("security"); setStatus(null); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
            activeTab === "security" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-600 bg-white hover:bg-gray-50"
          }`}
        >
          <Shield size={18} /> Security & Vault
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="flex-1 bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 md:p-8">
        {status && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${
            status.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}>
            {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {status.msg}
          </div>
        )}

        {activeTab === "profile" && (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <h2 className="text-xl font-black text-gray-900">Operator Profile</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Terminal Operator Name</label>
                <input 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-600" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-600" 
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-black text-gray-900 mb-3">Change Security PIN / Password</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input 
                  type="password" 
                  placeholder="Current Password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="p-4 bg-gray-50 rounded-2xl border-none text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <input 
                  type="password" 
                  placeholder="New Password (min 8 chars)" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="p-4 bg-gray-50 rounded-2xl border-none text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              <Save size={18} /> {loading ? "Updating..." : "Save Preferences"}
            </button>
          </form>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900">Security & Ledger Controls</h2>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="font-bold text-slate-800">Terminal Role</p>
               <p className="text-xs text-slate-500 mt-1">Assigned tier: <span className="font-black text-indigo-600">{user?.role || "CASHIER"}</span></p>
            </div>

            <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex justify-between items-center">
               <div>
                  <p className="font-black text-rose-900">Decommission Terminal</p>
                  <p className="text-xs text-rose-600 font-medium">Permanently disable access for this terminal operator</p>
               </div>
               <button 
                 onClick={() => setShowDeleteModal(true)}
                 className="bg-rose-600 text-white p-3.5 rounded-2xl hover:bg-rose-700 transition"
               >
                  <Trash2 size={20} />
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
