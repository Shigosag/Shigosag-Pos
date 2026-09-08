import { create } from "zustand";

interface CartItem {
  id: string; // Changed from number to string to match cuid
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  
  addToCart: (product) => set((state) => {
    const existing = state.items.find((i) => i.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) return state; // Stock Guard
      return {
        items: state.items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return { items: [...state.items, { ...product, quantity: 1 }] };
  }),

  removeFromCart: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),

  updateQuantity: (id, delta) => set((state) => ({
    items: state.items.map((i) => {
      if (i.id !== id) return i;
      const newQty = Math.max(1, i.quantity + delta);
      return newQty <= i.stock ? { ...i, quantity: newQty } : i;
    })
  })),

  clearCart: () => set({ items: [] }),

  getCartTotal: () => {
    return get().items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  }
}));
