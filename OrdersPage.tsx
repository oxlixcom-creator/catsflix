import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Order, OrderItem } from '@/lib/supabase';

export default function OrdersPage() {
  const { session } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }
    supabase.from('orders').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).then(async ({ data }) => {
      if (data) {
        const orderList = data as Order[];
        setOrders(orderList);
        const itemsMap: Record<string, OrderItem[]> = {};
        for (const order of orderList) {
          const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);
          if (items) itemsMap[order.id] = items as OrderItem[];
        }
        setOrderItems(itemsMap);
      }
      setLoading(false);
    });
  }, [session]);

  if (!session) {
    return (
      <div className="pt-32 pb-20 px-5 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-silver-dim mx-auto mb-6" strokeWidth={1} />
          <h1 className="font-display text-3xl font-light text-white">Sign in to view your <span className="gold-text italic">orders</span></h1>
          <Link to="/login" className="mt-6 inline-block text-gold hover:underline">Sign in</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="pt-32 pb-20 px-5 min-h-screen"><div className="max-w-4xl mx-auto space-y-4 animate-pulse">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 rounded-2xl glass" />)}</div></div>;
  }

  const statusColors: Record<string, string> = {
    pending: 'text-yellow-400/80 border-yellow-400/30',
    paid: 'text-blue-400/80 border-blue-400/30',
    shipped: 'text-purple-400/80 border-purple-400/30',
    delivered: 'text-green-400/80 border-green-400/30',
    cancelled: 'text-red-400/80 border-red-400/30',
    refunded: 'text-silver-dim border-silver-dim/30',
  };

  return (
    <div className="pt-32 pb-20 px-5 sm:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="font-mono text-[11px] tracking-[0.4em] text-gold/70 uppercase">Order History</span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-light text-white">Your <span className="gold-text italic">Orders</span></h1>
        </motion.div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-silver-dim mx-auto mb-6" strokeWidth={1} />
            <p className="text-silver/50 font-light">You haven't placed any orders yet.</p>
            <Link to="/collections" className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-medium text-sm hover:bg-gold transition-colors">
              Start Shopping <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="font-mono text-xs text-silver-dim">{order.order_number}</p>
                    <p className="text-sm text-silver/60 mt-1">{formatDate(order.created_at)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full border text-xs font-mono uppercase tracking-wide ${statusColors[order.status] ?? 'text-silver-dim border-white/10'}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-3">
                  {(orderItems[order.id] ?? []).map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      {item.product_image && (
                        <div className="w-14 h-18 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-white">{item.product_name}</p>
                        <p className="text-xs text-silver-dim">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <span className="text-sm text-white">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm text-silver/60">Total</span>
                  <span className="font-display text-xl text-gold">{formatPrice(order.total)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
