import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const socket = io("http://localhost:5000");

export default function Dashboard() {
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [coloredMode, setColoredMode] = useState(true); // toggle mode

  const data = [
    { name: "Mon", sales: 1200 },
    { name: "Tue", sales: 2100 },
    { name: "Wed", sales: 1800 },
    { name: "Thu", sales: 2400 },
    { name: "Fri", sales: 3200 }
  ];

  useEffect(() => {
    socket.on("transaction:new", (tx) => {
      setLiveFeed((prev) => [tx, ...prev.slice(0, 4)]);
    });
    return () => socket.disconnect();
  }, []);

  const cards = [
    { title: "POS Sales", icon: "🛒", path: "/sales", color: "from-red-500 to-red-600", description: "Process customer sales" },
    { title: "Products", icon: "📦", path: "/products", color: "from-blue-500 to-blue-600", description: "Manage inventory" },
    { title: "Customers", icon: "👥", path: "/customers", color: "from-purple-500 to-purple-600", description: "Customer management" },
    { title: "Transfers", icon: "💸", path: "/transfers", color: "from-green-500 to-green-600", description: "Send money" },
    { title: "Withdraw", icon: "🏧", path: "/withdraw", color: "from-yellow-500 to-orange-500", description: "Cash withdrawal" },
    { title: "History", icon: "📜", path: "/history", color: "from-gray-700 to-gray-900", description: "Transaction history" },
    { title: "Airtime", icon: "📱", path: "/airtime", color: "from-pink-500 to-pink-600", description: "Recharge airtime" },
    { title: "Data", icon: "📶", path: "/data", color: "from-indigo-500 to-indigo-600", description: "Buy data plans" },
    { title: "Balance", icon: "💰", path: "/balance", color: "from-teal-500 to-teal-600", description: "Check account balance" },
    { title: "Analytics", icon: "📊", path: "/analytics", color: "from-slate-600 to-slate-800", description: "Reports & insights" }
  ];

  return (
    <div>
      {/* Header + iOS-Style Mode Toggle */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🚀 Shigosag POS</h1>
          <p className="text-gray-500 mt-2">Real-time fintech dashboard system</p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">
            {coloredMode ? "Colored Mode" : "Normal Mode"}
          </span>
          <button
            onClick={() => setColoredMode(!coloredMode)}
            className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
              coloredMode ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                coloredMode ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-red-600 text-white rounded-xl shadow p-4 mb-6 flex justify-between items-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div>
          <h3 className="font-semibold">System Status</h3>
          <p className="text-sm opacity-90">All POS services operational</p>
        </div>
        <div className="text-lg font-bold">🟢 Online</div>
      </div>

      {/* Available Balance */}
      <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mb-4">
        <p className="text-gray-500 text-sm">Available Balance</p>
        <p className="text-2xl font-bold">$25,783.50</p>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-8">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.path}
            className={`p-5 rounded-xl shadow hover:shadow-xl transform transition-all duration-300 ${
              coloredMode
                ? `bg-gradient-to-r ${card.color} text-white`
                : "bg-white text-gray-800 border border-gray-200"
            }`}
          >
            <div className="text-3xl">{card.icon}</div>
            <div className="font-bold mt-2">{card.title}</div>
            <p className="text-sm mt-1">{card.description}</p>
          </Link>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-5 rounded-2xl shadow mt-8">
        <h2 className="font-semibold mb-4">📊 Sales Analytics</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#ef4444" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {[
          { label: "Sales", value: "$12,540" },
          { label: "Transactions", value: "124" },
          { label: "Customers", value: "2,381" },
          { label: "Status", value: "LIVE 🟢" }
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Live Sales Feed */}
      <div className="mt-10 bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-semibold mb-4">Live Sales Feed</h2>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          <div className="border-b pb-2 animate-pulse">🛒 New sale completed</div>
          <div className="border-b pb-2 animate-pulse">📦 Product stock updated</div>
          <div className="border-b pb-2 animate-pulse">👥 New customer added</div>
          <div className="animate-pulse">💸 Transfer processed</div>
        </div>
      </div>

      {/* Live Transactions & History */}
      <div className="grid md:grid-cols-2 gap-5 mt-8">
        {/* Live Transactions */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">🔴 Live Transactions</h2>
          <div className="space-y-2 text-sm">
            {liveFeed.length === 0 && <p className="text-gray-400">Waiting for activity...</p>}
            {liveFeed.map((tx, i) => (
              <div key={i} className="flex justify-between border-b pb-2">
                <span>🛒 {tx.type || "Sale"}</span>
                <span className="text-green-500">${tx.amount || "0"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* History Panel */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">📜 Transaction History</h2>
          <p className="text-gray-500 text-sm mb-4">
            View withdrawals, transfers & payments history
          </p>
          <Link
            to="/history"
            className="inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Open History
          </Link>
        </div>
      </div>
    </div>
  );
}