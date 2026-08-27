import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/supabase';

export default function CartPage() {
  const { items, loading, subtotal, updateQuantity, removeItem } = useCart();
  const { session } = useAuth();
  const navigate = useNavigate();

  if (!session) {
    return (
      <div className="pt-32 pb-20 px-5 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-16 h-16 text-silver-dim mx-auto mb-6" strokeWidth={1} />
          <h1 className="font-display text-3xl font-light text-white">Sign in to view your <span className="gold-text italic">bag</span></h1>
          <p className="mt-4 text-sm text-silver/50 font-light">Your shopping cart is tied to your account.</p>
          <Link to="/login" className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-medium text-sm hover:bg-gold transition-colors">
            Sign In <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="pt-32 pb-20 px-5 min-h-screen"><div className="max-w-5xl mx-auto animate-pulse space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 rounded-2xl glass" />)}</div></div>;
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 px-5 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-16 h-16 text-silver-dim mx-auto mb-6" strokeWidth={1} />
          <h1 className="font-display text-3xl font-light text-white">Your bag is <span className="gold-text italic">empty</span></h1>
          <p className="mt-4 text-sm text-silver/50 font-light">Discover our curated collection of black luxury.</p>
          <Link to="/collections" className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-medium text-sm hover:bg-gold transition-colors">
            Explore Collection <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    );
  }

  const shipping = subtotal >= 200 ? 0 : 25;
  const total = subtotal + shipping;

  return (
    <div className="pt-32 pb-20 px-5 sm:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="font-mono text-[11px] tracking-[0.4em] text-gold/70 uppercase">Shopping Bag</span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-light text-white">Your <span className="gold-text italic">Bag</span></h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => {
              const product = item.product as Product | undefined;
              if (!product) return null;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-4 flex gap-4"
                >
                  <Link to={`/product/${product.slug}`} className="flex-shrink-0">
                    <div className="w-24 h-32 rounded-xl overflow-hidden bg-onyx-coal">
                      <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${product.slug}`}>
                        <h3 className="font-display text-lg text-white hover:text-gold transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-xs text-silver-dim font-mono mt-1">{product.sku}</p>
                      <p className="text-sm text-gold mt-2">{formatPrice(product.price)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 glass rounded-full px-3 py-1.5">
                        <button onClick={() => updateQuantity(product.id, item.quantity - 1)} className="text-silver hover:text-gold transition-colors">
                          <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                        <span className="w-6 text-center text-sm text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(product.id, item.quantity + 1)} className="text-silver hover:text-gold transition-colors">
                          <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(product.id)} className="text-silver-dim hover:text-red-400 transition-colors" aria-label="Remove">
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-28">
              <h2 className="font-display text-xl text-white mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-silver/70">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-silver/70">
                  <span>Shipping</span>
                  <span className="text-white">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-silver-dim">Add {formatPrice(200 - subtotal)} more for free shipping</p>
                )}
                <div className="pt-3 border-t border-white/10 flex justify-between">
                  <span className="text-white font-medium">Total</span>
                  <span className="font-display text-2xl text-gold">{formatPrice(total)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="mt-6 w-full py-3.5 rounded-full bg-white text-black font-medium text-sm hover:bg-gold transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <Link to="/collections" className="mt-3 block text-center text-xs text-silver/50 hover:text-gold transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
