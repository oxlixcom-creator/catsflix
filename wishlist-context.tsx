import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import type { WishlistItem } from '@/lib/supabase';

type WishlistContextType = {
  items: WishlistItem[];
  loading: boolean;
  count: number;
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (!session?.user?.id) {
      setItems([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*, product:products(*)')
      .eq('user_id', session.user.id);
    if (!error && data) {
      setItems(data as unknown as WishlistItem[]);
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = (productId: string) => items.some((i) => i.product_id === productId);

  const toggle = async (productId: string) => {
    if (!session?.user?.id) return;
    const existing = items.find((i) => i.product_id === productId);
    if (existing) {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', session.user.id)
        .eq('product_id', productId);
      if (!error) fetchWishlist();
    } else {
      const { error } = await supabase
        .from('wishlist_items')
        .insert({ user_id: session.user.id, product_id: productId });
      if (!error) fetchWishlist();
    }
  };

  return (
    <WishlistContext.Provider value={{ items, loading, count: items.length, isWishlisted, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
