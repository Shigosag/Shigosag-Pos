import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { Wallet, ArrowUpRight, ArrowDownLeft, Users, Package, History as HistoryIcon } from "lucide-react";

export default function Dashboard() {
  const [stats] = useState({
    balance: 10000000, // 10M balance
    dailyInflow: 0,
    dailyOutflow: 0,
    activeUsers: 12
  });

  // Calculate formatted strings here
  const formattedBalance = stats.balance.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  const formattedInflow = stats.dailyInflow.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  const formattedOutflow = stats.dailyOutflow.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  
  // Dynamic Status Color Logic
  const getStatusColor = (val: number) => val >= 0 ? "text-emerald-600" : "text-red-600";

  return (
    <div className="space-y-8">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-2xl"><Wallet /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Main Balance</p>
            <h3 className="text-2xl font-bold">{formattedBalance}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><ArrowUpRight /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Today's Inflow</p>
            <h3 className={`text-2xl font-bold ${getStatusColor(stats.dailyInflow)}`}>
              +{formattedInflow}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl"><ArrowDownLeft /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Today's Outflow</p>
            <h3 className="text-2xl font-bold text-orange-600">-{formattedOutflow}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Users /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Customers</p>
            <h3 className="text-2xl font-bold">2,381</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: POS Actions + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Quick Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link to="/pos/transfer" className="p-6 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition shadow-lg shadow-red-200 flex flex-col items-center gap-3">
              <Landmark size={32} />
              <span className="font-bold">Bank Transfer</span>
            </Link>
            <Link to="/sales" className="p-6 bg-white border border-gray-100 rounded-3xl hover:shadow-md transition flex flex-col items-center gap-3 text-gray-700">
              <Package size={32} className="text-red-600" />
              <span className="font-bold">Inventory Sale</span>
            </Link>
            <Link to="/airtime" className="p-6 bg-white border border-gray-100 rounded-3xl hover:shadow-md transition flex flex-col items-center gap-3 text-gray-700">
              <Phone size={32} className="text-emerald-600" />
              <span className="font-bold">Airtime/Data</span>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-800">Live Feed</h2>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full animate-pulse">LIVE</span>
          </div>
          <div className="space-y-4">
             {/* Dynamic items generated via Socket.IO would map here */}
             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
               <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">₦</div>
               <div className="flex-1">
                 <p className="text-sm font-bold">Transfer Received</p>
                 <p className="text-xs text-gray-500">Zenith Bank • 2 mins ago</p>
               </div>
               <p className="font-bold text-emerald-600">+₦5,000</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
