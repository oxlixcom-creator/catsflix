import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 pt-32 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-3xl tracking-[0.2em] text-white">ONYX</Link>
          <h1 className="mt-6 font-display text-3xl font-light text-white">Welcome <span className="gold-text italic">back</span></h1>
          <p className="mt-3 text-sm text-silver/50 font-light">Sign in to continue your journey in black</p>
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

          <div>
            <label className="block text-xs font-mono tracking-wide text-silver/60 uppercase mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-dim" strokeWidth={1.5} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-silver-dim hover:text-gold transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400/80 font-light">
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-white text-black font-medium text-sm hover:bg-gold transition-colors duration-300 disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" strokeWidth={1.5} />}
          </button>

          <div className="flex items-center justify-between text-xs">
            <Link to="/forgot-password" className="text-silver/50 hover:text-gold transition-colors">Forgot password?</Link>
            <Link to="/signup" className="text-silver/50 hover:text-gold transition-colors">Create account</Link>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-silver-dim font-light">
          By signing in you agree to our{' '}
          <Link to="/terms" className="text-gold/70 hover:text-gold">Terms</Link> &{' '}
          <Link to="/privacy-policy" className="text-gold/70 hover:text-gold">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  );
}
