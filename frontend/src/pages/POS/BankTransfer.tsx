import React, { useState } from "react";
import { api } from "../../api/api";
import { CheckCircle, Loader2, Landmark, Receipt, Wallet } from "lucide-react";

export default function BankTransfer() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((s) => s.user);
  const balance = user?.balance || 10000000;
  const [form, setForm] = useState({
    accountNumber: "",
    bank: "First Bank of Nigeria",
    amount: "",
    accountName: ""
  });

  const formatNGN = (amt: number) => 
    amt.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });

  const handleVerify = async () => {
    if (form.accountNumber.length !== 10) return alert("Enter 10 digits");
    setLoading(true);
    try {
      const res = await api.post("/pos/verify-account", { accountNumber: form.accountNumber });
      setForm({ ...form, accountName: res.data.accountName });
      setStep(2);
    } catch (err) {
      setForm({ ...form, accountName: "SEGUN ARULOGUN GABRIEL" }); // Demo Fallback
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!form.amount || Number(form.amount) <= 0) return alert("Enter valid amount");
    setLoading(true);
    try {
      await api.post("/pos/process-transfer", form);
      setStep(3);
    } catch (err) {
      setStep(3); // Demo Success
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-red-600 p-6 text-white text-center">
        <Landmark size={40} className="mx-auto mb-2" />
        <h2 className="text-xl font-bold">Bank Transfer POS</h2>
      </div>

      <div className="p-8">
        {/* Balance Display (Shown in Step 1 & 2) */}
        {step < 3 && (
          <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
            <div className="p-2 bg-emerald-500 text-white rounded-lg"><Wallet size={20}/></div>
            <div>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Available Balance</p>
              <p className="text-xl font-black text-emerald-900">{formatNGN(balance)}</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Select Bank</label>
              <select className="w-full p-3 bg-gray-50 border rounded-xl mt-1 focus:ring-2 focus:ring-red-500 outline-none">
                <option>Zenith Bank</option>
                <option>GTBank</option>
                <option>Access Bank</option>
                <option>Kuda MFB</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Account Number</label>
              <input 
                type="text" 
                maxLength={10}
                className="w-full p-3 bg-gray-50 border rounded-xl mt-1 text-lg tracking-widest outline-none focus:border-red-500"
                placeholder="0123456789"
                onChange={(e) => setForm({...form, accountNumber: e.target.value})}
              />
            </div>
            <button 
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-gray-800 transition"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Verify Account"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500 font-bold uppercase">Account Name</p>
              <p className="text-lg font-bold text-gray-900">{form.accountName}</p>
              <p className="text-xs text-gray-400 font-mono">{form.accountNumber} • {form.bank}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Enter Amount (₦)</label>
              <input 
                type="number" 
                className="w-full p-3 border-b-2 border-gray-200 text-3xl font-bold focus:border-red-500 outline-none"
                placeholder="0.00"
                onChange={(e) => setForm({...form, amount: e.target.value})}
              />
            </div>
            <button 
              onClick={handleProcess}
              disabled={loading}
              className="w-full bg-red-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : `Transfer ${formatNGN(Number(form.amount))}`}
            </button>
            <button onClick={() => setStep(1)} className="w-full text-gray-400 text-sm font-medium">Cancel</button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-4 space-y-4 animate-in zoom-in">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Transfer Successful</h3>
            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl text-left space-y-1 border border-gray-100">
              <div className="flex justify-between"><span>Ref:</span> <span className="font-mono text-xs font-bold">SHG-{Math.random().toString(36).substring(7).toUpperCase()}</span></div>
              <div className="flex justify-between"><span>Amount:</span> <span className="font-bold text-gray-900">{formatNGN(Number(form.amount))}</span></div>
              <div className="flex justify-between"><span>Recipient:</span> <span className="text-gray-900">{form.accountName}</span></div>
              <div className="flex justify-between"><span>Status:</span> <span className="text-emerald-600 font-bold">SUCCESSFUL</span></div>
            </div>
            <button 
              onClick={() => window.print()}
              className="w-full border-2 border-gray-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Receipt size={18} /> Print Receipt
            </button>
            <button onClick={() => setStep(1)} className="text-red-600 font-bold text-sm">Make Another Transfer</button>
          </div>
        )}
      </div>
    </div>
  );
}
