import React, { useState } from "react";
import { api } from "../../api/api";
import { CheckCircle, Loader2, Landmark, Receipt } from "lucide-react";

export default function BankTransfer() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    accountNumber: "",
    bank: "Zenith Bank",
    amount: "",
    accountName: ""
  });

  const handleVerify = async () => {
    if (form.accountNumber.length !== 10) return alert("Enter 10 digits");
    setLoading(true);
    try {
      const res = await api.post("/pos/verify-account", { accountNumber: form.accountNumber });
      setForm({ ...form, accountName: res.data.accountName });
      setStep(2);
    } catch (err) {
      alert("Account not found");
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    setLoading(true);
    try {
      await api.post("/pos/process-transfer", form);
      setStep(3);
    } catch (err) {
      alert("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      <div className="bg-red-600 p-6 text-white text-center">
        <Landmark size={40} className="mx-auto mb-2" />
        <h2 className="text-xl font-bold">Bank Transfer POS</h2>
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="space-y-4">
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
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <p className="text-xs text-emerald-600 font-bold uppercase">Account Name</p>
              <p className="text-lg font-bold text-emerald-900">{form.accountName}</p>
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
              {loading ? <Loader2 className="animate-spin" /> : "Complete Transfer"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-4 space-y-4 animate-in zoom-in">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Transfer Successful</h3>
            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl text-left space-y-1">
              <div className="flex justify-between"><span>Ref:</span> <span className="font-mono">SHG-{Math.random().toString(36).substring(7).toUpperCase()}</span></div>
              <div className="flex justify-between"><span>Amount:</span> <span className="font-bold">₦{Number(form.amount).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Status:</span> <span className="text-emerald-600 font-bold">PAID</span></div>
            </div>
            <button 
              onClick={() => window.print()}
              className="w-full border-2 border-gray-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Receipt size={18} /> Print Receipt
            </button>
            <button onClick={() => setStep(1)} className="text-gray-500 font-medium text-sm">New Transaction</button>
          </div>
        )}
      </div>
    </div>
  );
}
