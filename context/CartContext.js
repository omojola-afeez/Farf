import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { cartLineKey } from '@/lib/format';

const STORAGE_KEY = 'farf-cart-v1';
const CartContext = createContext(null);

function readStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setReady(true);
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // Storage can be blocked (private mode). The cart still works for this visit.
    }
  }, [items, ready]);

  const addItem = useCallback(({ product, variants = {}, quantity = 1 }) => {
    const key = cartLineKey(product._id, variants);
    const max = product.stockCount != null ? product.stockCount : 99;
    setItems((current) => {
      const existing = current.find((i) => i.key === key);
      if (existing) {
        return current.map((i) =>
          i.key === key ? { ...i, quantity: Math.min(max, i.quantity + quantity) } : i
        );
      }
      return [
        ...current,
        {
          key,
          productId: product._id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          category: product.category,
          imageUrl: product.images?.[0]?.url || null,
          variants,
          maxQuantity: max,
          quantity: Math.min(max, quantity),
        },
      ];
    });
  }, []);

  const setQuantity = useCallback((key, quantity) => {
    setItems((current) =>
      current
        .map((i) => (i.key === key ? { ...i, quantity: Math.min(i.maxQuantity || 99, quantity) } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((key) => {
    setItems((current) => current.filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return { items, ready, count, subtotal, addItem, setQuantity, removeItem, clear };
  }, [items, ready, addItem, setQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
