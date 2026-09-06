import React, { useState } from "react";
import { User, Shield, Bell, Database, Trash2, Save } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function Settings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar Nav */}
      <div className="w-full md:w-64 space-y-2">
        {[
          { id: "profile", label: "Profile", icon: User },
          { id: "security", label: "Security", icon: Shield },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "system", label: "System Config", icon: Database },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
              activeTab === tab.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <tab.icon size={20} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
        {activeTab === "profile" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black text-gray-900">Profile Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Full Name</label>
                  <input className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold" defaultValue={user?.name} />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Email Address</label>
                  <input className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold" defaultValue={user?.email} />
               </div>
            </div>
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition">
              <Save size={18} /> Update Profile
            </button>
          </div>
        )}

        {activeTab === "security" && (
           <div className="space-y-8">
              <h2 className="text-2xl font-black text-gray-900">Security & Authentication</h2>
              <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex justify-between items-center">
                 <div>
                    <p className="font-black text-rose-900">Delete Account</p>
                    <p className="text-xs text-rose-600 font-medium">Permanently remove all data and terminal access</p>
                 </div>
                 <button className="bg-rose-600 text-white p-3 rounded-xl hover:bg-rose-700 transition">
                    <Trash2 size={20} />
                 </button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
