import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Heart, Settings, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { supabase } from '@/lib/supabase';
import { formatDate, formatPrice } from '@/lib/utils';
import type { Order } from '@/lib/supabase';

export default function ProfilePage() {
  const { session, profile, signOut } = useAuth();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!session?.user?.id) {
      navigate('/login');
      return;
    }
    supabase.from('orders').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(3).then(({ data }) => {
      if (data) {
        setRecentOrders(data as Order[]);
        setOrderCount(data.length);
      }
    });
  }, [session, navigate]);

  if (!session || !profile) {
    return <div className="pt-32 min-h-screen" />;
  }

  const stats = [
    { icon: ShoppingBag, label: 'Cart Items', value: cartCount, link: '/cart' },
    { icon: Heart, label: 'Wishlist', value: wishlistCount, link: '/wishlist' },
    { icon: Package, label: 'Orders', value: orderCount, link: '/orders' },
  ];

  return (
    <div className="pt-32 pb-20 px-5 sm:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="font-mono text-[11px] tracking-[0.4em] text-gold/70 uppercase">My Account</span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-light text-white">Profile</h1>
        </motion.div>

        {/* Profile header */}
        <div className="glass rounded-3xl p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full glass-gold flex items-center justify-center">
              <User className="w-10 h-10 text-gold" strokeWidth={1.5} />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="font-display text-2xl text-white">{profile.full_name || 'ONYX Member'}</h2>
              <p className="text-sm text-silver/60 mt-1">{profile.email}</p>
              {profile.phone && <p className="text-sm text-silver-dim mt-1">{profile.phone}</p>}
              <span className="inline-block mt-3 px-3 py-1 rounded-full glass-gold text-xs font-mono text-gold uppercase tracking-wide">
                {profile.role}
              </span>
            </div>
            <div className="flex gap-3">
              <Link to="/settings" className="px-5 py-2.5 rounded-full glass text-sm text-silver hover:text-gold transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" strokeWidth={1.5} /> Settings
              </Link>
              <button onClick={() => signOut().then(() => navigate('/'))} className="px-5 py-2.5 rounded-full glass text-sm text-silver hover:text-red-400 transition-colors flex items-center gap-2">
                <LogOut className="w-4 h-4" strokeWidth={1.5} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} to={stat.link}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-5 text-center hover:glass-gold transition-all"
                >
                  <Icon className="w-6 h-6 text-gold mx-auto mb-2" strokeWidth={1.5} />
                  <p className="font-display text-2xl text-white">{stat.value}</p>
                  <p className="text-xs text-silver-dim font-mono uppercase tracking-wide mt-1">{stat.label}</p>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Recent orders */}
        {recentOrders.length > 0 && (
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl text-white">Recent Orders</h2>
              <Link to="/orders" className="text-xs text-gold/70 hover:text-gold">View all</Link>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-black/20">
                  <div>
                    <p className="font-mono text-xs text-silver-dim">{order.order_number}</p>
                    <p className="text-sm text-silver/60 mt-1">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono uppercase text-gold/70 border border-gold/20">{order.status}</span>
                    <p className="text-sm text-white mt-1">{formatPrice(order.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
