import React, { useState } from "react";
import { api } from "../../api/api";
import { CheckCircle, Loader2, Landmark, Receipt, Wallet } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function BankTransfer() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((s) => s.user);
  const balance = user?.balance || 10000000;
  const [form, setForm] = useState({ accountNumber: "", bank: "Zenith Bank", amount: "", accountName: "" });

  const formatNGN = (amt: number) => amt.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });

  const handleVerify = async () => {
    if (form.accountNumber.length !== 10) return;
    setLoading(true);
    try {
      const res = await api.post("/pos/verify-account", { accountNumber: form.accountNumber });
      setForm({ ...form, accountName: res.data.accountName });
      setStep(2);
    } catch (err) { alert("Bank account not found"); } 
    finally { setLoading(false); }
  };

  const handleProcess = async () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 1500);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      <div className="bg-indigo-600 p-6 text-white text-center">
        <Landmark size={40} className="mx-auto mb-2" />
        <h2 className="text-xl font-bold">Bank Transfer</h2>
      </div>

      <div className="p-8">
        {step < 3 && (
          <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
            <div className="p-2 bg-emerald-500 text-white rounded-lg"><Wallet size={20}/></div>
            <div>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Balance</p>
              <p className="text-xl font-black text-emerald-900">{formatNGN(balance)}</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <select className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
              <option>Zenith Bank</option>
              <option>Access Bank</option>
              <option>Kuda MFB</option>
            </select>
            <input 
              maxLength={10}
              className="w-full p-3 bg-gray-50 border rounded-xl text-lg outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Account Number"
              onChange={(e) => setForm({...form, accountNumber: e.target.value})}
            />
            <button onClick={handleVerify} disabled={loading} className="w-full bg-black text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : "Verify Account"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 font-bold">RECIPIENT</p>
              <p className="text-lg font-bold text-gray-900">{form.accountName}</p>
            </div>
            <input 
              type="number" 
              className="w-full p-3 border-b-2 border-gray-200 text-3xl font-bold focus:border-indigo-500 outline-none"
              placeholder="0.00"
              onChange={(e) => setForm({...form, amount: e.target.value})}
            />
            <button onClick={handleProcess} disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">
              {loading ? <Loader2 className="animate-spin" /> : `Transfer ${formatNGN(Number(form.amount))}`}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-4 space-y-4 animate-in zoom-in">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle size={48} /></div>
            <h3 className="text-2xl font-bold text-gray-800">Successful</h3>
            <button onClick={() => window.print()} className="w-full border-2 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50"><Receipt size={18} /> Print</button>
            <button onClick={() => setStep(1)} className="text-indigo-600 font-bold text-sm">New Transfer</button>
          </div>
        )}
      </div>
    </div>
  );
}
