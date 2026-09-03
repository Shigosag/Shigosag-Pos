import React, { useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export default function Toast({ message, type, onClose }: { message: string, type: 'error' | 'success', onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 z-[100] animate-in slide-in-from-right-full">
      <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl border ${
        type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
      }`}>
        {type === 'error' ? <AlertCircle size={20}/> : <CheckCircle2 size={20}/>}
        <p className="font-bold text-sm">{message}</p>
        <button onClick={onClose} className="hover:opacity-50"><X size={16}/></button>
      </div>
    </div>
  );
}
