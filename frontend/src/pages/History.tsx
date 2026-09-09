import React, { useState, useEffect } from "react";
import { api } from "../api/api";
import { ArrowUpRight, ArrowDownLeft, Search, Download, Loader2 } from "lucide-react";
import { formatCurrency } from "../utils/format";

export default function History() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    api.get("/pos/transactions")
      .then(res => {
        const payload = res.data?.data?.items || res.data?.data || [];
        setTransactions(Array.isArray(payload) ? payload : []);
      })
      .catch((err) => {
        console.error("Ledger Fetch Error:", err);
        setTransactions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const matchSearch = tx.reference?.toLowerCase().includes(search.toLowerCase()) ||
                        tx.recipientDetail?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "ALL" || tx.type === filterType;
    return matchSearch && matchType;
  });

  const exportCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ["Reference,Type,Recipient,Amount,Status,Date\n"];
    const rows = filteredTransactions.map(tx => 
      `"${tx.reference}","${tx.type}","${tx.recipientDetail || ''}","${tx.amount}","${tx.status}","${tx.createdAt}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shigosag-ledger-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Transaction Ledger</h1>
          <p className="text-slate-500 text-sm">Cryptographic, serializable institutional audit trail</p>
        </div>
        <button 
          onClick={exportCSV} 
          disabled={filteredTransactions.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition self-start sm:self-auto disabled:opacity-50"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium" 
                placeholder="Search reference, recipient account or bank..." 
              />
           </div>

           <div className="flex gap-2 overflow-x-auto">
             {["ALL", "SALE", "TRANSFER"].map((type) => (
               <button
                 key={type}
                 onClick={() => setFilterType(type)}
                 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                   filterType === type ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                 }`}
               >
                 {type}
               </button>
             ))}
           </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center items-center text-indigo-600">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
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
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-bold text-sm">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-indigo-50/20 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${tx.type === 'SALE' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                            {tx.type === 'SALE' ? <ArrowDownLeft size={16}/> : <ArrowUpRight size={16}/>}
                          </div>
                          <span className="font-bold text-slate-700 text-sm">{tx.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">{tx.reference}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800 truncate max-w-[240px]">{tx.recipientDetail || 'Retail Terminal'}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-black">{tx.paymentMethod}</p>
                      </td>
                      <td className={`px-6 py-4 font-black ${tx.type === 'SALE' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {tx.type === 'SALE' ? '+' : '-'}{formatCurrency(Number(tx.amount))}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
