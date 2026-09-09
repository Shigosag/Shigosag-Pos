import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, Loader2 } from "lucide-react";
import { api } from "../api/api";
import { formatCurrency } from "../utils/format";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      const list = res.data?.data?.items || res.data?.data || [];
      setProducts(Array.isArray(list) ? list : []);
    } catch (e) {
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      price: Number(fd.get("price")),
      stock: Number(fd.get("stock")),
      category: fd.get("category"),
      barcode: fd.get("barcode") || undefined
    };

    try {
      if (editItem) {
        await api.put(`/products/${editItem.id}`, payload);
        setToast({ msg: "Product updated", type: "success" });
      } else {
        await api.post("/products", payload);
        setToast({ msg: "Product created", type: "success" });
      }
      setShowModal(false);
      setEditItem(null);
      fetchProducts();
    } catch (err: any) {
      setToast({ msg: err.response?.data?.message || "Operation failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/products/${deleteTarget.id}`);
      setToast({ msg: "Product deleted", type: "success" });
      setDeleteTarget(null);
      fetchProducts();
    } catch (err: any) {
      setToast({ msg: "Failed to delete product", type: "error" });
    }
  };

  const filtered = products.filter((p) => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      {deleteTarget && (
        <ConfirmModal 
          title="Delete Product?"
          message={`Are you sure you want to remove "${deleteTarget.name}" from inventory?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Inventory Management</h1>
          <p className="text-slate-500 text-sm">Full stock levels and pricing control</p>
        </div>
        <button 
          onClick={() => { setEditItem(null); setShowModal(true); }} 
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 self-start sm:self-auto"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium" 
              placeholder="Search by product name or category..." 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
              <tr>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-bold text-sm">
                    No items in inventory.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{p.name}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">{p.category || "General"}</td>
                    <td className="px-6 py-4 font-black text-indigo-600">{formatCurrency(Number(p.price))}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${p.stock < 10 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => { setEditItem(p); setShowModal(true); }} 
                          className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-indigo-50"
                        >
                          <Edit2 size={16}/>
                        </button>
                        <button 
                          onClick={() => setDeleteTarget(p)} 
                          className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900">{editItem ? "Edit Product" : "New Product"}</h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); }}><X className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input required defaultValue={editItem?.name} name="name" placeholder="Product Name" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold" />
              <div className="flex gap-4">
                <input required defaultValue={editItem?.price} name="price" type="number" step="0.01" placeholder="Price" className="w-1/2 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold" />
                <input required defaultValue={editItem?.stock} name="stock" type="number" placeholder="Stock Qty" className="w-1/2 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold" />
              </div>
              <input defaultValue={editItem?.barcode} name="barcode" placeholder="Barcode (Optional)" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold" />
              <select defaultValue={editItem?.category || "General"} name="category" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-slate-600">
                <option value="General">General</option>
                <option value="Hardware">Hardware</option>
                <option value="Consumables">Consumables</option>
                <option value="Groceries">Groceries</option>
                <option value="Electronics">Electronics</option>
              </select>
              <button disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : (editItem ? "Update Product" : "Save to Inventory")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
