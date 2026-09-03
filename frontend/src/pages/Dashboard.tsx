import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Rocket, Wallet, ArrowUpRight, ArrowDownLeft, Users, 
  History as HistoryIcon, BarChart3, CreditCard 
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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

  // Restored Emojis and Previous Descriptions
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
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
            <Rocket size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shigosag POS</h1>
            <p className="text-gray-500 font-medium italic">Terminal System</p>
          </div>
        </div>

        {/* Fixed Toggle */}
        <button 
          onClick={() => setColoredMode(!coloredMode)}
          className={`flex items-center gap-3 px-4 py-2 rounded-2xl font-bold text-[10px] transition-all border ${
            coloredMode ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-white text-gray-400 border-gray-100"
          }`}
        >
          {coloredMode ? "COLORED" : "LIGHT"}
          <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${coloredMode ? "bg-indigo-600" : "bg-gray-200"}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${coloredMode ? "translate-x-7" : "translate-x-1"}`} />
          </div>
        </button>
      </div>

      {/* Institutional Green Balance Card */}
      <div className="bg-emerald-50 p-8 rounded-xl border border-emerald-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Available Balance</p>
          <h2 className="text-5xl font-black text-emerald-900">{format(stats.balance)}</h2>
        </div>
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-200">
          <Wallet size={32} />
        </div>
      </div>

      {/* Quick Actions Grid (Previous Card Style & Space) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
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
            <div className="text-3xl">{card.icon}</div>
            <div className="font-bold mt-2 text-base">{card.title}</div>
            <p className={`text-xs mt-1 opacity-80 ${coloredMode ? "text-white" : "text-gray-500"}`}>
              {card.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* Bottom Section: Chart + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-indigo-600"/> Sales Analytics
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={4} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-indigo-900 p-8 rounded-xl text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-40"></div>
           <div className="relative z-10">
              <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Today's Inflow</p>
              <h4 className="text-3xl font-black">{format(stats.inflow)}</h4>
           </div>
           <div className="relative z-10 pt-6 border-t border-indigo-800">
              <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">System Status</p>
              <h4 className="text-lg font-black flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/> 
                Operational
              </h4>
           </div>
        </div>
      </div>
    </div>
  );
}
