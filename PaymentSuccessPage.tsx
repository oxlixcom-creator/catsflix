import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 pt-32 pb-20">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-24 h-24 rounded-full glass-gold flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="w-12 h-12 text-gold" strokeWidth={1.5} />
        </motion.div>
        <span className="font-mono text-[11px] tracking-[0.4em] text-gold/70 uppercase">Order Confirmed</span>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-light text-white">
          Thank you for your <span className="gold-text italic">order</span>
        </h1>
        <p className="mt-5 text-silver/60 font-light leading-relaxed">
          Your order has been placed successfully. You'll receive a confirmation email shortly with your order details and tracking information.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-medium text-sm hover:bg-gold transition-colors">
            <Package className="w-4 h-4" strokeWidth={1.5} /> View Orders
          </Link>
          <Link to="/collections" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full glass-gold text-gold font-medium text-sm hover:bg-gold hover:text-black transition-colors">
            Continue Shopping <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
