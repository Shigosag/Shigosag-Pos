import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { 
  Rocket, Wallet, Zap, ShieldCheck, 
  History, BarChart3, Activity, CreditCard 
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, 
  CartesianGrid, ResponsiveContainer 
} from "recharts";
import { useAuthStore } from "../store/authStore";
import { getSocketUrl } from "../api/api";
import { formatCurrency } from "../utils/format";

export default function Dashboard() {
  const { user, login, token } = useAuthStore();
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  
  // Persisted Colored Mode state
  const [coloredMode, setColoredMode] = useState(() => {
    const saved = localStorage.getItem("terminal_theme");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("terminal_theme", JSON.stringify(coloredMode));
  }, [coloredMode]);

  // Original Weekly Analytics Data
  const chartData = useMemo(() => [
    { name: "Mon", sales: 1200 }, { name: "Tue", sales: 2100 }, { name: "Wed", sales: 1800 },
    { name: "Thu", sales: 2400 }, { name: "Fri", sales: 3200 }, { name: "Sat", sales: 2800 }, { name: "Sun", sales: 3500 }
  ], []);

  // ALL 10 Original Quick Action Cards Preserved
  const cards = useMemo(() => [
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
  ], []);

  useEffect(() => {
    if (!user?.id) return;
    const socket = io(getSocketUrl());
    
    // Security: Join user-specific room
    socket.emit("join", `user:${user.id}`);
    
    socket.on("transaction:new", (tx) => {
      setLiveFeed((prev) => [tx, ...prev.slice(0, 4)]);
    });

    socket.on("balance:update", (newBalance) => {
      login({ ...user, balance: newBalance }, token || "");
    });

    return () => { socket.disconnect(); };
  }, [user?.id]);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto animate-in fade-in duration-700">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100">
            <Rocket size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Shigosag POS</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Institutional Terminal v3.0</p>
          </div>
        </div>

        <button 
          onClick={() => setColoredMode(!coloredMode)}
          className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl font-black text-[10px] transition-all border ${
            coloredMode ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-white text-slate-400 border-slate-200"
          }`}
        >
          {coloredMode ? "COLORED THEME" : "NEUTRAL THEME"}
          <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${coloredMode ? "bg-indigo-600" : "bg-slate-200"}`}>
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm ${coloredMode ? "translate-x-6" : "translate-x-1"}`} />
          </div>
        </button>
      </div>

      {/* 2. System Status Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-[2rem] flex justify-between items-center shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
            <Zap size={16} className="text-yellow-400" /> System Integrity
          </h3>
          <p className="text-[11px] opacity-60 font-bold mt-1">All global financial nodes are operational</p>
        </div>
        <div className="text-[10px] font-black flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 relative z-10">
           <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" /> 
           LIVE CONNECTION
        </div>
      </div>

      {/* 3. Balance Card - Atomic Visualization */}
      <div className={`p-10 rounded-[2.5rem] shadow-xl flex justify-between items-center transition-all duration-500 border-b-8 border-r-8 ${
        coloredMode ? "bg-indigo-600 text-white border-indigo-800" : "bg-white text-slate-900 border-slate-200"
      }`}>
        <div className="space-y-4">
          <p className={`text-[11px] font-black uppercase tracking-[0.4em] ${coloredMode ? 'text-indigo-200' : 'text-slate-400'}`}>
            Total Liquidity
          </p>
          <h2 className="text-6xl font-black tracking-tighter">
            {formatCurrency(Number(user?.balance || 0))}
          </h2>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black w-fit border ${
            coloredMode ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-50 border-slate-100 text-slate-500'
          }`}>
             <ShieldCheck size={14} /> SECURE VAULT PROTECTED
          </div>
        </div>
        <div className={`p-8 rounded-[2.5rem] shadow-inner ${coloredMode ? 'bg-white/10' : 'bg-slate-50'}`}>
           <Wallet size={48} className={coloredMode ? 'text-white' : 'text-indigo-600'} />
        </div>
      </div>

      {/* 4. Quick Actions Grid - All 10 Items */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link 
            key={card.title} 
            to={card.path} 
            className={`p-6 rounded-[2rem] shadow-sm hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 group ${
              coloredMode 
                ? `bg-gradient-to-br ${card.color} text-white` 
                : "bg-white text-slate-800 border border-slate-100 hover:border-indigo-600"
            }`}
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{card.icon}</div>
            <div className="font-black text-xs uppercase tracking-tight">{card.title}</div>
            <p className={`text-[10px] mt-1 font-bold leading-tight opacity-60`}>{card.desc}</p>
          </Link>
        ))}
      </div>

      {/* 5. Performance Analytics Chart */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
            <BarChart3 size={18} className="text-indigo-600" /> Retail Performance
          </h2>
          <select className="bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase px-4 py-2 outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} dy={15} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px'}} 
                itemStyle={{fontWeight: 900, color: '#4338ca'}}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#4338ca" 
                strokeWidth={6} 
                dot={{ r: 8, fill: '#4338ca', strokeWidth: 4, stroke: '#fff' }} 
                activeDot={{ r: 10, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. Footer: Live Feed & Audit Summary */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h2 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
            <Activity size={18} className="text-rose-500"/> Real-time Terminal Feed
          </h2>
          <div className="space-y-4">
            {liveFeed.length === 0 ? (
              // Original Placeholder Logic
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3 text-[11px] font-black text-slate-400 border border-slate-100 italic">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" /> Waiting for terminal activity...
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between text-[11px] font-black text-slate-600 border border-slate-100">
                  <span>🛒 New retail sale processed</span>
                  <span className="text-slate-400">刚刚</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between text-[11px] font-black text-slate-600 border border-slate-100">
                  <span>💸 Bank transfer settlement completed</span>
                  <span className="text-slate-400">2 mins ago</span>
                </div>
              </div>
            ) : (
              liveFeed.map((tx, i) => (
                <div key={i} className="flex justify-between items-center p-5 bg-indigo-50/30 rounded-3xl border-l-4 border-indigo-600 font-black animate-in slide-in-from-right-4">
                  <span className="text-slate-700 text-sm">🛒 {tx.type}</span>
                  <span className="text-indigo-600">{formatCurrency(tx.amount || 0)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-sm text-white flex flex-col justify-between group overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10">
            <h2 className="font-black text-indigo-400 mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
              <History size={18} /> Financial Audit Trail
            </h2>
            <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-sm">
              Access the complete institutional ledger. Export CSV or PDF statements for regulatory compliance and internal reconciliation.
            </p>
          </div>
          <Link 
            to="/history" 
            className="mt-12 bg-white text-slate-900 text-center py-6 rounded-[1.5rem] font-black text-sm hover:bg-indigo-50 transition-all shadow-2xl relative z-10"
          >
            OPEN TRANSACTION LEDGER
          </Link>
        </div>
      </div>
    </div>
  );
}
