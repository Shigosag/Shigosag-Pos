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
  const { login, token } = useAuthStore();
  const [form, setForm] = useState({ accountNumber: "", bank: "Zenith Bank", amount: "", accountName: "" });

  const handleVerify = async () => {
    if (form.accountNumber.length !== 10) return setError("Enter 10 digits");
    setError(null); setLoading(true);
    try {
      const res = await api.post("/pos/verify-account", { accountNumber: form.accountNumber });
      setForm({ ...form, accountName: res.data.accountName });
      setStep(2);
    } catch { setError("Account not found"); } finally { setLoading(false); }
  };

  const handleProcess = async () => {
    if (Number(form.amount) > user.balance) return setError("Insufficient balance");
    setLoading(true);
    try {
      await api.post("/pos/process-transfer", form);
      const updatedUser = { ...user, balance: user.balance - Number(form.amount) };
      login(updatedUser, token || "");
      setStep(3);
    } catch { setError("Failed"); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 font-sans">
      <div className="bg-indigo-600 p-8 text-white text-center"><Landmark size={44} className="mx-auto mb-3" /><h2 className="text-xl font-black">Bank Transfer</h2></div>
      <div className="p-8">
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold border border-red-100"><AlertCircle size={16} /> {error}</div>}
        
        {step < 3 ? (
          <div className="space-y-5">
            <div className="mb-6 p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
              <div><p className="text-[10px] text-emerald-600 font-bold uppercase">Available</p><p className="text-2xl font-black text-emerald-900">{formatCurrency(user.balance)}</p></div>
              <Wallet className="text-emerald-500" size={24} />
            </div>
            {step === 1 ? (
              <>
                <input maxLength={10} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600" placeholder="Account Number" onChange={(e) => setForm({...form, accountNumber: e.target.value})} />
                <button onClick={handleVerify} disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black">{loading ? <Loader2 className="animate-spin" /> : "Verify Recipient"}</button>
              </>
            ) : (
              <>
                <div className="p-5 bg-slate-50 rounded-2xl border text-center font-bold"><p className="text-indigo-900">{form.accountName}</p><p className="text-xs text-slate-500">{form.accountNumber}</p></div>
                <input type="number" className="w-full p-4 bg-white border-b-4 text-center text-4xl font-black text-indigo-600 outline-none" placeholder="0.00" onChange={(e) => setForm({...form, amount: e.target.value})} />
                <button onClick={handleProcess} disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black">{loading ? <Loader2 className="animate-spin" /> : `Transfer ${formatCurrency(Number(form.amount))}`}</button>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-4 space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle size={40} /></div>
            <h3 className="text-2xl font-black text-slate-900">Transfer Successful</h3>
            <div className="bg-slate-50 p-6 rounded-2xl text-left border space-y-2 text-sm font-medium">
               <div className="flex justify-between"><span>Reference:</span> <span className="font-bold">SHG-{Math.floor(Math.random()*99999)}</span></div>
               <div className="flex justify-between"><span>Recipient:</span> <span className="font-bold">{form.accountName}</span></div>
               <div className="flex justify-between"><span>Amount:</span> <span className="font-black text-indigo-600">{formatCurrency(Number(form.amount))}</span></div>
            </div>
            <div className="flex flex-col gap-3">
               <button onClick={() => window.print()} className="w-full border py-4 rounded-2xl font-bold flex items-center justify-center gap-2"><Receipt size={18} /> Print</button>
               <button onClick={() => setStep(1)} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold">Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
