import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import {
  Home, Package, DollarSign, BarChart3, ShoppingCart, 
  ChevronLeft, ChevronRight, CreditCard, LogOut, UserX 
} from "lucide-react";
import CheckoutModal from "../pages/CheckoutModal";
import { useAuthStore } from "../store/authStore";
import { api } from "../api/api";

export default function MainLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);
  const logout = useAuthStore((s) => s.logout);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: DollarSign, label: "Sales", path: "/sales" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-red-600 text-white flex flex-col transition-all duration-300 ${open ? "w-64 p-5" : "w-16 p-3"}`}>
        
        {/* Toggle Button */}
        <button onClick={() => setOpen(!open)} className={`mb-6 text-white hover:bg-red-700 p-2 rounded-lg transition flex items-center ${open ? "justify-start" : "justify-center"}`}>
          {open ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>

        {/* Logo */}
        <div className={`mb-8 flex items-center ${open ? "gap-2" : "justify-center"}`}>
          <ShoppingCart size={24} className="shrink-0" />
          {open && <span className="font-bold text-xl whitespace-nowrap">Shigosag POS</span>}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 text-sm">
          {menuItems.map((item) => (
            <Link key={item.label} to={item.path} className={`flex items-center p-2 rounded-lg hover:bg-red-700 transition-colors ${open ? "gap-3" : "justify-center"}`}>
              <item.icon size={21} className="shrink-0" />
              {open && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* AUTH ACTIONS */}
        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-red-500">
          <button onClick={() => logout()} className={`flex items-center p-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-bold ${open ? "gap-3" : "justify-center"}`}>
            <LogOut size={20} />
            {open && "Logout"}
          </button>
          
          <button 
            onClick={async () => {
              if(confirm("Delete your ₦10M account forever?")) {
                try { await api.delete("/auth/delete-account"); logout(); } catch(e) { alert("Error deleting"); }
              }
            }}
            className={`flex items-center p-2 rounded-lg hover:bg-black/20 transition-colors text-sm font-bold text-red-200 ${open ? "gap-3" : "justify-center"}`}
          >
            <UserX size={20} />
            {open && "Delete Account"}
          </button>
        </div>

        {/* Footer */}
        {open && <div className="mt-4 text-[10px] opacity-60 text-center">Powered by Shigosag</div>}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
          <h2 className="font-bold text-gray-700">POS Terminal</h2>
          <button onClick={() => setOpenCheckout(true)} className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition flex items-center gap-2 font-bold shadow-lg shadow-red-100">
            <CreditCard size={18} /> Checkout
          </button>
        </header>

        <main className="p-6 overflow-auto flex-1">{children}</main>
      </div>

      {openCheckout && <CheckoutModal onClose={() => setOpenCheckout(false)} />}
    </div>
  );
}
