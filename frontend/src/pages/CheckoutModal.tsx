import React, { useState } from "react";
import { CheckCircle2, CreditCard, X, Printer, Loader2, AlertCircle } from "lucide-react";
import { formatCurrency } from "../utils/format";
import { api } from "../api/api";
import { useCart } from "../store/cartStore";

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { items, clearCart } = useCart();
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  const handlePay = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError(null);
    
    try {
      await api.post("/pos/checkout", {
        items,
        total,
        paymentMethod: "CARD"
      });
      clearCart();
      setStep("success");
    } catch (err: any) {
      setError(err.response?.data?.message || "Payment processing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-[150] p-4">
      <div className="bg-white w-full max-w-[440px] rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">
        
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition p-2 hover:bg-slate-50 rounded-full">
          <X size={24} />
        </button>

        <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <CreditCard size={24} />
           </div>
           <div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Terminal Payment</h2>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Transaction ID: TX-{Date.now()}</p>
           </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {step === "form" && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Amount Due</p>
              <p className="text-4xl font-black text-indigo-600 text-center">{formatCurrency(total)}</p>
            </div>

            <div className="space-y-3">
              <input placeholder="Card Number" className="w-full bg-slate-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-lg" maxLength={16} />
              <div className="flex gap-4">
                <input placeholder="MM/YY" maxLength={5} className="w-1/2 bg-slate-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-center" />
                <input placeholder="CVC" maxLength={3} className="w-1/2 bg-slate-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-center" />
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={loading || total <= 0}
              className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black text-xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : `Finalize ${formatCurrency(total)}`}
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-6 animate-in fade-in slide-in-from-bottom-8">
            <div className="mx-auto w-24 h-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-8 shadow-inner">
              <CheckCircle2 size={56} />
            </div>

            <h3 className="text-3xl font-black text-slate-900">Paid Successfully</h3>
            <p className="text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-[0.3em]">Institutional Clearance Granted</p>

            <div className="mt-10 flex flex-col gap-3">
              <button onClick={() => window.print()} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-black transition-all">
                <Printer size={20} /> Print Thermal Receipt
              </button>
              <button onClick={onClose} className="w-full py-5 text-slate-400 font-black hover:text-indigo-600 transition">
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
