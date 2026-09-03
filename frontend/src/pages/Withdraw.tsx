import React from "react";
import { Wallet, Landmark, AlertCircle } from "lucide-react";

export default function Withdraw() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-indigo-600 p-10 rounded-[40px] text-white flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Settlement Balance</p>
          <h2 className="text-4xl font-black">₦842,500.00</h2>
        </div>
        <Wallet size={48} className="opacity-20" />
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
         <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-4 rounded-2xl text-xs font-bold border border-amber-100">
            <AlertCircle size={18} /> Settlements take 24 hours to clear into your commercial bank.
         </div>

         <div className="space-y-4">
            <div className="flex justify-between items-center p-5 bg-slate-50 rounded-3xl border border-slate-100">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><Landmark size={20}/></div>
                  <div>
                    <p className="font-bold text-slate-900">First Bank of Nigeria</p>
                    <p className="text-xs text-slate-400">312***990</p>
                  </div>
               </div>
               <input type="radio" checked readOnly className="w-5 h-5 accent-indigo-600" />
            </div>
            
            <input className="w-full p-5 bg-slate-50 border-none rounded-3xl text-2xl font-black focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Enter amount to withdraw" />
            
            <button className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg hover:bg-slate-800 transition">
              Initiate Settlement
            </button>
         </div>
      </div>
    </div>
  );
}
