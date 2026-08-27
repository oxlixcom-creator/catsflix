import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowRight } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 pt-32 pb-20">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-24 h-24 rounded-full glass flex items-center justify-center mx-auto mb-8 border border-red-400/20"
        >
          <XCircle className="w-12 h-12 text-red-400/80" strokeWidth={1.5} />
        </motion.div>
        <span className="font-mono text-[11px] tracking-[0.4em] text-silver-dim uppercase">Payment Cancelled</span>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-light text-white">
          Order was <span className="text-red-400/80 italic">cancelled</span>
        </h1>
        <p className="mt-5 text-silver/60 font-light leading-relaxed">
          Your payment was not completed and your items are still in your cart. No charges have been made.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/cart" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-medium text-sm hover:bg-gold transition-colors">
            Return to Cart
          </Link>
          <Link to="/collections" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full glass-gold text-gold font-medium text-sm hover:bg-gold hover:text-black transition-colors">
            Continue Shopping <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
