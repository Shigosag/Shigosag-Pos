import React, { useState } from "react";
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard } from "lucide-react";
import { useCart } from "../store/cartStore";
import { formatCurrency } from "../utils/format";
import CheckoutModal from "./CheckoutModal";

export default function Sales() {
  const { items, addToCart, removeFromCart, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Mock inventory for local selection
  const inventory = [
    { id: 1, name: "POS Terminal Paper", price: 1200, stock: 45 },
    { id: 2, name: "Institutional Stamp", price: 5500, stock: 12 },
    { id: 3, name: "Smart Card Reader", price: 25000, stock: 5 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Product Selection */}
      <div className="flex-1 space-y-6 overflow-auto pr-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Search inventory..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {inventory.map((p) => (
            <button key={p.id} onClick={() => addToCart(p as any)} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:border-indigo-600 transition-all text-left group">
              <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{p.name}</p>
              <p className="text-lg font-black text-slate-400 mt-1">{formatCurrency(p.price)}</p>
              <p className="text-[10px] uppercase font-bold text-slate-300 mt-4">Stock: {p.stock}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Side Panel */}
      <div className="w-full lg:w-[400px] bg-indigo-900 rounded-[32px] shadow-2xl flex flex-col overflow-hidden">
        <div className="p-8 border-b border-indigo-800">
          <h2 className="text-white text-xl font-black flex items-center gap-3">
            <ShoppingCart /> Current Cart
          </h2>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 opacity-30 text-white">Cart is empty</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-indigo-800/50 p-4 rounded-2xl flex justify-between items-center text-white">
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-xs text-indigo-300">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-indigo-700 rounded-lg"><Trash2 size={16}/></button>
                  <span className="font-black">{item.quantity}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-indigo-950/50 space-y-6">
          <div className="flex justify-between items-end">
             <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Total Payable</p>
             <p className="text-3xl font-black text-white">{formatCurrency(total)}</p>
          </div>
          <button 
            disabled={items.length === 0}
            onClick={() => setShowCheckout(true)}
            className="w-full bg-white text-indigo-900 py-5 rounded-2xl font-black text-lg hover:bg-indigo-50 transition shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CreditCard size={20} /> Process Payment
          </button>
        </div>
      </div>
      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </div>
  );
}
