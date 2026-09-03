import React, { useState, useEffect } from "react";
import { api } from "../api/api";
import { History as HistoryIcon, ArrowUpRight, ArrowDownLeft, Search, FileText } from "lucide-react";
import { formatCurrency } from "../utils/format";

export default function History() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/pos/transactions")
      .then(res => setTransactions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Transaction Ledger</h1>
          <p className="text-slate-500 text-sm">Audit trail of all terminal activities</p>
        </div>
        <div className="flex gap-2">
           <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition">
              <FileText size={20} />
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm" placeholder="Search by reference or recipient..." />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-indigo-50/30 transition group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${tx.type === 'SALE' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        {tx.type === 'SALE' ? <ArrowDownLeft size={16}/> : <ArrowUpRight size={16}/>}
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-400">{tx.reference}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{tx.recipientDetail || 'Terminal Sale'}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{tx.paymentMethod}</p>
                  </td>
                  <td className={`px-6 py-4 font-black ${tx.type === 'SALE' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.type === 'SALE' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-400">
                    {new Date(tx.createdAt).toLocaleDateString()}
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
