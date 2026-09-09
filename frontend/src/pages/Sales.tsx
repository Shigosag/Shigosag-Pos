import React, { useState, useMemo } from "react";
import { Search, ShoppingCart, Trash2, CreditCard, PackageOpen, AlertCircle } from "lucide-react";
import { useCart } from "../store/cartStore";
import { useProducts } from "../hooks/useProducts";
import { formatCurrency } from "../utils/format";
import CheckoutModal from "./CheckoutModal";

export default function Sales() {
  const { items = [], addToCart, removeFromCart, updateQuantity } = useCart();
  const { products = [], isLoading } = useProducts();
  const [showCheckout, setShowCheckout] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const list = new Set<string>(["All"]);
    if (Array.isArray(products)) {
      products.forEach((p: any) => {
        if (p?.category) list.add(p.category);
      });
    }
    return Array.from(list);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter((p: any) => {
      const matchSearch = p?.name?.toLowerCase().includes(search.toLowerCase()) || 
                          p?.barcode?.includes(search);
      const matchCat = selectedCategory === "All" || p?.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, search, selectedCategory]);

  const total = useMemo(() => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((acc, item) => {
      const price = Number(item?.price) || 0;
      const qty = Number(item?.quantity) || 0;
      return acc + (price * qty);
    }, 0);
  }, [items]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
      {/* Product Catalog */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              className="w-full pl-11 pr-4 py-3.5 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium text-sm" 
              placeholder="Search items by name, SKU or barcode..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto pr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
              <PackageOpen size={56} className="animate-bounce text-indigo-600" />
              <p className="font-black mt-4 uppercase tracking-widest text-xs">Syncing Inventory...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
               <AlertCircle size={44} />
               <p className="font-bold mt-2 text-sm">No items found matching criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((p: any) => {
                const isOutOfStock = !p.stock || p.stock <= 0;
                return (
                  <button 
                    key={p.id} 
                    onClick={() => addToCart(p)} 
                    disabled={isOutOfStock}
                    className={`bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:border-indigo-600 transition-all text-left group flex flex-col justify-between ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{p.category || "General"}</span>
                        <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-lg ${p.stock < 10 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
                          {isOutOfStock ? "Out of Stock" : `Stock: ${p.stock}`}
                        </span>
                      </div>
                      <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {p.name}
                      </p>
                    </div>
                    
                    <p className="text-xl font-black text-indigo-600 mt-4">
                      {formatCurrency(Number(p.price || 0))}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cart Drawer */}
      <div className="w-full lg:w-[380px] bg-slate-900 rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-white/5">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-white text-lg font-black flex items-center gap-2">
            <ShoppingCart className="text-indigo-400" size={20} /> Terminal Basket
          </h2>
          <span className="bg-indigo-500 text-white text-xs font-black px-3 py-1 rounded-full">
            {items.reduce((s, i) => s + i.quantity, 0)} UNITS
          </span>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 opacity-30 text-white flex flex-col items-center gap-3">
               <PackageOpen size={40} />
               <p className="font-bold text-xs uppercase tracking-widest">Cart is empty</p>
            </div>
          ) : (
            items.map((item: any) => (
              <div key={item.id} className="bg-white/5 p-3.5 rounded-2xl flex justify-between items-center text-white border border-white/5">
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-indigo-400 font-bold">{formatCurrency(Number(item.price))}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white/10 rounded-xl px-2 py-1 gap-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="text-xs font-bold hover:text-indigo-300">-</button>
                    <span className="font-black text-xs">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="text-xs font-bold hover:text-indigo-300">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl transition">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-black/40 backdrop-blur-md space-y-4 border-t border-white/10">
          <div className="flex justify-between items-end">
             <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Subtotal</p>
                <p className="text-3xl font-black text-white">{formatCurrency(total)}</p>
             </div>
          </div>
          <button 
            disabled={items.length === 0}
            onClick={() => setShowCheckout(true)}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition shadow-lg shadow-indigo-900/50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            <CreditCard size={18} /> Finalize Checkout
          </button>
        </div>
      </div>

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </div>
  );
}
