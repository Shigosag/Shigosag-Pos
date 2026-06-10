export default function Analytics() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">📊 Analytics</h1>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-green-100">Total Sales</div>
        <div className="p-4 bg-blue-100">Revenue</div>
        <div className="p-4 bg-yellow-100">Transactions</div>
      </div>
    </div>
  );
}