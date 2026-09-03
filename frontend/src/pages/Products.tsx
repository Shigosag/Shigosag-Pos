import React, { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, Package, Edit2, Trash2 } from "lucide-react";
import { api } from "../api/api";
import { formatCurrency } from "../utils/format";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Inventory Management</h1>
          <p className="text-slate-500 text-sm">Track and manage your product stock levels</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Items</p>
          <p className="text-2xl font-black text-slate-800">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Low Stock</p>
          <p className="text-2xl font-black text-amber-600">3</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Inventory Value</p>
          <p className="text-2xl font-black text-indigo-600">₦4.2M</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="Search products by name or barcode..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Package size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-medium">No products found in database.</p>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{p.barcode || 'NO-BARCODE'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">{formatCurrency(p.price)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${p.stock < 5 ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                        <span className="font-bold text-slate-700">{p.stock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Active</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition"><Edit2 size={16} /></button>
                        <button className="p-2 text-slate-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
