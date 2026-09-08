import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { 
  Rocket, Wallet, History, Smartphone, Signal, 
  BarChart3, Activity, Eye, EyeOff, CheckCircle2,
  AlertCircle, TrendingUp, Users, ShoppingBag
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  CartesianGrid, ResponsiveContainer 
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { getSocketUrl } from "../api/api";
import { formatCurrency } from "../utils/format";

export default function Dashboard() {
  const { user, login, token } = useAuthStore();
  const { coloredMode, toggleColoredMode } = useThemeStore();
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [networkStatus, setNetworkStatus] = useState<'optimal' | 'degraded'>('optimal');

  // Mock Performance Data (In production, this would be fetched from /api/analytics)
  const chartData = [
    { name: "Mon", sales: 1200 }, 
    { name: "Tue", sales: 2100 }, 
    { name: "Wed", sales: 1800 },
    { name: "Thu", sales: 2400 }, 
    { name: "Fri", sales: 3200 },
    { name: "Sat", sales: 2800 },
    { name: "Sun", sales: 3500 }
  ];

  useEffect(() => {
    const socket = io(getSocketUrl(), {
      auth: { token },
      reconnectionAttempts: 5
    });
    
    if (user?.id) {
      socket.emit("join", `user:${user.id}`);
    }

    socket.on("connect_error", () => setNetworkStatus('degraded'));
    socket.on("connect", () => setNetworkStatus('optimal'));

    socket.on("transaction:new", (tx) => {
      setLiveFeed((prev) => [tx, ...prev.slice(0, 5)]);
    });

    socket.on("balance:update", (newBalance) => {
      if (user) {
        login({ ...user, balance: newBalance }, token || "");
      }
    });

    return () => { socket.disconnect(); };
  }, [user?.id, login, token]);

  const cards = useMemo(() => [
    { title: "POS Sales", icon: "🛒", path: "/sales", color: "from-rose-500 to-rose-600", desc: "Terminal checkout" },
    { title: "Products", icon: "📦", path: "/products", color: "from-blue-500 to-blue-600", desc: "Stock management" },
    { title: "Customers", icon: "👥", path: "/customers", color: "from-violet-500 to-violet-600", desc: "CRM & Profiles" },
    { title: "Transfers", icon: "💸", path: "/pos/transfer", color: "from-emerald-500 to-emerald-600", desc: "Bank settlement" },
    { title: "Withdraw", icon: "🏧", path: "/withdraw", color: "from-amber-500 to-orange-500", desc: "Cash-out logic" },
    { title: "History", icon: "📜", path: "/history", color: "from-slate-700 to-slate-900", desc: "Financial logs" },
    { title: "Airtime", icon: "📱", path: "/airtime", color: "from-pink-500 to-pink-600", desc: "VTU services" },
    { title: "Data", icon: "📶", path: "/data", color: "from-indigo-500 to-indigo-600", desc: "Data bundles" },
    { title: "Balance", icon: "💰", path: "/balance", color: "from-teal-500 to-teal-600", desc: "Wallet audit" },
    { title: "Analytics", icon: "📊", path: "/analytics", color: "from-cyan-600 to-cyan-800", desc: "Sales insights" }
  ], []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12 max-w-7xl mx-auto"
    >
      {/* 1. TOP NAVIGATION & BRANDING */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 rotate-3">
            <Rocket size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
              {getGreeting()}, {user?.name?.split(' ')[0]}
            </p>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Shigosag Terminal</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={toggleColoredMode}
            className={`flex-1 md:flex-none flex items-center justify-between gap-4 px-5 py-2.5 rounded-2xl font-bold text-[11px] transition-all border ${
              coloredMode ? "bg-indigo-50 text-indigo-700 border-indigo-100" : "bg-slate-50 text-slate-500 border-slate-200"
            }`}
          >
            {coloredMode ? "VIVID INTERFACE" : "MINIMALIST"}
            <div className={`w-10 h-5 rounded-full relative transition-colors duration-500 ${coloredMode ? "bg-indigo-600" : "bg-slate-300"}`}>
              <motion.div 
                animate={{ x: coloredMode ? 22 : 4 }}
                className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
              />
            </div>
          </button>
        </div>
      </header>

      {/* 2. SYSTEM STATUS & CONNECTIVITY */}
      <div className={`p-4 rounded-[1.5rem] flex justify-between items-center transition-all duration-500 ${
        networkStatus === 'optimal' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
      }`}>
        <div className="flex items-center gap-3">
          {networkStatus === 'optimal' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
          <span className="text-xs font-bold uppercase tracking-widest">
            {networkStatus === 'optimal' ? 'Terminal Connected: Global Link Optimal' : 'Network Jitter Detected: Retrying...'}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase">
          <div className={`w-1.5 h-1.5 rounded-full ${networkStatus === 'optimal' ? 'bg-emerald-300 animate-pulse' : 'bg-white'}`} />
          Latency: 14ms
        </div>
      </div>

      {/* 3. CORE FINANCIAL CARD */}
      <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-indigo-200 transition-all duration-300">
        <div className="text-center md:text-left w-full">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">Institutional Liquidity</p>
            <button 
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="text-slate-300 hover:text-indigo-600 transition-colors"
            >
              {isBalanceVisible ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <motion.p 
            key={isBalanceVisible ? 'visible' : 'hidden'}
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter"
          >
            {isBalanceVisible ? formatCurrency(user?.balance || 0) : "••••••••••••"}
          </motion.p>
        </div>
        <div className="p-8 bg-indigo-50 text-indigo-600 rounded-[2.5rem] shadow-inner border border-indigo-100/50 transform group-hover:scale-105 transition-transform duration-500">
           <Wallet size={48} strokeWidth={2.5} />
        </div>
      </section>

      {/* 4. QUICK ACTIONS ENGINE */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {cards.map((card, idx) => (
          <Link 
            key={card.title} 
            to={card.path} 
            className={`group relative overflow-hidden p-6 rounded-[2rem] transition-all duration-500 hover:-translate-y-2 ${
              coloredMode 
                ? `bg-gradient-to-br ${card.color} text-white shadow-lg shadow-indigo-100/20` 
                : "bg-white text-slate-800 border border-slate-100 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-500">{card.icon}</div>
            <div className="font-black text-sm uppercase tracking-tight mb-1">{card.title}</div>
            <p className="text-[10px] font-bold opacity-70 leading-tight">{card.desc}</p>
            
            {/* Gloss Effect for Colored Mode */}
            {coloredMode && (
              <div className="absolute top-0 -right-4 w-12 h-full bg-white/10 skew-x-[25deg] group-hover:translate-x-[-150px] transition-transform duration-1000" />
            )}
          </Link>
        ))}
      </div>

      {/* 5. ANALYTICS & SALES TRENDS */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <header className="flex justify-between items-center mb-10">
          <h2 className="font-black text-slate-900 flex items-center gap-3 uppercase text-xs tracking-widest">
            <BarChart3 size={18} className="text-indigo-600" /> Performance Velocity
          </h2>
          <div className="flex gap-2">
             <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black">+12.4% Today</span>
          </div>
        </header>

        <div className="h-[350px] w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4338ca" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4338ca" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} 
                dy={10} 
              />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px'}}
                itemStyle={{fontWeight: '900', color: '#4338ca'}}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#4338ca" 
                strokeWidth={5} 
                fillOpacity={1} 
                fill="url(#colorSales)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. STATS GRID & ACTIVITY LOGS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Gross Volume", val: "₦1.2M", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Daily Orders", val: "124", icon: ShoppingBag, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Retention", val: "88%", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Uptime", val: "99.9%", icon: Signal, color: "text-sky-600", bg: "bg-sky-50" }
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm group hover:shadow-md transition-all">
            <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4`}>
               <s.icon size={20} />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
            <p className={`text-2xl font-black text-slate-900 mt-1`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* 7. LIVE FEED & AUDIT FOOTER */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
          <h2 className="text-xs font-black text-slate-900 mb-8 uppercase tracking-[0.3em] flex items-center gap-2">
            <Activity size={16} className="text-indigo-600" /> Global Terminal Activity
          </h2>
          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence initial={false}>
              {liveFeed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                  <Activity size={32} className="animate-pulse mb-2" />
                  <p className="text-[10px] font-black uppercase">Listening for live packets...</p>
                </div>
              ) : (
                liveFeed.map((tx, i) => (
                  <motion.div 
                    key={tx.id || i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${tx.type === 'SALE' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {tx.type === 'SALE' ? <ShoppingBag size={16}/> : <Wallet size={16}/>}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm">{tx.type || "SYSTEM_EVENT"}</p>
                        <p className="text-[10px] font-bold text-slate-400">{new Date(tx.createdAt || Date.now()).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <span className={`font-black text-sm ${tx.type === 'SALE' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.type === 'SALE' ? '+' : '-'}{formatCurrency(tx.amount || 0)}
                    </span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c0-16.57 13.43-30 30-30v60c-16.57 0-30-13.43-30-30z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <History size={24} className="text-indigo-400" />
            </div>
            <h2 className="font-black text-2xl mb-4 tracking-tight">Audit Trail</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
              Review every withdrawal, credit adjustment, and terminal session within the centralized institutional ledger.
            </p>
          </div>

          <Link 
            to="/history" 
            className="relative z-10 w-full bg-white text-slate-900 text-center py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
          >
            Access Full Ledger
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
