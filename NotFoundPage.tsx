import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 pt-32 pb-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-md">
        <div className="relative mb-8">
          <h1 className="font-display text-[120px] sm:text-[180px] font-light leading-none gold-text">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gold/5 blur-3xl" />
          </div>
        </div>
        <span className="font-mono text-[11px] tracking-[0.4em] text-gold/70 uppercase">Lost in the Dark</span>
        <h2 className="mt-4 font-display text-3xl font-light text-white">Page Not Found</h2>
        <p className="mt-4 text-sm text-silver/50 font-light">
          The page you're looking for has vanished into the shadows. Let us guide you back.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-medium text-sm hover:bg-gold transition-colors">
            <Home className="w-4 h-4" strokeWidth={1.5} /> Back Home
          </Link>
          <Link to="/collections" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full glass-gold text-gold font-medium text-sm hover:bg-gold hover:text-black transition-colors">
            Browse Collection <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
