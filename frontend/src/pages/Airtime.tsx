import React, { useState } from "react";
import { Smartphone, Signal, Loader2, CheckCircle } from "lucide-react";
import { formatCurrency } from "../utils/format";

export default function VASPage({ mode = 'airtime' }: { mode?: 'airtime' | 'data' }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 2000);
  };

  if (success) return (
    <div className="max-w-md mx-auto py-20 text-center space-y-4 animate-in zoom-in">
      <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto"><CheckCircle size={40}/></div>
      <h2 className="text-2xl font-black text-slate-900">Purchase Successful</h2>
      <p className="text-slate-500">The recipient has been credited.</p>
      <button onClick={() => setSuccess(false)} className="text-indigo-600 font-bold hover:underline">New Purchase</button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
          {mode === 'airtime' ? <Smartphone /> : <Signal />}
        </div>
        <h2 className="text-xl font-black text-slate-900 capitalize">{mode} Purchase</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Mobile Number</label>
          <input required type="tel" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold" placeholder="080XXXXXXXX" />
        </div>

        <div className="grid grid-cols-2 gap-3">
           {['MTN', 'Airtel', 'Glo', '9Mobile'].map(n => (
             <button type="button" key={n} className="py-3 border-2 border-slate-50 rounded-xl font-bold text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all">{n}</button>
           ))}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Amount</label>
          <input required type="number" className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xl font-black focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="0.00" />
        </div>

        <button disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black hover:bg-indigo-700 transition flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : "Process Purchase"}
        </button>
      </form>
    </div>
  );
}
