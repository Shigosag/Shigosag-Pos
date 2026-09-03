import React, { useState } from "react";
import { User, Plus, Phone, Mail, X } from "lucide-react";

export default function Customers() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([
    { name: "Segun Arulogun", email: "segun@example.com", phone: "+234 810 000 0000", debt: 0 },
  ]);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newUser = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      debt: 0
    };
    setUsers([...users, newUser]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-900">Customers</h1>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition">
          <Plus size={20} /> New Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {users.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
              <User size={24} />
            </div>
            <h3 className="font-black text-slate-900">{c.name}</h3>
            <p className="text-xs text-slate-400 font-medium">{c.phone}</p>
            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase">Balance</span>
              <span className="font-black text-emerald-600">₦{c.debt}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900">Add Customer</h2>
              <button onClick={() => setShowModal(false)}><X className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <input required name="name" placeholder="Full Name" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600" />
              <input required name="phone" placeholder="Phone Number" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600" />
              <input required name="email" type="email" placeholder="Email Address" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600" />
              <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black transition">Save Record</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
