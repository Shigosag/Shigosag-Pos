import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Rocket, Wallet, ArrowUpRight, ArrowDownLeft, Users, 
  Package, Landmark, History, Smartphone, Signal, 
  BarChart3, CreditCard, ChevronRight 
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
    { title: "Transfers", icon: <Landmark size={28}/>, path: "/pos/transfer", color: "from-green-500 to-green-600", desc: "Send money" },
    { title: "Withdraw", icon: <Wallet size={28}/>, path: "/withdraw", color: "from-yellow-500 to-orange-500", desc: "Cash out" },
    { title: "History", icon: <History size={28}/>, path: "/history", color: "from-gray-700 to-gray-900", desc: "Audit logs" },
    { title: "Airtime", icon: <Smartphone size={28}/>, path: "/airtime", color: "from-pink-500 to-pink-600", desc: "Top up" },
    { title: "Data", icon: <Signal size={28}/>, path: "/data", color: "from-indigo-500 to-indigo-600", desc: "Internet" },
    { title: "Balance", icon: <Landmark size={28}/>, path: "/balance", color: "from-teal-500 to-teal-600", desc: "Statements" },
    { title: "Analytics", icon: <BarChart3 size={28}/>, path: "/analytics", color: "from-slate-600 to-slate-800", desc: "Insights" }
  ];

  const format = (val: number) => val.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });

  return (
    <div className="space-y-8 pb-10">
      {/* Header with Vector Icon */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-200">
            <Rocket size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shigosag POS</h1>
            <p className="text-gray-500 font-medium">Fintech Terminal System</p>
          </div>
        </div>

        <button 
          onClick={() => setColoredMode(!coloredMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs transition-all border ${
            coloredMode ? "bg-red-50 text-red-600 border-red-100" : "bg-white text-gray-400 border-gray-100"
          }`}
        >
          {coloredMode ? "COLORED MODE" : "NORMAL MODE"}
          <div className={`w-8 h-4 rounded-full relative transition-all ${coloredMode ? "bg-red-600" : "bg-gray-200"}`}>
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${coloredMode ? "left-4.5" : "left-0.5"}`} />
          </div>
        </button>
      </div>

      {/* Main Balance Card */}
      <div className="bg-emerald-50 p-8 rounded-[32px] border border-emerald-100 flex justify-between items-center group hover:shadow-lg hover:shadow-emerald-100/50 transition-all">
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Available Balance</p>
          <h2 className="text-5xl font-black text-emerald-900">{format(stats.balance)}</h2>
        </div>
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-200">
          <Wallet size={32} />
        </div>
      </div>

      {/* Quick Actions Grid (Restored 5-column layout with Descriptions) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.path}
            className={`p-6 rounded-[28px] transition-all transform hover:-translate-y-1 shadow-sm hover:shadow-xl ${
              coloredMode ? `bg-gradient-to-br ${card.color} text-white` : "bg-white border border-gray-100 text-gray-800"
            }`}
          >
            <div className={`mb-4 ${coloredMode ? "text-white/90" : "text-red-600"}`}>
              {card.icon}
            </div>
            <div className="font-black text-base leading-tight">{card.title}</div>
            <p className={`text-[11px] mt-1 font-medium ${coloredMode ? "text-white/70" : "text-gray-400"}`}>
              {card.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* Analytics & Inflow Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-gray-900 text-xl">Sales Analytics</h3>
            <select className="bg-gray-50 border-none rounded-xl text-xs font-bold p-2 outline-none text-gray-500">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="sales" stroke="#ef4444" strokeWidth={5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-emerald-600 p-6 rounded-[32px] text-white shadow-lg shadow-emerald-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-lg"><ArrowUpRight size={20}/></div>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full">TODAY</span>
            </div>
            <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Total Inflow</p>
            <h4 className="text-2xl font-black mt-1">{format(stats.inflow)}</h4>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-gray-900">Live Feed</h3>
              <div className="flex items-center gap-1 text-emerald-500 font-bold text-[10px]"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> LIVE</div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-red-600"><CreditCard size={18}/></div>
                <div className="flex-1"><p className="text-xs font-black text-gray-800">New POS Sale</p><p className="text-[10px] text-gray-400">Just now</p></div>
                <p className="text-xs font-black text-emerald-600">+₦12,500</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
