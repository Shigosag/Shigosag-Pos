import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { 
  Rocket, Wallet, Users, Package, Landmark, 
  History, Smartphone, Signal, BarChart3, 
  Activity, ShoppingCart, ArrowRight 
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, 
  CartesianGrid, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { useAuthStore } from "../store/authStore";
import { getSocketUrl } from "../api/api";
import { formatCurrency } from "../utils/format";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  
  // Initialize state from localStorage if available, otherwise default to true
  const [coloredMode, setColoredMode] = useState(() => {
    const saved = localStorage.getItem("terminal_theme");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Persist theme preference
  useEffect(() => {
    localStorage.setItem("terminal_theme", JSON.stringify(coloredMode));
  }, [coloredMode]);

  const chartData = [
    { name: "Mon", sales: 1200 }, { name: "Tue", sales: 2100 }, 
    { name: "Wed", sales: 1800 }, { name: "Thu", sales: 2400 }, 
    { name: "Fri", sales: 3200 }, { name: "Sat", sales: 2800 },
    { name: "Sun", sales: 3500 }
  ];

  useEffect(() => {
    const socket = io(getSocketUrl());
    
    // Listen for both general transactions and retail sales
    socket.on("transaction:new", (tx) => {
      setLiveFeed((prev) => [tx, ...prev.slice(0, 4)]);
    });

    socket.on("sale:new", (data) => {
      // Logic to handle new sale notification if needed
      console.log("New Sale in Terminal:", data);
    });

    return () => { socket.disconnect(); };
  }, []);

  // ALL 10 CARDS PRESERVED with specific routes and design
  const cards = [
    { title: "POS Sales", icon: "🛒", path: "/sales", color: "from-rose-500 to-red-600", desc: "Process customer sales" },
    { title: "Products", icon: "📦", path: "/products", color: "from-blue-500 to-blue-600", desc: "Manage inventory" },
    { title: "Customers", icon: "👥", path: "/customers", color: "from-purple-500 to-purple-600", desc: "Customer management" },
    { title: "Transfers", icon: "💸", path: "/pos/transfer", color: "from-emerald-500 to-green-600", desc: "Send money" },
    { title: "Withdraw", icon: "🏧", path: "/withdraw", color: "from-amber-500 to-orange-500", desc: "Cash withdrawal" },
    { title: "History", icon: "📜", path: "/history", color: "from-slate-700 to-slate-900", desc: "Transaction history" },
    { title: "Airtime", icon: "📱", path: "/airtime", color: "from-pink-500 to-pink-600", desc: "Recharge airtime" },
    { title: "Data", icon: "📶", path: "/data", color: "from-indigo-500 to-indigo-600", desc: "Buy data plans" },
    { title: "Balance", icon: "💰", path: "/balance", color: "from-teal-500 to-teal-600", desc: "Check account balance" },
    { title: "Analytics", icon: "📊", path: "/analytics", color: "from-slate-600 to-slate-800", desc: "Reports & insights" }
  ];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-xl shadow-indigo-100">
            <Rocket size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Shigosag POS</h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Real-time Terminal v3.0</p>
          </div>
        </div>

        <button 
          onClick={() => setColoredMode(!coloredMode)}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-xs transition-all border ${
            coloredMode ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-white text-gray-400 border-gray-100"
          }`}
        >
          {coloredMode ? "COLORED MODE ACTIVE" : "STANDARD MODE"}
          <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${coloredMode ? "bg-indigo-600" : "bg-gray-200"}`}>
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm ${coloredMode ? "translate-x-6" : "translate-x-1"}`} />
          </div>
        </button>
      </div>

      {/* SYSTEM STATUS BANNER */}
      <div className="bg-indigo-600 text-white p-5 rounded-[1.8rem] flex justify-between items-center shadow-2xl shadow-indigo-100">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-none">Global Network Status</h3>
            <p className="text-[11px] opacity-80 mt-1 font-medium">All financial gateways operational</p>
          </div>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full border border-white/10">
           <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" /> Online
        </div>
      </div>

      {/* MAIN BALANCE CARD */}
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-md flex flex-col md:flex-row justify-between items-center group hover:border-indigo-200 transition-all gap-6">
        <div className="text-center md:text-left">
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.3em] mb-2">Available Terminal Balance</p>
          <p className="text-6xl font-black text-emerald-600 tracking-tighter">
            {formatCurrency(user?.balance || 0)}
          </p>
        </div>
        <div className="p-6 bg-emerald-50 text-emerald-600 rounded-[2.5rem] shadow-inner">
           <Wallet size={48} />
        </div>
      </div>

      {/* 10 QUICK ACTIONS GRID */}
      <div className="flex justify-between items-center px-2">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Quick Operations</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link 
            key={card.title} 
            to={card.path} 
            className={`p-6 rounded-[2.5rem] shadow-sm transform transition-all duration-300 hover:-translate-y-2 group ${
              coloredMode 
                ? `bg-gradient-to-br ${card.color} text-white shadow-lg shadow-indigo-50` 
                : "bg-white text-gray-800 border border-gray-100 hover:border-indigo-600"
            }`}
          >
            <div className={`text-4xl mb-4 transition-transform group-hover:scale-110 duration-300`}>{card.icon}</div>
            <div className="font-black text-xs uppercase tracking-tight">{card.title}</div>
            <p className={`text-[10px] mt-1 font-bold leading-tight opacity-60`}>{card.desc}</p>
          </Link>
        ))}
      </div>

      {/* ANALYTICS & REVENUE SECTION */}
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <h2 className="font-black text-gray-800 flex items-center gap-2 uppercase text-xs tracking-[0.2em]">
            <BarChart3 size={18} className="text-indigo-600" /> Revenue Distribution
          </h2>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">Last 7 Days</div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4338ca" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4338ca" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '900'}} 
                dy={15} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '900'}} 
              />
              <Tooltip 
                contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px'}} 
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#4338ca" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LOWER DASHBOARD: LIVE FEED & HISTORY ACTION */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Real-time Ledger Stream */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
          <h2 className="font-black text-gray-800 mb-6 flex items-center gap-3 uppercase text-xs tracking-widest">
            <Activity size={18} className="text-rose-500 animate-pulse"/> Terminal Activity
          </h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {liveFeed.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-300 font-black italic text-xs uppercase tracking-widest">Awaiting Transactions...</p>
              </div>
            ) : (
              liveFeed.map((tx, i) => (
                <div key={i} className="flex justify-between items-center p-5 bg-slate-50 rounded-[1.5rem] border-l-4 border-emerald-500 font-bold animate-in slide-in-from-left-4">
                  <div>
                    <span className="text-slate-900 text-sm block">{tx.type || "SALE"}</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{tx.reference}</span>
                  </div>
                  <span className="text-emerald-600 font-black">{formatCurrency(tx.amount || 0)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Call to Action: Audit Vault */}
        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="font-black text-indigo-400 mb-4 flex items-center gap-2 uppercase text-[10px] tracking-[0.3em]">
              <History size={16} /> Audit Integrity
            </h2>
            <h3 className="text-2xl font-black text-white mb-4">Complete Financial Ledger</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
              Access every retail sale, bank transfer, and withdrawal logged in this terminal's lifetime. All records are immutable.
            </p>
          </div>
          <Link 
            to="/history" 
            className="relative z-10 bg-white text-slate-900 text-center py-6 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-3"
          >
            Open Audit Vault <ArrowRight size={18} />
          </Link>
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-all" />
        </div>
      </div>
    </div>
  );
}
