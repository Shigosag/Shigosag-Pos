import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Users, ShoppingBag, CreditCard } from "lucide-react";

export default function Analytics() {
  const data = [
    { name: "Mon", total: 4000 }, { name: "Tue", total: 3000 }, { name: "Wed", total: 2000 },
    { name: "Thu", total: 2780 }, { name: "Fri", total: 1890 }, { name: "Sat", total: 2390 }, { name: "Sun", total: 3490 }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Performance Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Gross Volume", val: "₦1.2M", icon: <TrendingUp/>, color: "text-indigo-600" },
          { label: "Active Clients", val: "1,204", icon: <Users/>, color: "text-blue-600" },
          { label: "Avg Basket", val: "₦4,500", icon: <ShoppingBag/>, color: "text-emerald-600" },
          { label: "Transactions", val: "482", icon: <CreditCard/>, color: "text-purple-600" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm">
             <div className={`${s.color} mb-3`}>{s.icon}</div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
             <p className="text-xl font-black text-slate-900">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <h3 className="font-black text-slate-900 text-lg mb-8">Revenue Distribution</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
              <Bar dataKey="total" radius={[10, 10, 10, 10]} barSize={40}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 4 ? '#4338ca' : '#e2e8f0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
