import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, CreditCard, MapPin } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import type { Address, Product, Coupon } from '@/lib/supabase';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { session } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    if (session.user.id) {
      supabase.from('addresses').select('*').eq('user_id', session.user.id).order('is_default', { ascending: false }).then(({ data }) => {
        if (data) {
          setAddresses(data as Address[]);
          const def = (data as Address[]).find((a) => a.is_default);
          if (def) setSelectedAddress(def.id);
          else if (data.length > 0) setSelectedAddress((data as Address[])[0].id);
        }
      });
    }
  }, [session, items.length, navigate]);

  const shipping = subtotal >= 200 ? 0 : 25;
  const total = subtotal + shipping - discount;

  const applyCoupon = async () => {
    setCouponError(null);
    if (!couponCode.trim()) return;
    const { data, error } = await supabase.from('coupons').select('*').eq('code', couponCode.toUpperCase()).eq('is_active', true).maybeSingle();
    if (error || !data) {
      setCouponError('Invalid coupon code');
      setDiscount(0);
      return;
    }
    const coupon = data as Coupon;
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      setCouponError('Coupon has expired');
      setDiscount(0);
      return;
    }
    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
      setCouponError('Coupon usage limit reached');
      setDiscount(0);
      return;
    }
    if (subtotal < coupon.min_order_amount) {
      setCouponError(`Minimum order of ${formatPrice(coupon.min_order_amount)} required`);
      setDiscount(0);
      return;
    }
    if (coupon.discount_type === 'percentage') {
      setDiscount((subtotal * coupon.discount_value) / 100);
    } else {
      setDiscount(coupon.discount_value);
    }
  };

  const placeOrder = async () => {
    if (!session || !selectedAddress) return;
    setPlacing(true);
    setOrderError(null);

    const cartPayload = items.map((item) => {
      const product = item.product as Product;
      return { product_id: product.id, quantity: item.quantity };
    });

    const { data, error } = await supabase.rpc('place_order', {
      p_items: cartPayload,
      p_address_id: selectedAddress,
      p_coupon_code: discount > 0 ? couponCode.toUpperCase() : null,
    });

    if (error || !data) {
      console.error('Order placement failed', error);
      setOrderError('Could not place your order. Please try again.');
      setPlacing(false);
      return;
    }

    await clearCart();
    setPlacing(false);
    navigate('/payment-success');
  };

  if (items.length === 0) return <div className="pt-32 min-h-screen" />;

  return (
    <div className="pt-32 pb-20 px-5 sm:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="font-mono text-[11px] tracking-[0.4em] text-gold/70 uppercase">Checkout</span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-light text-white">Complete your <span className="gold-text italic">order</span></h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="glass rounded-2xl p-6">
              <h2 className="flex items-center gap-2 font-display text-xl text-white mb-5">
                <MapPin className="w-5 h-5 text-gold" strokeWidth={1.5} /> Shipping Address
              </h2>
              {addresses.length === 0 ? (
                <div className="text-sm text-silver/50">
                  <p>No addresses saved yet.</p>
                  <Link to="/settings" className="text-gold/70 hover:text-gold mt-2 inline-block">Add an address in Settings</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedAddress === addr.id ? 'border-gold/40 bg-gold/5' : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                          className="mt-1 accent-gold"
                        />
                        <div className="text-sm">
                          <p className="text-white font-medium">{addr.full_name}</p>
                          <p className="text-silver/60">{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}</p>
                          <p className="text-silver/60">{addr.city}, {addr.state} {addr.postal_code}</p>
                          <p className="text-silver/60">{addr.country}</p>
                          {addr.is_default && <span className="inline-block mt-1 text-xs text-gold/70">Default</span>}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="glass rounded-2xl p-6">
              <h2 className="flex items-center gap-2 font-display text-xl text-white mb-5">
                <CreditCard className="w-5 h-5 text-gold" strokeWidth={1.5} /> Payment Method
              </h2>
              <div className="p-4 rounded-xl border border-gold/30 bg-gold/5 flex items-center gap-3">
                <Lock className="w-5 h-5 text-gold" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-white font-medium">Secure Checkout</p>
                  <p className="text-xs text-silver/50">Your payment is encrypted and secure</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-28">
              <h2 className="font-display text-xl text-white mb-5">Order Summary</h2>
              <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                {items.map((item) => {
                  const product = item.product as Product;
                  return (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={product.images?.[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xs">{product.name}</p>
                        <p className="text-silver-dim text-xs">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-white text-xs">{formatPrice(product.price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Coupon */}
              <div className="mb-4 pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40"
                  />
                  <button onClick={applyCoupon} className="px-4 py-2 rounded-lg glass-gold text-gold text-xs font-medium hover:bg-gold hover:text-black transition-colors">
                    Apply
                  </button>
                </div>
                {couponError && <p className="mt-2 text-xs text-red-400/80">{couponError}</p>}
                {discount > 0 && <p className="mt-2 text-xs text-gold/70">Discount applied: -{formatPrice(discount)}</p>}
              </div>

              <div className="space-y-2 text-sm pt-4 border-t border-white/10">
                <div className="flex justify-between text-silver/70"><span>Subtotal</span><span className="text-white">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-silver/70"><span>Shipping</span><span className="text-white">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                {discount > 0 && <div className="flex justify-between text-gold/70"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                <div className="pt-3 border-t border-white/10 flex justify-between">
                  <span className="text-white font-medium">Total</span>
                  <span className="font-display text-2xl text-gold">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing || !selectedAddress}
                className="mt-6 w-full py-3.5 rounded-full bg-white text-black font-medium text-sm hover:bg-gold transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {placing ? 'Placing Order...' : 'Place Order'}
                {!placing && <ArrowRight className="w-4 h-4" strokeWidth={1.5} />}
              </button>
              {orderError && (
                <p className="mt-3 text-center text-xs text-red-400/80">{orderError}</p>
              )}
              <p className="mt-3 text-center text-xs text-silver-dim flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" strokeWidth={1.5} /> Secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
