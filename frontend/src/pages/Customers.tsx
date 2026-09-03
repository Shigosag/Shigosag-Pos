import React from "react";
import { User, Search, Phone, Mail, MoreHorizontal } from "lucide-react";

export default function Customers() {
  const users = [
    { name: "Segun Arulogun", email: "segun@example.com", phone: "+234 810 000 0000", debt: 0 },
    { name: "Arulogun Gabriel", email: "gabriel@example.com", phone: "+234 703 000 0000", debt: 15000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Customer Directory</h1>
        <p className="text-slate-500 text-sm">Manage your client relationships and credit</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {users.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <User size={24} />
              </div>
              <button className="text-slate-300 hover:text-slate-600"><MoreHorizontal /></button>
            </div>
            <h3 className="font-black text-slate-900 text-lg">{c.name}</h3>
            <div className="mt-4 space-y-2">
               <div className="flex items-center gap-2 text-slate-400 text-sm font-medium"><Phone size={14}/> {c.phone}</div>
               <div className="flex items-center gap-2 text-slate-400 text-sm font-medium"><Mail size={14}/> {c.email}</div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Outstanding</p>
               <p className={`font-black ${c.debt > 0 ? 'text-red-500' : 'text-emerald-500'}`}>₦{c.debt.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
