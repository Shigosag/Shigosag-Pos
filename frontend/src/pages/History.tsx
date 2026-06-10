import React from "react";

export default function History() {
  const transactions = [
    { type: "Payment Received", from: "Segun Arulogun Gabriel", bank: "PayPal", amount: 5000, positive: true },
    { type: "Payment Sent", to: "Shigosag", bank: "Stripe", amount: 1200, positive: false },
    { type: "Airtime Purchase", on: "070××××××", bank: "MTN", amount: 10, positive: false },
    { type: "Data Purchase", on: "070××××××", bank: "Glo", amount: 5, positive: false },
    { type: "Payment Received", from: "Shigosag", bank: "PayPal", amount: 3500, positive: true },
    { type: "Payment Sent", to: "Segun Arulogun", bank: "Stripe", amount: 900, positive: false },
  ];

  const availableBalance = 25783.50;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🚀 Shigosag POS - Transaction History</h1>
        <p className="text-gray-500 mt-2">All your recent transactions, airtime & data purchases</p>
      </div>

      {/* Available Balance */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow p-5 mb-6">
        <p className="text-sm opacity-90">Available Balance</p>
        <h2 className="text-3xl font-bold">${availableBalance.toLocaleString()}</h2>
        <p className="text-sm mt-1">Last updated: Just now</p>
      </div>

      {/* Transactions */}
      <div className="space-y-4">
        {transactions.map((tx, i) => (
          <div
            key={i}
            className={`flex justify-between items-center p-4 rounded-xl shadow ${
              tx.positive ? "bg-white hover:shadow-lg transition transform hover:scale-105" 
                          : "bg-red-50 hover:bg-red-100 transition transform hover:scale-105"
            }`}
          >
            <div>
              <p className="font-semibold">{tx.type}</p>
              {tx.from && <p className="text-sm text-gray-500">From: {tx.from}</p>}
              {tx.to && <p className="text-sm text-gray-500">To: {tx.to}</p>}
              {tx.on && <p className="text-sm text-gray-500">On: {tx.on}</p>}
              <p className="text-sm text-gray-400">Bank: {tx.bank}</p>
            </div>
            <div className={`font-bold text-lg ${tx.positive ? "text-green-600" : "text-red-600"}`}>
              {tx.positive ? "+" : "-"}${tx.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}