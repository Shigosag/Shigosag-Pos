import React from "react";

export default function History() {
  const transactions = [
    { type: "Payment Received", from: "Segun Arulogun Gabriel", bank: "Zenith Bank", amount: 50000, positive: true },
    { type: "Payment Sent", to: "Shigosag", bank: "Access Bank", amount: 12000, positive: false },
    { type: "Airtime Purchase", on: "07044XXXXXX", bank: "MTN", amount: 2000, positive: false },
    { type: "Data Purchase", on: "08033XXXXXX", bank: "Glo", amount: 5000, positive: false },
    { type: "Payment Received", from: "Shigosag", bank: "Kuda", amount: 35000, positive: true },
    { type: "Payment Sent", to: "Segun Arulogun", bank: "GTBank", amount: 9000, positive: false },
  ];

  // Updated to 10 Million
  const availableBalance = 10000000;

  // Helper for formatting
  const formatNGN = (amt: number) => 
    amt.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🚀 Shigosag POS - Transaction History</h1>
        <p className="text-gray-500 mt-2">All your recent transactions, airtime & data purchases</p>
      </div>

      {/* Available Balance - Emerald/Green */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl shadow-lg p-6 mb-6">
        <p className="text-sm opacity-90 font-medium uppercase tracking-wider">Available Balance</p>
        <h2 className="text-4xl font-black mt-1">{formatNGN(availableBalance)}</h2>
        <p className="text-xs mt-2 opacity-80">Last updated: Just now</p>
      </div>

      {/* Transactions */}
      <div className="space-y-4">
        {transactions.map((tx, i) => (
          <div
            key={i}
            className={`flex justify-between items-center p-5 rounded-2xl transition transform hover:scale-[1.02] border ${
              tx.positive 
                ? "bg-white border-gray-100 shadow-sm" 
                : "bg-red-50 border-red-100"
            }`}
          >
            <div className="space-y-1">
              <p className="font-bold text-gray-800">{tx.type}</p>
              {tx.from && <p className="text-xs text-gray-500 font-medium">From: {tx.from}</p>}
              {tx.to && <p className="text-xs text-gray-500 font-medium">To: {tx.to}</p>}
              {tx.on && <p className="text-xs text-gray-500 font-medium">Recipient: {tx.on}</p>}
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Bank: {tx.bank}</p>
            </div>
            
            <div className={`font-black text-xl ${tx.positive ? "text-emerald-600" : "text-red-600"}`}>
              {tx.positive ? "+" : "-"}{formatNGN(tx.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
