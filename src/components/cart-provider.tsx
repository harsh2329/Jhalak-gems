"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { GemProduct } from "@/lib/products";

type CartLine = { product: GemProduct; quantity: number };
type CartContextType = {
  items: CartLine[];
  add: (product: GemProduct) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem("jg-cart");
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch { localStorage.removeItem("jg-cart"); }
    }
  }, []);
  useEffect(() => { localStorage.setItem("jg-cart", JSON.stringify(items)); }, [items]);

  const value = useMemo(() => ({
    items,
    add: (product: GemProduct) => setItems(current => {
      if (current.some(x => x.product.id === product.id)) return current;
      return [...current, { product, quantity: 1 }];
    }),
    remove: (id: string) => setItems(current => current.filter(x => x.product.id !== id)),
    clear: () => setItems([]),
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
