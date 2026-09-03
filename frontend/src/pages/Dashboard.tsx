import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Rocket, Wallet, Eye, EyeOff, Users, 
  Package, Landmark, History, Smartphone, Signal, 
  BarChart3, CreditCard, TrendingUp, ShieldCheck
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAuthStore } from "../store/authStore";
import { formatCurrency } from "../utils/format";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [showBalance, setShowBalance] = useState(true);

  const chartData = [
    { name: "Mon", sales: 4200 }, { name: "Tue", sales: 5100 }, { name: "Wed", sales: 3800 },
    { name: "Thu", sales: 6400 }, { name: "Fri", sales: 7200 }, { name: "Sat", sales: 8100 }, { name: "Sun", sales: 5900 }
  ];

  const quickActions = [
    { title: "New Sale", icon: <CreditCard />, path: "/sales", color: "bg-indigo-600", desc: "Start transaction" },
    { title: "Transfer", icon: <Landmark />, path: "/pos/transfer", color: "bg-violet-600", desc: "Bank transfer" },
    { title: "Inventory", icon: <Package />, path: "/products", color: "bg-blue-600", desc: "Stock management" },
    { title: "Customers", icon: <Users />, path: "/customers", color: "bg-teal-600", desc: "CRM logs" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Welcome, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-slate-500 font-medium text-sm">Terminal ID: #SHG-882-POS</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
          <ShieldCheck className="text-indigo-600" size={20} />
          <span className="text-indigo-700 font-bold text-xs">System Secure</span>
        </div>
      </div>

      {/* Main Balance Card (Glassmorphism Indigo) */}
      <div className="relative overflow-hidden bg-indigo-700 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 opacity-80">
              <Wallet size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Available Balance</span>
            </div>
            <button onClick={() => setShowBalance(!showBalance)} className="p-2 hover:bg-white/10 rounded-xl transition">
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            {showBalance ? formatCurrency(user?.balance || 0) : "₦ ••••••••"}
          </h2>
          <div className="mt-8 flex items-center gap-6">
            <div>
              <p className="text-[10px] uppercase font-bold opacity-60">Daily Inflow</p>
              <p className="font-bold">+ ₦240,500.00</p>
            </div>
            <div className="w-[1px] h-8 bg-white/20"></div>
            <div>
              <p className="text-[10px] uppercase font-bold opacity-60">Daily Outflow</p>
              <p className="font-bold">- ₦12,000.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.title} to={action.path} className="group bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all">
            <div className={`${action.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <h3 className="font-bold text-slate-800">{action.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{action.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 text-lg">Sales Analytics</h3>
            <select className="bg-slate-50 border-none rounded-xl text-xs font-bold px-4 py-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px'}} 
                />
                <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={4} dot={{r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Logs / Recent */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-900 text-lg mb-6">Live Terminal Feed</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <TrendingUp size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">Sale #82109</p>
                  <p className="text-[10px] text-slate-400 font-medium">2 mins ago • Card Payment</p>
                </div>
                <p className="text-sm font-black text-emerald-600">+₦12.5k</p>
              </div>
            ))}
          </div>
          <Link to="/history" className="block w-full text-center mt-6 py-3 text-indigo-600 font-bold text-sm hover:bg-indigo-50 rounded-2xl transition">
            View All Logs
          </Link>
        </div>
      </div>
    </div>
  );
}
