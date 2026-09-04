import React, { useState } from "react";
import { Search, ShoppingCart, Trash2, CreditCard, PackageOpen } from "lucide-react";
import { useCart } from "../store/cartStore";
import { useProducts } from "../hooks/useProducts";
import { formatCurrency } from "../utils/format";
import CheckoutModal from "./CheckoutModal";

export default function Sales() {
  const { items, addToCart, removeFromCart } = useCart();
  const { products, isLoading } = useProducts();
  const [showCheckout, setShowCheckout] = useState(false);
  const [search, setSearch] = useState("");
  
  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      <div className="flex-1 space-y-6 overflow-auto pr-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all" 
            placeholder="Search products by name or barcode..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <PackageOpen size={64} className="animate-bounce" />
            <p className="font-bold">Loading Inventory...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProducts.map((p: any) => (
              <button 
                key={p.id} 
                onClick={() => addToCart(p)} 
                disabled={p.stock <= 0}
                className={`bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:border-indigo-600 transition-all text-left group relative ${p.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{p.name}</p>
                <p className="text-lg font-black text-slate-400 mt-1">{formatCurrency(Number(p.price))}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${p.stock < 10 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
                    Stock: {p.stock}
                  </span>
                  {p.stock <= 0 && <span className="text-[10px] text-red-600 font-black">OUT OF STOCK</span>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full lg:w-[400px] bg-slate-900 rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-white/5">
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-white text-xl font-black flex items-center gap-3">
            <ShoppingCart className="text-indigo-400" /> Cart
          </h2>
          <span className="bg-indigo-500 text-white text-[10px] font-black px-2 py-1 rounded-full">{items.length} ITEMS</span>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 opacity-20 text-white flex flex-col items-center gap-4">
               <PackageOpen size={48} />
               <p className="font-bold">Cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-white/5 p-4 rounded-2xl flex justify-between items-center text-white border border-white/5 hover:bg-white/10 transition-colors">
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-xs text-indigo-400 font-bold">{formatCurrency(Number(item.price))}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-lg">x{item.quantity}</span>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"><Trash2 size={16}/></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-black/40 backdrop-blur-md space-y-6 border-t border-white/10">
          <div className="flex justify-between items-end">
             <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Grand Total</p>
                <p className="text-3xl font-black text-white">{formatCurrency(total)}</p>
             </div>
             <div className="text-right">
                <p className="text-slate-500 text-[10px] font-black uppercase">Tax (0%)</p>
                <p className="text-white font-bold">₦0.00</p>
             </div>
          </div>
          <button 
            disabled={items.length === 0}
            onClick={() => setShowCheckout(true)}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-900/50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CreditCard size={20} /> Checkout Terminal
          </button>
        </div>
      </div>
      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </div>
  );
}
