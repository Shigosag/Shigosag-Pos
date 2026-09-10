// ================================================================================
// FILE: frontend/src/layouts/MainLayout.tsx
// ================================================================================

import React, { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, Package, DollarSign, BarChart3, ShoppingCart, 
  ChevronLeft, ChevronRight, CreditCard, LogOut, Settings as SettingsIcon, Menu, X
} from "lucide-react";
import CheckoutModal from "../pages/CheckoutModal";
import { useAuthStore } from "../store/authStore";
import { api } from "../api/api";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

export default function MainLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "error" | "success" } | null>(null);
  
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: DollarSign, label: "Sales", path: "/sales" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" }
  ];

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/auth/delete-account");
      logout();
    } catch (e) {
      setToast({ msg: "Failed to delete account", type: "error" });
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {showDeleteModal && (
        <ConfirmModal 
          title="Delete Account?" 
          message="This will permanently deactivate your records and terminal access." 
          onConfirm={handleDeleteAccount} 
          onCancel={() => setShowDeleteModal(false)} 
        />
      )}

      {/* 1. DESKTOP / ROTATED PHONE SIDEBAR */}
      <aside className={`hidden md:flex bg-indigo-600 text-white flex-col transition-all duration-300 shadow-2xl z-20 ${open ? "w-64 p-5" : "w-20 p-4"}`}>
        <button 
          onClick={() => setOpen(!open)} 
          aria-label="Toggle Navigation"
          className={`mb-6 text-white hover:bg-indigo-500 p-2 rounded-xl transition-all flex items-center ${open ? "justify-start" : "justify-center"}`}
        >
          {open ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>

        <Link 
          to="/" 
          className={`mb-8 flex items-center hover:bg-indigo-500 p-2 rounded-2xl transition-all ${open ? "gap-3" : "justify-center"}`}
        >
          <div className="bg-white/20 p-2 rounded-xl">
            <ShoppingCart size={24} className="shrink-0 text-white" />
          </div>
          {open && <span className="font-black text-lg tracking-tight">Shigosag POS</span>}
        </Link>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.label} 
                to={item.path} 
                className={`flex items-center p-3 rounded-2xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-white text-indigo-600 shadow-lg" 
                    : "hover:bg-indigo-500 text-indigo-100 hover:text-white"
                } ${open ? "gap-3" : "justify-center"}`}
              >
                <item.icon size={22} className="shrink-0" />
                {open && <span className="whitespace-nowrap font-bold text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-white/10">
          <button 
            onClick={() => logout()} 
            className={`flex items-center p-3 rounded-2xl hover:bg-red-500 text-indigo-100 hover:text-white transition-all text-sm font-bold ${open ? "gap-3" : "justify-center"}`}
          >
            <LogOut size={20} />
            {open && "Logout"}
          </button>
        </div>
      </aside>

      {/* 2. MOBILE OVERLAY DRAWER (Slides over cleanly without pushing content down) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 bg-indigo-600 text-white h-full p-6 flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-xl">
                  <ShoppingCart size={22} className="text-white" />
                </div>
                <span className="font-black text-lg">Shigosag POS</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-1 rounded-lg hover:bg-indigo-500 text-white"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-2xl font-bold text-sm transition-all ${
                    location.pathname === item.path ? "bg-white text-indigo-600 shadow-md" : "text-white hover:bg-indigo-500"
                  }`}
                >
                  <item.icon size={20} /> {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-4 border-t border-white/10">
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 text-red-100 hover:bg-red-500 hover:text-white rounded-2xl font-bold text-sm transition-all"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN HEADER & CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 px-6 md:px-8 flex justify-between items-center z-10 border-b border-gray-100">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setMobileMenuOpen(true)}
               className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition"
               aria-label="Open Navigation"
             >
               <Menu size={24} />
             </button>
             <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-indigo-100">
                {user?.name?.charAt(0) || "U"}
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{getGreeting()}</p>
                <h2 className="font-black text-gray-800 leading-tight">Welcome, {user?.name || "Terminal Operator"}</h2>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setOpenCheckout(true)} 
              className="bg-indigo-600 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-2xl hover:bg-indigo-700 transition-all flex items-center gap-2 font-black shadow-xl shadow-indigo-100 text-xs md:text-sm active:scale-95"
            >
              <CreditCard size={18} /> Checkout
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6 overflow-auto flex-1 bg-[#f8fafc]">
          {children}
        </main>
      </div>

      {openCheckout && <CheckoutModal onClose={() => setOpenCheckout(false)} />}
    </div>
  );
}
