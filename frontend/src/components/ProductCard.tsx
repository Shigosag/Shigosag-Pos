import { useCart } from "../store/cartStore";

interface Props {
  product: {
    id: number;
    name: string;
    price: number;
    stock: number;
  };
}

export default function ProductCard({ product }: Props) {
  const add = useCart((s: any) => s.add);
  return (
    <div className="bg-white shadow p-4 rounded hover:scale-105 transition">
      <h2 className="font-bold">{product.name}</h2>
      <p className="text-red-600 font-semibold">
        ${product.price}
      </p>

      <p>
        Stock: {product.stock}
      </p>
      <button
        onClick={() => add(product)}
        className="bg-red-600 text-white px-3 py-1 rounded mt-2"
      >
        Add to Cart
      </button>
    </div>
  );
}