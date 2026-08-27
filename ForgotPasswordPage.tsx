import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full glass-gold flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-gold" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-3xl font-light text-white">Check your <span className="gold-text italic">inbox</span></h1>
          <p className="mt-4 text-sm text-silver/60 font-light">We've sent a password reset link to {email}. Follow the link to reset your password.</p>
          <Link to="/login" className="mt-6 inline-block text-sm text-gold/70 hover:text-gold">Back to sign in</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 pt-32 pb-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-3xl tracking-[0.2em] text-white">ONYX</Link>
          <h1 className="mt-6 font-display text-3xl font-light text-white">Reset <span className="gold-text italic">password</span></h1>
          <p className="mt-3 text-sm text-silver/50 font-light">Enter your email and we'll send you a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-5">
          <div>
            <label className="block text-xs font-mono tracking-wide text-silver/60 uppercase mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-dim" strokeWidth={1.5} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>
          </div>

          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400/80 font-light">{error}</motion.p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-white text-black font-medium text-sm hover:bg-gold transition-colors duration-300 disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
            {!loading && <ArrowRight className="w-4 h-4" strokeWidth={1.5} />}
          </button>

          <p className="text-center text-xs text-silver/50">
            Remembered your password?{' '}
            <Link to="/login" className="text-gold/70 hover:text-gold">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
