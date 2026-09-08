import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { 
  Rocket, Wallet, ArrowUpRight, ArrowDownLeft, Users, 
  Package, Landmark, History, Smartphone, Signal, 
  BarChart3, CreditCard, Activity 
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useAuthStore } from "../store/authStore";
import { getSocketUrl } from "../api/api";

export default function Dashboard() {
  const { user, login, token } = useAuthStore();
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  
  // Persist Colored Mode selection
  const [coloredMode, setColoredMode] = useState(() => {
    const saved = localStorage.getItem("terminal_theme");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("terminal_theme", JSON.stringify(coloredMode));
  }, [coloredMode]);

  const chartData = [
    { name: "Mon", sales: 1200 }, { name: "Tue", sales: 2100 }, { name: "Wed", sales: 1800 },
    { name: "Thu", sales: 2400 }, { name: "Fri", sales: 3200 }
  ];

  useEffect(() => {
    const socket = io(getSocketUrl());
    
    // Listen for transaction updates
    socket.on("transaction:new", (tx) => {
      setLiveFeed((prev) => [tx, ...prev.slice(0, 4)]);
    });

    // Real-time Balance Sync (Atomic Update)
    socket.on("balance:update", (newBalance) => {
      if (user) {
        login({ ...user, balance: newBalance }, token || "");
      }
    });

    return () => { socket.disconnect(); };
  }, [user, login, token]);

  const cards = [
    { title: "POS Sales", icon: "🛒", path: "/sales", color: "from-red-500 to-red-600", desc: "Process customer sales" },
    { title: "Products", icon: "📦", path: "/products", color: "from-blue-500 to-blue-600", desc: "Manage inventory" },
    { title: "Customers", icon: "👥", path: "/customers", color: "from-purple-500 to-purple-600", desc: "Customer management" },
    { title: "Transfers", icon: "💸", path: "/pos/transfer", color: "from-green-500 to-green-600", desc: "Send money" },
    { title: "Withdraw", icon: "🏧", path: "/withdraw", color: "from-yellow-500 to-orange-500", desc: "Cash withdrawal" },
    { title: "History", icon: "📜", path: "/history", color: "from-gray-700 to-gray-900", desc: "Transaction history" },
    { title: "Airtime", icon: "📱", path: "/airtime", color: "from-pink-500 to-pink-600", desc: "Recharge airtime" },
    { title: "Data", icon: "📶", path: "/data", color: "from-indigo-500 to-indigo-600", desc: "Buy data plans" },
    { title: "Balance", icon: "💰", path: "/balance", color: "from-teal-500 to-teal-600", desc: "Check account balance" },
    { title: "Analytics", icon: "📊", path: "/analytics", color: "from-slate-600 to-slate-800", desc: "Reports & insights" }
  ];

  // Currency formatting with commas and NGN symbol
  const format = (val: number | string) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return (num || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
            <Rocket size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Shigosag POS</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Real-time Terminal v3.0</p>
          </div>
        </div>

        {/* PERSISTED TOGGLE */}
        <button 
          onClick={() => setColoredMode(!coloredMode)}
          className={`flex items-center gap-3 px-4 py-2 rounded-2xl font-bold text-[10px] transition-all border ${
            coloredMode ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-white text-gray-400 border-gray-100"
          }`}
        >
          {coloredMode ? "COLORED MODE" : "NORMAL MODE"}
          <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${coloredMode ? "bg-indigo-600" : "bg-gray-200"}`}>
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm ${coloredMode ? "translate-x-6" : "translate-x-1"}`} />
          </div>
        </button>
      </div>

      {/* SYSTEM STATUS BANNER */}
      <div className="bg-indigo-600 text-white p-5 rounded-[1.5rem] flex justify-between items-center shadow-xl shadow-indigo-100 transition-all duration-300 transform hover:-translate-y-1">
        <div>
          <h3 className="font-bold text-sm">System Status</h3>
          <p className="text-[11px] opacity-90 font-medium">Global networks stable</p>
        </div>
        <div className="text-sm font-bold flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
           <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" /> 
           <span className="animate-pulse">🟢 Online</span>
        </div>
      </div>

      {/* BALANCE CARD */}
      <div className="bg-white p-10 rounded-[1.5rem] border border-gray-100 shadow-md flex justify-between items-center group hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-1">
        <div>
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Available Balance</p>
          <p className="text-5xl font-black text-emerald-600 tracking-tighter">
            {format(user?.balance || 0)}
          </p>
        </div>
        <div className="p-5 bg-emerald-50 text-emerald-600 rounded-[2rem] shadow-inner">
           <Wallet size={40} />
        </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <h2 className="text-lg font-black text-gray-800 ml-2">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link 
            key={card.title} 
            to={card.path} 
            className={`p-6 rounded-[1.5rem] shadow-sm hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2 ${
              coloredMode 
                ? `bg-gradient-to-br ${card.color} text-white shadow-lg shadow-indigo-50` 
                : "bg-white text-gray-800 border border-gray-100"
            }`}
          >
            <div className="text-4xl mb-4">{card.icon}</div>
            <div className="font-black text-sm uppercase tracking-tight">{card.title}</div>
            <p className={`text-[10px] mt-1 font-bold leading-tight opacity-70`}>{card.desc || card.description}</p>
          </Link>
        ))}
      </div>

      {/* ANALYTICS SECTION */}
      <div className="bg-white p-8 rounded-[1.5rem] border border-gray-100 shadow-sm">
        <h2 className="font-black text-gray-800 mb-8 flex items-center gap-2 uppercase text-xs tracking-widest">
          <BarChart3 size={18} className="text-indigo-600" /> Performance Analytics
        </h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
              <Tooltip 
                contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px'}} 
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#4338ca" 
                strokeWidth={5} 
                dot={{ r: 6, fill: '#4338ca', strokeWidth: 3, stroke: '#fff' }} 
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* STATS SUMMARY GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Gross Sales", val: "₦1.2M", color: "text-indigo-600" },
          { label: "Daily Trans", val: "124", color: "text-blue-600" },
          { label: "New Clients", val: "42", color: "text-purple-600" },
          { label: "Network", val: "OPTIMAL", color: "text-emerald-600" }
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 transition-all duration-300 transform hover:-translate-y-1">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
            <p className={`text-xl font-black ${s.color} mt-1`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* LIVE SALES FEED */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-black text-gray-800 mb-6 uppercase text-xs tracking-[0.2em]">Live Sales Activity</h2>
        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
          <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3 text-sm font-bold text-gray-600 border border-slate-100 animate-pulse">
            <div className="w-2 h-2 bg-indigo-500 rounded-full" /> 🛒 New retail sale completed
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3 text-sm font-bold text-gray-600 border border-slate-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" /> 📦 Product stock updated in inventory
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3 text-sm font-bold text-gray-600 border border-slate-100">
            <div className="w-2 h-2 bg-purple-500 rounded-full" /> 👥 Customer record modified successfully
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3 text-sm font-bold text-gray-600 border border-slate-100">
            <div className="w-2 h-2 bg-amber-500 rounded-full" /> 💸 Bank transfer processed to recipient
          </div>
        </div>
      </div>

      {/* FOOTER SECTION: LIVE TRANSACTIONS + HISTORY */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100">
          <h2 className="font-black text-gray-800 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
            <Activity size={18} className="text-red-500"/> Real-time Transactions
          </h2>
          <div className="space-y-4 text-sm">
            {liveFeed.length === 0 ? (
              <p className="text-gray-300 font-bold italic py-4">Waiting for terminal activity...</p>
            ) : (
              liveFeed.map((tx, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border-l-4 border-emerald-500 font-bold">
                  <span className="text-gray-700">🛒 {tx.type || "Sale"}</span>
                  <span className="text-emerald-600 font-black">{format(tx.amount || 0)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="font-black text-gray-800 mb-3 flex items-center gap-2 uppercase text-xs tracking-widest">
              <History size={18} className="text-indigo-600"/> Audit History
            </h2>
            <p className="text-gray-400 text-xs font-bold leading-relaxed">
              Access the complete ledger of withdrawals, transfers, and system adjustments.
            </p>
          </div>
          <Link 
            to="/history" 
            className="mt-8 bg-gray-900 text-white text-center py-5 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-gray-200"
          >
            OPEN TRANSACTION LOGS
          </Link>
        </div>
      </div>
    </div>
  );
}
