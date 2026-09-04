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
  const login = useAuthStore((s) => s.login);
  const token = useAuthStore((s) => s.token);

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
      setError("Bank account not found."); 
    } finally { setLoading(false); }
  };

  const handleProcess = async () => {
    if (Number(form.amount) > balance) {
      setError("Insufficient balance");
      return;
    }
    setLoading(true);
    try {
      await api.post("/pos/process-transfer", form);
      
      // Update the 10M balance in the Global UI
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
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
      <div className="bg-indigo-600 p-8 text-white text-center">
        <Landmark size={44} className="mx-auto mb-3" />
        <h2 className="text-xl font-black">Bank Transfer</h2>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold border border-red-100">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {step < 3 && (
          <div className="mb-6 p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Available Balance</p>
              <p className="text-2xl font-black text-emerald-900">{formatCurrency(balance)}</p>
            </div>
            <Wallet className="text-emerald-500" size={24} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <input maxLength={10} className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xl font-bold tracking-widest outline-none focus:ring-2 focus:ring-indigo-600" placeholder="0123456789" onChange={(e) => setForm({...form, accountNumber: e.target.value})} />
            <button onClick={handleVerify} disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-slate-800 transition flex justify-center items-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : "Verify Recipient"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-lg font-black text-indigo-900">{form.accountName}</p>
              <p className="text-xs text-slate-500 font-medium">{form.accountNumber} • {form.bank}</p>
            </div>
            <input type="number" className="w-full p-4 bg-white border-b-4 border-slate-100 text-4xl font-black text-indigo-600 focus:border-indigo-600 outline-none text-center" placeholder="0.00" onChange={(e) => setForm({...form, amount: e.target.value})} />
            <button onClick={handleProcess} disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black hover:bg-indigo-700 transition">
              {loading ? <Loader2 className="animate-spin" /> : `Transfer ${formatCurrency(Number(form.amount))}`}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-4 space-y-6 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle size={54} /></div>
            <h3 className="text-2xl font-black text-slate-900">Transfer Successful</h3>
            <button onClick={() => setStep(1)} className="text-indigo-600 font-black text-sm hover:underline">New Transfer</button>
          </div>
        )}
      </div>
    </div>
  );
}
