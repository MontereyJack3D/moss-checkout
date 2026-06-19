import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CartLine, Product } from '../lib/types';
import { SHIPPING_FLAT } from '../data/mockData';

interface CartValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  add: (product: Product, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const add: CartValue['add'] = (product, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id ? { ...l, qty: l.qty + qty } : l,
        );
      }
      return [...prev, { product, qty }];
    });
  };

  const setQty: CartValue['setQty'] = (productId, qty) => {
    setLines((prev) =>
      prev
        .map((l) => (l.product.id === productId ? { ...l, qty } : l))
        .filter((l) => l.qty > 0),
    );
  };

  const remove: CartValue['remove'] = (productId) =>
    setLines((prev) => prev.filter((l) => l.product.id !== productId));

  const clear = () => setLines([]);

  const value = useMemo<CartValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
    const shipping = lines.length ? SHIPPING_FLAT : 0;
    return { lines, count, subtotal, shipping, total: subtotal + shipping, add, setQty, remove, clear };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
