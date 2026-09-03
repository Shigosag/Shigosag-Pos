import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Rocket, Wallet, ArrowUpRight, ArrowDownLeft, Users, 
  Package, Landmark, History, Smartphone, Signal, 
  BarChart3, CreditCard 
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

  const cards = [
    { title: "POS Sales", icon: <CreditCard size={28}/>, path: "/sales", color: "from-red-500 to-red-600", desc: "Process sales" },
    { title: "Products", icon: <Package size={28}/>, path: "/products", color: "from-blue-500 to-blue-600", desc: "Inventory" },
    { title: "Customers", icon: <Users size={28}/>, path: "/customers", color: "from-purple-500 to-purple-600", desc: "User logs" },
    { title: "Transfers", icon: <Landmark size={28}/>, path: "/pos/transfer", color: "from-emerald-500 to-emerald-600", desc: "Send money" },
    { title: "Withdraw", icon: <Wallet size={28}/>, path: "/withdraw", color: "from-orange-500 to-orange-600", desc: "Cash out" },
    { title: "History", icon: <History size={28}/>, path: "/history", color: "from-slate-700 to-slate-900", desc: "Audit logs" },
    { title: "Airtime", icon: <Smartphone size={28}/>, path: "/airtime", color: "from-pink-500 to-pink-600", desc: "Top up" },
    { title: "Data", icon: <Signal size={28}/>, path: "/data", color: "from-blue-600 to-blue-700", desc: "Internet" },
    { title: "Balance", icon: <Landmark size={28}/>, path: "/balance", color: "from-teal-500 to-teal-600", desc: "Statements" },
    { title: "Analytics", icon: <BarChart3 size={28}/>, path: "/analytics", color: "from-indigo-800 to-slate-900", desc: "Insights" }
  ];

  const format = (val: number) => val.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
            <Rocket size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight tracking-tighter">Shigosag POS</h1>
            <p className="text-gray-500 font-medium">Institutional Terminal</p>
          </div>
        </div>

        {/* FIXED TOGGLE COMPONENT */}
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

      {/* Main Balance Card (Institutional Green) */}
      <div className="bg-emerald-50 p-8 rounded-[32px] border border-emerald-100 flex justify-between items-center shadow-sm">
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Available Balance</p>
          <h2 className="text-5xl font-black text-emerald-900">{format(stats.balance)}</h2>
        </div>
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-200">
          <Wallet size={32} />
        </div>
      </div>

      {/* Cards maintain variety, frame uses Indigo */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        {cards.map((card) => (
          <Link key={card.title} to={card.path}
            className={`p-6 rounded-[28px] transition-all transform hover:-translate-y-1 shadow-sm hover:shadow-xl ${
              coloredMode ? `bg-gradient-to-br ${card.color} text-white` : "bg-white border border-gray-100 text-gray-800"
            }`}
          >
            <div className={`mb-4 ${coloredMode ? "text-white/90" : "text-indigo-600"}`}>{card.icon}</div>
            <div className="font-black text-base leading-tight">{card.title}</div>
            <p className={`text-[11px] mt-1 font-medium ${coloredMode ? "text-white/70" : "text-gray-400"}`}>{card.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <h3 className="font-black text-gray-900 text-xl mb-8">Performance</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-indigo-900 p-8 rounded-[32px] text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
           {/* Flower Blobs in Mini Stats Card */}
           <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
           <div className="relative z-10">
              <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Today's Inflow</p>
              <h4 className="text-3xl font-black">{format(stats.inflow)}</h4>
           </div>
           <div className="relative z-10 pt-6 border-t border-indigo-800">
              <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">System Health</p>
              <h4 className="text-xl font-black flex items-center gap-2"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/> Operational</h4>
           </div>
        </div>
      </div>
    </div>
  );
}
