import React from "react";
import { Landmark, Search } from "lucide-react";
import { formatCurrency } from "../utils/format";

export default function Transfers() {
  const transferLogs = [
    { ref: "SHG-88210", bank: "Zenith Bank", name: "Segun Gabriel", amount: 50000, status: "SUCCESS" },
    { ref: "SHG-88211", bank: "GTBank", name: "Arulogun Gabriel", amount: 12000, status: "SUCCESS" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Outbound Transfers</h1>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-sm" placeholder="Filter logs..." />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
              <tr>
                <th className="px-6 py-4">Bank</th>
                <th className="px-6 py-4">Recipient</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transferLogs.map((log) => (
                <tr key={log.ref} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 font-bold text-slate-700">
                      <Landmark size={16} className="text-indigo-600"/> {log.bank}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">{log.name}</td>
                  <td className="px-6 py-4 font-black text-slate-900">{formatCurrency(log.amount)}</td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                       {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
