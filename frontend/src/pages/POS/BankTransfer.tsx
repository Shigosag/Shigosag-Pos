import React, { useState } from "react";
import { api } from "../../api/api";
import { CheckCircle, Loader2, Landmark, Receipt, Wallet, AlertCircle } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { formatCurrency } from "../../utils/format";

export default function BankTransfer() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const balance = user?.balance || 0;
  const [form, setForm] = useState({ accountNumber: "", bank: "Zenith Bank", amount: "", accountName: "" });

  const handleVerify = async () => {
    if (form.accountNumber.length !== 10) {
      setError("Account number must be 10 digits");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/pos/verify-account", { accountNumber: form.accountNumber });
      setForm({ ...form, accountName: res.data.accountName });
      setStep(2);
    } catch (err) { 
      setError("Bank account not found. Please check the number."); 
    } finally { setLoading(false); }
  };

  const handleProcess = async () => {
    if (Number(form.amount) > balance) {
      setError("Insufficient balance for this transaction");
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 1500);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in duration-500">
      <div className="bg-indigo-600 p-8 text-white text-center relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <Landmark size={44} className="mx-auto mb-3 relative z-10" />
        <h2 className="text-xl font-black relative z-10 tracking-tight">Bank Transfer</h2>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold border border-red-100 animate-in slide-in-from-top-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {step < 3 && (
          <div className="mb-6 p-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Available Balance</p>
              <p className="text-2xl font-black text-indigo-900">{formatCurrency(balance)}</p>
            </div>
            <Wallet className="text-indigo-200" size={24} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Institution</label>
              <select className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-700">
                <option>Zenith Bank</option>
                <option>GTBank</option>
                <option>Access Bank</option>
                <option>Kuda MFB</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Number</label>
              <input 
                maxLength={10}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xl font-bold tracking-widest outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="0123456789"
                onChange={(e) => setForm({...form, accountNumber: e.target.value})}
              />
            </div>
            <button onClick={handleVerify} disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-slate-800 transition flex justify-center items-center gap-2 shadow-xl shadow-slate-100 mt-2">
              {loading ? <Loader2 className="animate-spin" /> : "Verify Recipient"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Recipient Name</p>
              <p className="text-lg font-black text-indigo-900 mt-1">{form.accountName}</p>
              <p className="text-xs text-slate-500 font-medium">{form.accountNumber} • {form.bank}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transfer Amount (₦)</label>
              <input 
                type="number" 
                className="w-full p-4 bg-white border-b-4 border-slate-100 text-4xl font-black text-indigo-600 focus:border-indigo-600 outline-none transition-colors"
                placeholder="0.00"
                onChange={(e) => setForm({...form, amount: e.target.value})}
              />
            </div>
            <button onClick={handleProcess} disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black hover:bg-indigo-700 transition shadow-xl shadow-indigo-100">
              {loading ? <Loader2 className="animate-spin" /> : `Transfer ${formatCurrency(Number(form.amount))}`}
            </button>
            <button onClick={() => setStep(1)} className="w-full text-slate-400 text-xs font-bold uppercase tracking-widest">Back</button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-4 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={54} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Transfer Successful</h3>
              <p className="text-slate-500 font-medium text-sm">Funds have been dispatched.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl text-left border border-slate-100 space-y-2">
               <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold uppercase">Ref:</span> <span className="font-mono font-black text-slate-700">SHG-{Math.random().toString(36).substring(7).toUpperCase()}</span></div>
               <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold uppercase">Amount:</span> <span className="font-black text-slate-900">{formatCurrency(Number(form.amount))}</span></div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => window.print()} className="w-full border-2 border-slate-100 py-4 rounded-2xl font-black text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 transition">
                <Receipt size={18} /> Print Receipt
              </button>
              <button onClick={() => setStep(1)} className="text-indigo-600 font-black text-sm hover:underline">New Transfer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
