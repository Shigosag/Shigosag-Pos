import React, { useState } from "react";

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>(120); // default demo amount

  const handlePay = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-6 relative">
        
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* TITLE */}
        <h2 className="text-xl font-bold mb-4">💳 Secure Checkout</h2>

        {/* FORM STEP */}
        {step === "form" && (
          <>
            <div className="space-y-3">

              {/* AMOUNT INPUT (NEW) */}
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter amount"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />

              <input
                placeholder="Card Number"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />

              <div className="flex gap-3">
                <input
                  placeholder="MM/YY"
                  className="w-1/2 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <input
                  placeholder="CVC"
                  className="w-1/2 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <input
                placeholder="Cardholder Name"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            {/* PAY BUTTON */}
            <button
              onClick={handlePay}
              disabled={loading}
              className="mt-5 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
            </button>
          </>
        )}

        {/* SUCCESS STEP */}
        {step === "success" && (
          <div className="text-center py-6 animate-fadeIn">
            
            <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
              <span className="text-green-600 text-4xl">✔</span>
            </div>

            <h3 className="text-xl font-bold mt-4 text-green-600">
              Payment Successful
            </h3>

            <p className="text-gray-500 mt-2">
              Transaction completed successfully
            </p>

            {/* RECEIPT */}
            <div className="mt-4 text-sm bg-gray-50 p-3 rounded-lg text-left">
              <p>🧾 Receipt</p>
              <p>Ref: SHG-{Math.floor(Math.random() * 999999)}</p>
              <p>Amount: ${amount.toFixed(2)}</p>
              <p>Status: Paid</p>
            </div>

            <button
              onClick={onClose}
              className="mt-5 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}