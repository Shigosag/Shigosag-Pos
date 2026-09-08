import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { 
  Rocket, Wallet, History, Smartphone, Signal, 
  BarChart3, Activity, Eye, EyeOff, CheckCircle2,
  AlertCircle, ShoppingBag, Package, Users, Landmark, CreditCard
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, 
  CartesianGrid, ResponsiveContainer 
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { getSocketUrl } from "../api/api";

export default function Dashboard() {
  const { user, login, token } = useAuthStore();
  const { coloredMode, toggleColoredMode } = useThemeStore();
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [networkStatus, setNetworkStatus] = useState<'optimal' | 'degraded'>('optimal');

  const chartData = [
    { name: "Mon", sales: 1200 }, 
    { name: "Tue", sales: 2100 }, 
    { name: "Wed", sales: 1800 },
    { name: "Thu", sales: 2400 }, 
    { name: "Fri", sales: 3200 }
  ];

  useEffect(() => {
    const socket = io(getSocketUrl(), { auth: { token } });
    
    if (user?.id) {
      socket.emit("join", `user:${user.id}`);
    }

    socket.on("connect_error", () => setNetworkStatus('degraded'));
    socket.on("connect", () => setNetworkStatus('optimal'));

    socket.on("transaction:new", (tx) => {
      setLiveFeed((prev) => [tx, ...prev.slice(0, 4)]);
    });

    socket.on("balance:update", (newBalance) => {
      if (user) {
        login({ ...user, balance: newBalance }, token || "");
      }
    });

    return () => { socket.disconnect(); };
  }, [user?.id, login, token]);

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

  const format = (val: number | string) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return (num || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* 1. HEADER SECTION (PREVIOUS STYLE) */}
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

        {/* PILL-STYLE THEME TOGGLE (PREVIOUS STYLE) */}
        <button 
          onClick={toggleColoredMode}
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

      {/* 2. SYSTEM STATUS BANNER (PREVIOUS STYLE) */}
      <div className={`${networkStatus === 'optimal' ? 'bg-indigo-600' : 'bg-amber-600'} text-white p-5 rounded-[1.5rem] flex justify-between items-center shadow-xl shadow-indigo-100 transition-all duration-300 transform hover:-translate-y-1`}>
        <div>
          <h3 className="font-bold text-sm">System Status</h3>
          <p className="text-[11px] opacity-90 font-medium">
            {networkStatus === 'optimal' ? 'Global networks stable' : 'Network latency detected...'}
          </p>
        </div>
        <div className="text-sm font-bold flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
           <div className={`w-2 h-2 ${networkStatus === 'optimal' ? 'bg-emerald-400' : 'bg-white'} rounded-full animate-ping`} /> 
           <span className="animate-pulse">{networkStatus === 'optimal' ? 'Online' : 'Degraded'}</span>
        </div>
      </div>

      {/* 3. AVAILABLE BALANCE CARD (PREVIOUS STYLE) */}
      <div className="bg-white p-10 rounded-[1.5rem] border border-gray-100 shadow-md flex justify-between items-center group hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-1">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em]">Available Balance</p>
            <button onClick={() => setIsBalanceVisible(!isBalanceVisible)} className="text-gray-300 hover:text-indigo-600 transition-colors">
               {isBalanceVisible ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <p className="text-5xl font-black text-emerald-600 tracking-tighter">
            {isBalanceVisible ? format(user?.balance || 0) : "₦ • • • • • •"}
          </p>
        </div>
        <div className="p-5 bg-emerald-50 text-emerald-600 rounded-[2rem] shadow-inner">
           <Wallet size={40} />
        </div>
      </div>

      {/* 4. QUICK ACTIONS GRID (PREVIOUS 2/5 LAYOUT) */}
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
            <p className={`text-[10px] mt-1 font-bold leading-tight opacity-70`}>{card.desc}</p>
          </Link>
        ))}
      </div>

      {/* 5. PERFORMANCE ANALYTICS */}
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

      {/* 6. STATS SUMMARY GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Gross Sales", val: "₦1.2M", color: "text-indigo-600" },
          { label: "Daily Trans", val: "124", color: "text-blue-600" },
          { label: "New Clients", val: "42", color: "text-purple-600" },
          { label: "Network", val: networkStatus.toUpperCase(), color: networkStatus === 'optimal' ? "text-emerald-600" : "text-amber-600" }
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 transition-all duration-300 transform hover:-translate-y-1">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
            <p className={`text-xl font-black ${s.color} mt-1`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* 7. LIVE TRANSACTIONS + HISTORY */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100">
          <h2 className="font-black text-gray-800 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
            <Activity size={18} className="text-red-500"/> Real-time Transactions
          </h2>
          <div className="space-y-4 text-sm">
            <AnimatePresence initial={false}>
              {liveFeed.length === 0 ? (
                <p className="text-gray-300 font-bold italic py-4">Waiting for terminal activity...</p>
              ) : (
                liveFeed.map((tx, i) => (
                  <motion.div 
                    key={tx.id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border-l-4 border-emerald-500 font-bold"
                  >
                    <span className="text-gray-700">🛒 {tx.type || "Sale"}</span>
                    <span className="text-emerald-600 font-black">{format(tx.amount || 0)}</span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
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
