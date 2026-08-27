import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full glass-gold flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-gold" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-3xl font-light text-white">Welcome to <span className="gold-text italic">ONYX</span></h1>
          <p className="mt-4 text-sm text-silver/60 font-light">Your account has been created. Redirecting to sign in...</p>
        </motion.div>
      </div>
    );
  }

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
          <h1 className="mt-6 font-display text-3xl font-light text-white">Join the <span className="gold-text italic">dark</span></h1>
          <p className="mt-3 text-sm text-silver/50 font-light">Create your account and enter the world of black</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-5">
          <div>
            <label className="block text-xs font-mono tracking-wide text-silver/60 uppercase mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-dim" strokeWidth={1.5} />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>
          </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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
            {loading ? 'Creating account...' : 'Create Account'}
            {!loading && <ArrowRight className="w-4 h-4" strokeWidth={1.5} />}
          </button>

          <p className="text-center text-xs text-silver/50">
            Already have an account?{' '}
            <Link to="/login" className="text-gold/70 hover:text-gold">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
