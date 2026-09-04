import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Rocket, Wallet, ArrowUpRight, ArrowDownLeft, Users, 
  BarChart3, CreditCard, Activity 
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useAuthStore } from "../store/authStore";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [coloredMode, setColoredMode] = useState(true);

  const stats = {
    balance: user?.balance || 10000000,
    inflow: 4200,
    outflow: 1150
  };

  const chartData = [
    { name: "Mon", sales: 1200 }, { name: "Tue", sales: 2100 }, { name: "Wed", sales: 1800 },
    { name: "Thu", sales: 2400 }, { name: "Fri", sales: 3200 }
  ];

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

  const format = (val: number) => val.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
            <Rocket size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Shigosag POS</h1>
            <p className="text-xs text-gray-500 font-medium">Real-time fintech dashboard system</p>
          </div>
        </div>

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

      {/* System Status Banner */}
      <div className="bg-indigo-600 text-white rounded-xl shadow p-4 flex justify-between items-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
        <div>
          <h3 className="font-bold text-sm">System Status</h3>
          <p className="text-[11px] opacity-90 font-medium">All POS services operational</p>
        </div>
        <div className="text-sm font-bold flex items-center gap-2">
           <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" /> 
           <span className="animate-pulse">🟢 Online</span>
        </div>
      </div>

      {/* Available Balance */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex justify-between items-center group">
        <div>
          <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest mb-1">Available Balance</p>
          <p className="text-4xl font-black text-emerald-600">{format(stats.balance)}</p>
        </div>
        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
           <Wallet size={32} />
        </div>
      </div>

      {/* Quick Actions Title */}
      <h2 className="text-lg font-black text-gray-800 -mb-2">Quick Actions</h2>

      {/* Quick Actions Grid (Previous Spacing & Emoji Icons) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.path}
            className={`p-5 rounded-xl shadow-sm hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 ${
              coloredMode 
                ? `bg-gradient-to-r ${card.color} text-white` 
                : "bg-white text-gray-800 border border-gray-200"
            }`}
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="font-bold text-sm">{card.title}</div>
            <p className={`text-[10px] mt-0.5 font-medium leading-tight ${coloredMode ? "text-white/80" : "text-gray-400"}`}>
              {card.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
           <BarChart3 size={18} className="text-indigo-600" /> 📊 Sales Analytics
        </h2>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
              />
              <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#ef4444" 
                strokeWidth={4} 
                dot={{ r: 5, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Sales", val: "$12,540", color: "text-indigo-600" },
          { label: "Transactions", val: "124", color: "text-blue-600" },
          { label: "Customers", val: "2,381", color: "text-purple-600" },
          { label: "Status", val: <>LIVE <span className="animate-pulse">🟢</span></>, color: "text-emerald-600" }
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{s.label}</p>
            <p className={`text-xl font-black ${s.color} mt-1`}>{s.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
