import React, { useState, useEffect } from "react";
import { Plus, Search, Package, Edit2, Trash2, X } from "lucide-react";
import { api } from "../api/api";
import { formatCurrency } from "../utils/format";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      category: formData.get("category")
    };
    try {
      await api.post("/products", data);
      setShowModal(false);
      fetchProducts();
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Inventory</h1>
          <p className="text-slate-500 text-sm">Manage stock and pricing</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Product Table - Standardized to Indigo */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
              <tr>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-bold text-slate-800">{p.name}</td>
                  <td className="px-6 py-4 font-black text-indigo-600">{formatCurrency(p.price)}</td>
                  <td className="px-6 py-4 font-medium text-slate-500">{p.stock} units</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600"><Edit2 size={16}/></button>
                    <button className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900">New Product</h2>
              <button onClick={() => setShowModal(false)}><X className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <input required name="name" placeholder="Product Name" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600" />
              <div className="flex gap-4">
                <input required name="price" type="number" placeholder="Price" className="w-1/2 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600" />
                <input required name="stock" type="number" placeholder="Stock" className="w-1/2 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600" />
              </div>
              <select name="category" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-slate-500">
                <option>General</option>
                <option>Hardware</option>
                <option>Consumables</option>
              </select>
              <button disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 transition">
                {loading ? "Saving..." : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
