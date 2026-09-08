import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { 
  Rocket, Wallet, ArrowUpRight, ArrowDownLeft, Users, 
  Package, Landmark, History, Smartphone, Signal, 
  BarChart3, CreditCard, Activity, Bell, RefreshCw,
  ChevronRight, TrendingUp, CheckCircle2
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  CartesianGrid, ResponsiveContainer 
} from "recharts";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { getSocketUrl } from "../api/api";
import { formatCurrency } from "../utils/format";

export default function Dashboard() {
  const { user, login, token } = useAuthStore();
  const { coloredMode, toggleColoredMode } = useThemeStore();
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Time-based greeting logic
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const chartData = [
    { name: "Mon", sales: 1200 }, 
    { name: "Tue", sales: 2100 }, 
    { name: "Wed", sales: 1800 },
    { name: "Thu", sales: 2400 }, 
    { name: "Fri", sales: 3200 },
    { name: "Sat", sales: 2800 },
    { name: "Sun", sales: 3500 }
  ];

  const handleSocketUpdate = useCallback((tx: any) => {
    setLiveFeed((prev) => [tx, ...prev.slice(0, 5)]);
  }, []);

  useEffect(() => {
    const socket = io(getSocketUrl());
    
    if (user?.id) {
      socket.emit("join", `user:${user.id}`);
    }

    socket.on("transaction:new", handleSocketUpdate);

    socket.on("balance:update", (newBalance) => {
      if (user) {
        login({ ...user, balance: newBalance }, token || "");
      }
    });

    return () => { socket.disconnect(); };
  }, [user, login, token, handleSocketUpdate]);

  const actions = useMemo(() => [
    { title: "POS Sales", icon: <ShoppingCart size={24}/>, path: "/sales", color: "from-rose-500 to-red-600", desc: "Process checkout" },
    { title: "Transfers", icon: <Landmark size={24}/>, path: "/pos/transfer", color: "from-emerald-500 to-teal-600", desc: "Send funds" },
    { title: "Withdraw", icon: <CreditCard size={24}/>, path: "/withdraw", color: "from-amber-500 to-orange-500", desc: "Bank settlement" },
    { title: "Inventory", icon: <Package size={24}/>, path: "/products", color: "from-blue-500 to-indigo-600", desc: "Manage stock" },
    { title: "History", icon: <History size={24}/>, path: "/history", color: "from-slate-700 to-slate-900", desc: "Audit logs" }
  ], []);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- TOP HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
            <Rocket size={30} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{greeting}</p>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Terminal {user?.name?.split(' ')[0]}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => { setIsSyncing(true); setTimeout(() => setIsSyncing(false), 1000); }}
            className={`p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all ${isSyncing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={toggleColoredMode}
            className={`flex-1 md:flex-none flex items-center justify-between gap-4 px-5 py-3 rounded-2xl font-bold text-[11px] transition-all border ${
              coloredMode ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" : "bg-white text-gray-500 border-gray-200"
            }`}
          >
            {coloredMode ? "VIVID UI ACTIVE" : "CLASSIC MODE"}
            <div className={`w-8 h-4 rounded-full relative transition-colors ${coloredMode ? "bg-white/20" : "bg-gray-200"}`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${coloredMode ? "translate-x-4.5" : "translate-x-0.5"}`} />
            </div>
          </button>
        </div>
      </div>

      {/* --- MASTER BALANCE CARD --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-indigo-600/30 transition-all duration-700" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
               <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/10">
                 <Wallet size={18} className="text-indigo-400" />
               </div>
               <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Institution Vault Balance</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
                  {formatCurrency(user?.balance || 0)}
                </h2>
                <div className="flex items-center gap-2 mt-4 text-emerald-400 font-bold text-sm bg-emerald-400/10 w-fit px-3 py-1 rounded-full border border-emerald-400/20">
                  <TrendingUp size={16} /> +12.5% volume growth
                </div>
              </div>
              <div className="flex gap-3">
                <Link to="/pos/transfer" className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black transition-all shadow-lg shadow-indigo-900/50 active:scale-95">Send Money</Link>
                <Link to="/history" className="px-6 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black backdrop-blur-md transition-all border border-white/10">Logs</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-indigo-100 transition-colors">
          <div className="flex justify-between items-start">
             <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">System Health</p>
                <h3 className="text-xl font-black text-slate-800">100% Operational</h3>
             </div>
             <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={24} />
             </div>
          </div>
          <div className="mt-8 space-y-3">
             <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Database Latency</span>
                <span className="text-slate-700">14ms</span>
             </div>
             <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[95%] h-full bg-emerald-500" />
             </div>
             <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Encryption Layer</span>
                <span className="text-indigo-600">AES-256 Enabled</span>
             </div>
          </div>
        </div>
      </div>

      {/* --- QUICK ACTIONS GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {actions.map((action) => (
          <Link 
            key={action.title} 
            to={action.path} 
            className={`p-6 rounded-[2rem] group relative overflow-hidden transition-all duration-300 transform hover:-translate-y-2 shadow-sm hover:shadow-xl ${
              coloredMode 
                ? `bg-gradient-to-br ${action.color} text-white` 
                : "bg-white text-slate-800 border border-slate-100"
            }`}
          >
            <div className={`mb-4 w-12 h-12 flex items-center justify-center rounded-2xl ${coloredMode ? 'bg-white/20 backdrop-blur-md' : 'bg-slate-50 text-indigo-600'}`}>
              {action.icon}
            </div>
            <div className="font-black text-sm uppercase tracking-tight">{action.title}</div>
            <p className="text-[10px] mt-1 font-bold opacity-70 flex items-center gap-1">
              {action.desc} <ChevronRight size={10} />
            </p>
          </Link>
        ))}
      </div>

      {/* --- ANALYTICS & FEED --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RECHARTS AREA */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase text-[11px] tracking-widest">
              <BarChart3 size={18} className="text-indigo-600" /> Revenue Stream
            </h2>
            <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
               <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-[10px] font-black text-indigo-600">WEEKLY</button>
               <button className="px-4 py-1.5 rounded-lg text-[10px] font-black text-slate-400">MONTHLY</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4338ca" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4338ca" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px'}} 
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

        {/* LIVE FEED */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
          <h2 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase text-[11px] tracking-widest">
            <Activity size={18} className="text-rose-500"/> Activity Feed
          </h2>
          <div className="flex-1 space-y-4">
            {liveFeed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                 <Signal className="animate-pulse mb-2" size={30} />
                 <p className="text-[10px] font-black uppercase">Scanning for transactions...</p>
              </div>
            ) : (
              liveFeed.map((tx, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-right-4">
                  <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-xl ${tx.type === 'SALE' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        {tx.type === 'SALE' ? <ShoppingCart size={14}/> : <Landmark size={14}/>}
                     </div>
                     <div>
                        <p className="text-xs font-black text-slate-800">{tx.type}</p>
                        <p className="text-[10px] font-bold text-slate-400">#{tx.reference?.slice(-6)}</p>
                     </div>
                  </div>
                  <span className={`text-sm font-black ${tx.type === 'SALE' ? 'text-emerald-600' : 'text-slate-900'}`}>
                     {tx.type === 'SALE' ? '+' : '-'}{formatCurrency(tx.amount || 0)}
                  </span>
                </div>
              ))
            )}
          </div>
          <Link to="/history" className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-indigo-600 hover:gap-3 transition-all">
             View Complete Ledger <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Sub-component for icons
function ShoppingCart(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
  );
}
