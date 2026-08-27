import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist-context';
import { useAuth } from '@/lib/auth-context';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/supabase';

export default function WishlistPage() {
  const { items, loading } = useWishlist();
  const { session } = useAuth();

  if (!session) {
    return (
      <div className="pt-32 pb-20 px-5 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Heart className="w-16 h-16 text-silver-dim mx-auto mb-6" strokeWidth={1} />
          <h1 className="font-display text-3xl font-light text-white">Sign in to view your <span className="gold-text italic">wishlist</span></h1>
          <Link to="/login" className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-medium text-sm hover:bg-gold transition-colors">
            Sign In <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="pt-32 pb-20 px-5 min-h-screen"><div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[3/4] rounded-2xl glass animate-pulse" />)}</div></div>;
  }

  const products = items.map((i) => i.product).filter(Boolean) as Product[];

  return (
    <div className="pt-32 pb-20 px-5 sm:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="font-mono text-[11px] tracking-[0.4em] text-gold/70 uppercase">Saved Items</span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-light text-white">Your <span className="gold-text italic">Wishlist</span></h1>
          {products.length > 0 && <p className="mt-4 text-silver/50 font-light">{products.length} {products.length === 1 ? 'item' : 'items'} saved</p>}
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-silver-dim mx-auto mb-6" strokeWidth={1} />
            <p className="text-silver/50 font-light">Your wishlist is empty.</p>
            <Link to="/collections" className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-medium text-sm hover:bg-gold transition-colors">
              Explore Collection <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
