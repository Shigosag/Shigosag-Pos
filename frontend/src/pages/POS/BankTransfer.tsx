import React, { useState } from "react";
import { api } from "../../api/api";
import { CheckCircle, Loader2, Landmark, Receipt, Wallet, AlertCircle } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { formatCurrency } from "../../utils/format";
import { useNavigate } from "react-router-dom";

export default function BankTransfer() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const { login, token } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({ accountNumber: "", bank: "Zenith Bank", amount: "", accountName: "" });

  const handleVerify = async () => {
    if (form.accountNumber.length !== 10) return setError("Account number must be 10 digits");
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/pos/verify-account", { accountNumber: form.accountNumber });
      setForm({ ...form, accountName: res.data.accountName });
      setStep(2);
    } catch (err) { 
      setError("Bank account not found. Please verify details."); 
    } finally { setLoading(false); }
  };

  const handleProcess = async () => {
    if (Number(form.amount) > user.balance) {
      setError("Insufficient institutional balance");
      return;
    }
    setLoading(true);
    try {
      await api.post("/pos/process-transfer", form);
      
      const updatedUser = { ...user, balance: user.balance - Number(form.amount) };
      login(updatedUser, token || "");
      
      setStep(3);
    } catch (err: any) {
      setError("Transfer processing failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 font-sans">
      <div className="bg-indigo-600 p-8 text-white text-center relative overflow-hidden">
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
          <div className="mb-6 p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Available Balance</p>
              <p className="text-2xl font-black text-emerald-900">{formatCurrency(user.balance)}</p>
            </div>
            <Wallet className="text-emerald-500" size={24} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Bank</label>
              <select className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-700">
                <option>Zenith Bank</option>
                <option>GTBank</option>
                <option>Access Bank</option>
                <option>Kuda MFB</option>
              </select>
            </div>
            <input 
              maxLength={10} 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xl font-bold tracking-widest outline-none focus:ring-2 focus:ring-indigo-600 transition-all" 
              placeholder="0123456789" 
              onChange={(e) => setForm({...form, accountNumber: e.target.value})} 
            />
            <button onClick={handleVerify} disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-slate-800 transition flex justify-center items-center gap-2 shadow-xl shadow-slate-100 mt-2">
              {loading ? <Loader2 className="animate-spin" /> : "Verify Recipient Account"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center font-bold">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Account Name</p>
              <p className="text-lg font-black text-indigo-900">{form.accountName}</p>
              <p className="text-xs text-slate-500 font-medium">{form.accountNumber} • {form.bank}</p>
            </div>
            <input type="number" className="w-full p-4 bg-white border-b-4 border-slate-100 text-4xl font-black text-indigo-600 focus:border-indigo-600 outline-none text-center transition-colors" placeholder="0.00" onChange={(e) => setForm({...form, amount: e.target.value})} />
            <button onClick={handleProcess} disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black hover:bg-indigo-700 transition shadow-xl shadow-indigo-100">
              {loading ? <Loader2 className="animate-spin" /> : `Complete Transfer ${formatCurrency(Number(form.amount))}`}
            </button>
            <button onClick={() => setStep(1)} className="w-full text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-indigo-600 transition">Back to Search</button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-4 space-y-6 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={54} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Transfer Successful</h3>
            <div className="bg-slate-50 p-6 rounded-[24px] text-left border border-slate-100 space-y-2 text-sm font-medium">
               <div className="flex justify-between"><span>Reference:</span> <span className="font-bold">SHG-{Math.floor(Math.random()*99999)}</span></div>
               <div className="flex justify-between"><span>Recipient:</span> <span className="font-bold truncate max-w-[150px]">{form.accountName}</span></div>
               <div className="flex justify-between"><span>Amount:</span> <span className="font-black text-indigo-600">{formatCurrency(Number(form.amount))}</span></div>
            </div>
            <div className="flex flex-col gap-3">
               <button onClick={() => window.print()} className="w-full border-2 border-slate-100 py-4 rounded-2xl font-black text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 transition"><Receipt size={18} /> Print Confirmation</button>
               <button onClick={() => navigate("/")} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
