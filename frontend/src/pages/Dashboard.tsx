import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, ArrowUpRight, ArrowDownLeft, Users, Package, Landmark, Phone, BarChart3, History, Smartphone, Signal, Landmark as WithdrawIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAuthStore } from "../store/authStore";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [coloredMode, setColoredMode] = useState(true);

  const [stats] = useState({
    balance: user?.balance || 10000000,
    dailyInflow: 4200,
    dailyOutflow: 1150,
    activeUsers: 2381
  });

  const chartData = [
    { name: "Mon", sales: 1200 }, { name: "Tue", sales: 2100 }, { name: "Wed", sales: 1800 },
    { name: "Thu", sales: 2400 }, { name: "Fri", sales: 3200 }
  ];

  const formatNGN = (amt: number) => amt.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });

  const cards = [
    { title: "POS Sales", icon: <Package />, path: "/sales", color: "from-red-500 to-red-600" },
    { title: "Products", icon: <Package />, path: "/products", color: "from-blue-500 to-blue-600" },
    { title: "Customers", icon: <Users />, path: "/customers", color: "from-purple-500 to-purple-600" },
    { title: "Transfers", icon: <Landmark />, path: "/pos/transfer", color: "from-green-500 to-green-600" },
    { title: "Withdraw", icon: <WithdrawIcon />, path: "/withdraw", color: "from-yellow-500 to-orange-500" },
    { title: "History", icon: <History />, path: "/history", color: "from-gray-700 to-gray-900" },
    { title: "Airtime", icon: <Smartphone />, path: "/airtime", color: "from-pink-500 to-pink-600" },
    { title: "Data", icon: <Signal />, path: "/data", color: "from-indigo-500 to-indigo-600" },
    { title: "Balance", icon: <Wallet />, path: "/balance", color: "from-teal-500 to-teal-600" },
    { title: "Analytics", icon: <BarChart3 />, path: "/analytics", color: "from-slate-600 to-slate-800" }
  ];

  return (
    <div className="space-y-6">
      {/* Header + Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🚀 Shigosag POS</h1>
          <p className="text-gray-500">Real-time fintech dashboard</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border">
          <span className="text-xs font-bold text-gray-500 uppercase">{coloredMode ? "Colored" : "Light"}</span>
          <button 
            onClick={() => setColoredMode(!coloredMode)}
            className={`w-12 h-6 rounded-full transition-all relative ${coloredMode ? 'bg-red-600' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${coloredMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="bg-red-600 text-white p-4 rounded-2xl flex justify-between items-center shadow-lg shadow-red-100">
        <div>
          <p className="font-bold">System Status</p>
          <p className="text-xs opacity-90">All POS services operational</p>
        </div>
        <div className="flex items-center gap-2 font-bold"><div className="w-2 h-2 bg-green-400 rounded-full animate-ping"/> Online</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Main Balance", val: formatNGN(stats.balance), icon: <Wallet/>, col: "text-red-600", bg: "bg-red-50" },
          { label: "Today's Inflow", val: "+" + formatNGN(stats.dailyInflow), icon: <ArrowUpRight/>, col: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Today's Outflow", val: "-" + formatNGN(stats.dailyOutflow), icon: <ArrowDownLeft/>, col: "text-orange-600", bg: "bg-orange-50" },
          { label: "Customers", val: stats.activeUsers.toLocaleString(), icon: <Users/>, col: "text-blue-600", bg: "bg-blue-50" }
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 ${s.bg} ${s.col} rounded-2xl`}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">{s.label}</p>
              <h3 className={`text-xl font-black ${s.col}`}>{s.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid (The Colorful Part) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.path}
            className={`p-6 rounded-3xl transition-all transform hover:scale-105 shadow-sm hover:shadow-xl flex flex-col items-center gap-2 text-center ${
              coloredMode ? `bg-gradient-to-br ${card.color} text-white` : "bg-white border border-gray-100 text-gray-700"
            }`}
          >
            <div className={coloredMode ? "text-white" : "text-red-600"}>{card.icon}</div>
            <span className="font-bold text-sm">{card.title}</span>
          </Link>
        ))}
      </div>

      {/* Bottom Section: Chart + Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BarChart3 size={18}/> Sales Analytics</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="sales" stroke="#ef4444" strokeWidth={4} dot={{ r: 6, fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-800">Live Feed</h2>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">LIVE</span>
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">₦</div>
               <div className="flex-1">
                 <p className="text-sm font-bold">Transfer Received</p>
                 <p className="text-[10px] text-gray-400">Zenith Bank • 2 mins ago</p>
               </div>
               <p className="font-bold text-emerald-600">+₦5,000</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
