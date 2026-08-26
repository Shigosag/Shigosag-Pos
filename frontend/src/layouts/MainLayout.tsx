import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Package,
  DollarSign,
  BarChart3,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  CreditCard
} from "lucide-react";
import CheckoutModal from "../pages/CheckoutModal";

export default function MainLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: DollarSign, label: "Sales", path: "/sales" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`bg-red-600 text-white flex flex-col p-5 transition-all duration-300 ${
          open ? "w-64" : "w-16"
        }`}
      >

        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="mb-6 text-white font-bold hover:bg-red-700 p-2 rounded-lg transition"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? (
            <ChevronLeft size={22} />
          ) : (
            <ChevronRight size={22} />
          )}
        </button>

        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <ShoppingCart size={24} />

          <span
            className={`font-bold text-xl whitespace-nowrap transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            Shigosag POS
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 text-sm">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="relative group">
                <Link
                  to={item.path}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Icon size={21} />

                  <span
                    className={`whitespace-nowrap transition-opacity duration-300 ${
                      open ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>

                {/* Tooltip when collapsed */}
                {!open && (
                  <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={`mt-auto text-xs whitespace-nowrap transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          Powered by Shigosag
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">
            Dashboard
          </h2>

          {/* Checkout */}
          <button
            onClick={() => setOpenCheckout(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
          >
            <CreditCard size={18} />
            Checkout
          </button>
        </header>

        {/* Checkout Modal */}
        {openCheckout && (
          <CheckoutModal
            onClose={() => setOpenCheckout(false)}
          />
        )}

        {/* Page Content */}
        <main className="p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
