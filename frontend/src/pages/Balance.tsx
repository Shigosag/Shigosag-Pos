import React from "react";
import { Wallet, ArrowDownRight, ArrowUpRight, ShieldCheck, Download } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { formatCurrency } from "../utils/format";

export default function Balance() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-900">Wallet Statement</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition">
          <Download size={16} /> Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Available Funds</p>
            <h2 className="text-5xl font-black mt-2">{formatCurrency(user?.balance || 0)}</h2>
            <div className="mt-8 flex items-center gap-2 text-indigo-200 text-xs font-bold bg-white/10 w-fit px-3 py-1.5 rounded-full">
              <ShieldCheck size={14} /> Insured by Shigosag Institutional Vault
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 p-6 flex flex-col justify-center shadow-sm">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ArrowDownRight size={20}/></div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase">This Month In</p>
                 <p className="text-lg font-black text-slate-800">₦2.4M</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg"><ArrowUpRight size={20}/></div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase">This Month Out</p>
                 <p className="text-lg font-black text-slate-800">₦1.1M</p>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
         <h3 className="font-black text-slate-900 mb-6">Security Settings</h3>
         <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
               <div>
                  <p className="font-bold text-slate-800">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-400 font-medium">Verify transfers with mobile OTP</p>
               </div>
               <div className="w-12 h-6 bg-indigo-600 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
               <div>
                  <p className="font-bold text-slate-800">Login Notifications</p>
                  <p className="text-xs text-slate-400 font-medium">Alert me on new device entry</p>
               </div>
               <div className="w-12 h-6 bg-slate-200 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
            </div>
         </div>
      </div>
    </div>
  );
}
