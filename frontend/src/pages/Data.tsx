import React, { useState } from "react";
import { Signal, Loader2, CheckCircle, Smartphone } from "lucide-react";

export default function Data() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const plans = [
    { id: 1, size: "1.5GB", price: 1000, validity: "30 Days" },
    { id: 2, size: "3.5GB", price: 2000, validity: "30 Days" },
    { id: 3, size: "10GB", price: 5000, validity: "30 Days" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 2000);
  };

  if (success) return (
    <div className="max-w-md mx-auto py-20 text-center space-y-4 animate-in zoom-in">
      <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle size={40}/>
      </div>
      <h2 className="text-2xl font-black text-slate-900">Data Top-up Successful</h2>
      <p className="text-slate-500 font-medium">Bundle has been provisioned to the recipient.</p>
      <button onClick={() => setSuccess(false)} className="text-indigo-600 font-bold hover:underline">Purchase Another</button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
          <Signal size={24} />
        </div>
        <h2 className="text-xl font-black text-slate-900">Buy Data Bundle</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recipient Number</label>
          <input required type="tel" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold" placeholder="080XXXXXXXX" />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Bundle Plan</label>
          <div className="space-y-2 mt-2">
            {plans.map((plan) => (
              <label key={plan.id} className="flex items-center justify-between p-4 border-2 border-slate-50 rounded-2xl cursor-pointer hover:border-indigo-100 transition-colors has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50/30">
                <div className="flex items-center gap-3">
                   <input required type="radio" name="plan" className="w-4 h-4 accent-indigo-600" />
                   <div>
                      <p className="font-black text-slate-900">{plan.size}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{plan.validity}</p>
                   </div>
                </div>
                <p className="font-black text-indigo-600">₦{plan.price.toLocaleString()}</p>
              </label>
            ))}
          </div>
        </div>

        <button disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
          {loading ? <Loader2 className="animate-spin" /> : "Purchase Data"}
        </button>
      </form>
    </div>
  );
}
