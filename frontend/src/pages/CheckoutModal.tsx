import React, { useState } from "react";
import { CheckCircle2, CreditCard, X, Printer } from "lucide-react";
import { formatCurrency } from "../utils/format";

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>(12500); 
  const [expiry, setExpiry] = useState("");

  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.substring(0, 2) + "/" + value.substring(2, 4);
    setExpiry(value);
  };

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-[420px] rounded-[32px] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-8">
           <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <CreditCard size={20} />
           </div>
           <h2 className="text-xl font-black text-slate-900 tracking-tight">Secure Checkout</h2>
        </div>

        {step === "form" && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border-none p-4 rounded-2xl text-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none mt-1"
              />
            </div>

            <div className="space-y-3">
              <input placeholder="Card Number" className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold" maxLength={16} />
              <div className="flex gap-3">
                <input value={expiry} onChange={handleExpiry} placeholder="MM/YY" maxLength={5} className="w-1/2 bg-slate-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold" />
                <input placeholder="CVC" maxLength={3} className="w-1/2 bg-slate-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold" />
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className="mt-4 w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
            >
              {loading ? "Processing Terminal..." : `Pay ${formatCurrency(amount)}`}
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
              <CheckCircle2 className="text-emerald-500" size={40} />
            </div>

            <h3 className="text-2xl font-black text-slate-900">Payment Confirmed</h3>
            <p className="text-slate-500 mt-2 font-medium italic">Transaction was successful</p>

            <div className="mt-8 text-sm bg-slate-50 p-6 rounded-[24px] text-left space-y-2 border border-slate-100">
              <div className="flex justify-between"><span className="text-slate-400 font-bold uppercase">Reference</span> <span className="font-mono font-bold text-slate-700 uppercase tracking-tighter">SHG-{Math.floor(Math.random() * 999999)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 font-bold uppercase">Amount</span> <span className="font-black text-indigo-600">{formatCurrency(amount)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 font-bold uppercase">Status</span> <span className="text-emerald-600 font-black">PAID SUCCESS</span></div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => window.print()} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition">
                <Printer size={18} /> Receipt
              </button>
              <button onClick={onClose} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition">
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
