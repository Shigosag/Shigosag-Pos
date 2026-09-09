import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { 
  Rocket, Wallet, History, BarChart3, Activity, Eye, EyeOff
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, 
  CartesianGrid, ResponsiveContainer 
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { getSocketUrl, api } from "../api/api";
import { formatCurrency } from "../utils/format";

export default function Dashboard() {
  const { user, login, token } = useAuthStore();
  const { coloredMode, toggleColoredMode } = useThemeStore();
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [networkStatus, setNetworkStatus] = useState<'optimal' | 'degraded'>('optimal');

  useEffect(() => {
    // 1. Initial history fetch
    api.get("/pos/transactions?limit=5")
      .then((res) => {
        const items = res.data?.data?.items || res.data?.data || [];
        setLiveFeed(Array.isArray(items) ? items : []);
      })
      .catch(() => {});

    // 2. Real-time terminal socket
    const socket = io(getSocketUrl(), { 
      transports: ["websocket", "polling"],
      auth: { token } 
    });
    
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

    return () => { 
      socket.disconnect(); 
    };
  }, [user?.id, token]);

  const cards = useMemo(() => [
    { title: "POS Sales", icon: "🛒", path: "/sales", color: "from-red-500 to-red-600", desc: "Process sales" },
    { title: "Products", icon: "📦", path: "/products", color: "from-blue-500 to-blue-600", desc: "Stock management" },
    { title: "Customers", icon: "👥", path: "/customers", color: "from-purple-500 to-purple-600", desc: "Customer records" },
    { title: "Transfers", icon: "💸", path: "/pos/transfer", color: "from-green-500 to-green-600", desc: "Send money" },
    { title: "Withdraw", icon: "🏧", path: "/withdraw", color: "from-yellow-500 to-orange-500", desc: "Cash settlement" },
    { title: "History", icon: "📜", path: "/history", color: "from-gray-700 to-gray-900", desc: "Ledger logs" },
    { title: "Airtime", icon: "📱", path: "/airtime", color: "from-pink-500 to-pink-600", desc: "Recharge airtime" },
    { title: "Data", icon: "📶", path: "/data", color: "from-indigo-500 to-indigo-600", desc: "Mobile data" },
    { title: "Balance", icon: "💰", path: "/balance", color: "from-teal-500 to-teal-600", desc: "Account balance" },
    { title: "Analytics", icon: "📊", path: "/analytics", color: "from-slate-600 to-slate-800", desc: "Sales insights" }
  ], []);

  const chartData = [
    { name: "Mon", sales: 120000 }, 
    { name: "Tue", sales: 210000 }, 
    { name: "Wed", sales: 180000 },
    { name: "Thu", sales: 240000 }, 
    { name: "Fri", sales: 320000 }
  ];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* 1. Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
            <Rocket size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Shigosag POS</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Institutional Terminal v4.0</p>
          </div>
        </div>

        <button 
          onClick={toggleColoredMode}
          className={`flex items-center gap-3 px-4 py-2 rounded-2xl font-bold text-[10px] transition-all border self-start sm:self-auto ${
            coloredMode ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-white text-gray-400 border-gray-100"
          }`}
        >
          {coloredMode ? "COLORED MODE" : "NORMAL MODE"}
          <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${coloredMode ? "bg-indigo-600" : "bg-gray-200"}`}>
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm ${coloredMode ? "translate-x-6" : "translate-x-1"}`} />
          </div>
        </button>
      </div>

      {/* 2. Real-Time Status Banner */}
      <div className={`${networkStatus === 'optimal' ? 'bg-indigo-600' : 'bg-amber-600'} text-white p-5 rounded-[1.5rem] flex justify-between items-center shadow-xl shadow-indigo-100 transition-all duration-300`}>
        <div>
          <h3 className="font-bold text-sm">System Connectivity</h3>
          <p className="text-[11px] opacity-90 font-medium">
            {networkStatus === 'optimal' ? 'Zero latency institutional gateway connected' : 'Connecting to real-time relay...'}
          </p>
        </div>
        <div className="text-xs font-bold flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
           <div className={`w-2 h-2 ${networkStatus === 'optimal' ? 'bg-emerald-400' : 'bg-amber-300'} rounded-full animate-ping`} /> 
           <span>{networkStatus === 'optimal' ? 'Online' : 'Degraded'}</span>
        </div>
      </div>

      {/* 3. Available Balance Display */}
      <div className="bg-white p-8 md:p-10 rounded-[1.5rem] border border-gray-100 shadow-md flex justify-between items-center group hover:border-indigo-200 transition-all duration-300">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em]">Institutional Vault Balance</p>
            <button onClick={() => setIsBalanceVisible(!isBalanceVisible)} className="text-gray-300 hover:text-indigo-600 transition-colors">
               {isBalanceVisible ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <p className="text-4xl md:text-5xl font-black text-emerald-600 tracking-tighter">
            {isBalanceVisible ? formatCurrency(Number(user?.balance || 0)) : "₦ • • • • • •"}
          </p>
        </div>
        <div className="p-4 md:p-5 bg-emerald-50 text-emerald-600 rounded-[2rem] shadow-inner">
           <Wallet size={36} />
        </div>
      </div>

      {/* 4. Quick Actions Grid */}
      <h2 className="text-lg font-black text-gray-800 ml-2">Terminal Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link 
            key={card.title} 
            to={card.path} 
            className={`p-6 rounded-[1.5rem] shadow-sm hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 ${
              coloredMode 
                ? `bg-gradient-to-br ${card.color} text-white shadow-lg shadow-indigo-50` 
                : "bg-white text-gray-800 border border-gray-100"
            }`}
          >
            <div className="text-4xl mb-4">{card.icon}</div>
            <div className="font-black text-sm uppercase tracking-tight">{card.title}</div>
            <p className="text-[10px] mt-1 font-bold leading-tight opacity-75">{card.desc}</p>
          </Link>
        ))}
      </div>

      {/* 5. Revenue Chart */}
      <div className="bg-white p-6 md:p-8 rounded-[1.5rem] border border-gray-100 shadow-sm">
        <h2 className="font-black text-gray-800 mb-8 flex items-center gap-2 uppercase text-xs tracking-widest">
          <BarChart3 size={18} className="text-indigo-600" /> Sales Velocity Analytics
        </h2>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
              <Tooltip 
                formatter={(val: any) => [formatCurrency(Number(val)), "Volume"]}
                contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px'}} 
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#4338ca" 
                strokeWidth={4} 
                dot={{ r: 5, fill: '#4338ca', strokeWidth: 3, stroke: '#fff' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. Live Feed & History Link */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 md:p-8 rounded-[1.5rem] shadow-sm border border-gray-100">
          <h2 className="font-black text-gray-800 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
            <Activity size={18} className="text-red-500"/> Real-time Feed
          </h2>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {liveFeed.length === 0 ? (
                <p className="text-gray-400 text-sm font-medium py-4">No recent activity detected on this terminal.</p>
              ) : (
                liveFeed.map((tx, i) => (
                  <motion.div 
                    key={tx.id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border-l-4 border-emerald-500 font-bold text-sm"
                  >
                    <div>
                      <span className="text-gray-800">{tx.type}</span>
                      <p className="text-[10px] text-gray-400 font-normal">{tx.recipientDetail || tx.reference}</p>
                    </div>
                    <span className="text-emerald-600 font-black">{formatCurrency(Number(tx.amount || 0))}</span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="font-black text-gray-800 mb-3 flex items-center gap-2 uppercase text-xs tracking-widest">
              <History size={18} className="text-indigo-600"/> Audit Ledger
            </h2>
            <p className="text-gray-400 text-xs font-bold leading-relaxed">
              Every financial debit and credit is recorded with cryptographic serializable isolation.
            </p>
          </div>
          <Link 
            to="/history" 
            className="mt-6 bg-gray-900 text-white text-center py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-gray-200"
          >
            EXPLORE AUDIT LOGS
          </Link>
        </div>
      </div>
    </div>
  );
}
