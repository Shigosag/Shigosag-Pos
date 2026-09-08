import React, { useState, useMemo } from "react";
import { Search, ShoppingCart, Trash2, CreditCard, PackageOpen, AlertCircle } from "lucide-react";
import { useCart } from "../store/cartStore";
import { useProducts } from "../hooks/useProducts";
import { formatCurrency } from "../utils/format";
import CheckoutModal from "./CheckoutModal";

export default function Sales() {
  const { items = [], addToCart, removeFromCart } = useCart();
  const { products = [], isLoading } = useProducts();
  const [showCheckout, setShowCheckout] = useState(false);
  const [search, setSearch] = useState("");
  
  // High-Performance Filtering logic preserved
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter((p: any) => 
      p?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p?.barcode?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  // Grand Total Calculation logic preserved
  const total = useMemo(() => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((acc, item) => {
      const price = Number(item?.price) || 0;
      const qty = Number(item?.quantity) || 0;
      return acc + (price * qty);
    }, 0);
  }, [items]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-in fade-in duration-500">
      {/* 1. Inventory Catalog */}
      <div className="flex-1 space-y-6 overflow-auto pr-2 custom-scrollbar">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input 
            className="w-full pl-16 pr-6 py-5 bg-white border-none rounded-[2rem] shadow-sm focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-800" 
            placeholder="Search terminal inventory..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20">
            <PackageOpen size={80} className="animate-bounce text-indigo-600" />
            <p className="font-black mt-4 uppercase tracking-[0.3em] text-xs">Synchronizing SKU Catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-300">
             <AlertCircle size={64} strokeWidth={1} />
             <p className="font-black mt-4 uppercase text-xs tracking-widest text-slate-400">Item not found in node</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredProducts.map((p: any) => (
              <button 
                key={p.id} 
                onClick={() => addToCart(p)} 
                disabled={!p.stock || p.stock <= 0}
                className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-600 hover:shadow-2xl transition-all text-left group relative active:scale-95 ${(!p.stock || p.stock <= 0) ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
              >
                <div className="mb-4 flex justify-between items-start">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-50 transition-colors">📦</div>
                  <span className={`text-[9px] uppercase font-black px-3 py-1.5 rounded-xl ${(p.stock || 0) < 10 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    Stock: {p.stock || 0}
                  </span>
                </div>
                <h4 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  {p.name}
                </h4>
                <p className="text-2xl font-black text-indigo-600 mt-1">
                  {formatCurrency(Number(p.price || 0))}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Terminal Cart Sidebar */}
      <div className="w-full lg:w-[440px] bg-slate-900 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-white/5 relative">
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-900/50">
               <ShoppingCart size={22} />
            </div>
            <div>
              <h2 className="text-white text-lg font-black tracking-tight">Active Cart</h2>
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{items.length} SKUs Identified</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 space-y-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="text-center py-24 opacity-10 text-white flex flex-col items-center gap-6">
               <ShoppingCart size={80} strokeWidth={1} />
               <p className="font-black text-[10px] uppercase tracking-[0.4em]">Node is empty</p>
            </div>
          ) : (
            items.map((item: any) => (
              <div key={item.id} className="bg-white/5 p-5 rounded-[2rem] flex justify-between items-center text-white border border-white/5 hover:bg-white/10 transition-all animate-in slide-in-from-right-4">
                <div className="max-w-[200px]">
                  <p className="font-black text-sm truncate">{item.name}</p>
                  <p className="text-[10px] text-indigo-400 font-black mt-1">{formatCurrency(Number(item.price))}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-600/20 text-indigo-400 w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs">
                    x{item.quantity}
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="w-10 h-10 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 3. Transaction Summary */}
        <div className="p-10 bg-black/40 backdrop-blur-3xl space-y-8 border-t border-white/10">
          <div className="flex justify-between items-end">
             <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Checkout Value</p>
                <p className="text-5xl font-black text-white tracking-tighter leading-none">{formatCurrency(total)}</p>
             </div>
          </div>
          <button 
            disabled={items.length === 0}
            onClick={() => setShowCheckout(true)}
            className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-900/50 disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-3 active:scale-95"
          >
            <CreditCard size={22} /> INITIATE CHECKOUT
          </button>
        </div>
      </div>

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </div>
  );
}
