import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import type { CartItem, Product } from '@/lib/supabase';

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  count: number;
  subtotal: number;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!session?.user?.id) {
      setItems([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', session.user.id);
    if (!error && data) {
      setItems(data as unknown as CartItem[]);
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId: string, quantity = 1) => {
    if (!session?.user?.id) return;
    const existing = items.find((i) => i.product_id === productId);
    if (existing) {
      await updateQuantity(productId, existing.quantity + quantity);
      return;
    }
    const { error } = await supabase
      .from('cart_items')
      .insert({ user_id: session.user.id, product_id: productId, quantity });
    if (!error) fetchCart();
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!session?.user?.id || quantity < 1) return;
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', session.user.id)
      .eq('product_id', productId);
    if (!error) fetchCart();
  };

  const removeItem = async (productId: string) => {
    if (!session?.user?.id) return;
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', session.user.id)
      .eq('product_id', productId);
    if (!error) fetchCart();
  };

  const clearCart = async () => {
    if (!session?.user?.id) return;
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', session.user.id);
    if (!error) setItems([]);
  };

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => {
    const price = (i.product as Product | undefined)?.price ?? 0;
    return sum + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, loading, count, subtotal, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
