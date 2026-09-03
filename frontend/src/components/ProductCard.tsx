import { useCart } from "../store/cartStore";
import { formatCurrency } from "../utils/format";

interface Props {
  product: {
    id: number;
    name: string;
    price: number;
    stock: number;
  };
}

export default function ProductCard({ product }: Props) {
  const add = useCart((s: any) => s.addToCart);
  return (
    <div className="bg-white border border-slate-100 shadow-sm p-5 rounded-[24px] hover:shadow-xl hover:-translate-y-1 transition-all group">
      <div className="w-full h-32 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-200 transition-colors">
        {/* Placeholder for product image icon */}
        <span className="text-4xl font-bold">📦</span>
      </div>
      <h2 className="font-bold text-slate-800">{product.name}</h2>
      <p className="text-indigo-600 font-black text-lg mt-1">
        {formatCurrency(product.price)}
      </p>

      <div className="flex items-center justify-between mt-4">
        <p className="text-xs font-bold text-slate-400">
          Stock: <span className={product.stock < 10 ? 'text-amber-600' : 'text-slate-600'}>{product.stock}</span>
        </p>
        <button
          onClick={() => add(product as any)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
