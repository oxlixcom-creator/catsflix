import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  const contacts = [
    { icon: Mail, label: 'Email', value: 'concierge@onyxstore.com' },
    { icon: Phone, label: 'Phone', value: '+1 (888) 669-6692' },
    { icon: MapPin, label: 'Atelier', value: '1 Obsidian Way, New York, NY 10001' },
  ];

  return (
    <div className="pt-32 pb-20 px-5 sm:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="font-mono text-[11px] tracking-[0.4em] text-gold/70 uppercase">Get in Touch</span>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl font-light text-white">
            Contact <span className="gold-text italic">Us</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-silver/60 font-light">
            Our concierge team is available 24/7 to assist with any inquiry, from product details to private orders.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {contacts.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full glass-gold flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.3em] text-silver-dim uppercase">{c.label}</p>
                    <p className="text-sm text-white mt-1">{c.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 space-y-4"
          >
            <input
              type="text"
              required
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40 transition-colors"
            />
            <input
              type="email"
              required
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40 transition-colors"
            />
            <input
              type="text"
              required
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40 transition-colors"
            />
            <textarea
              required
              placeholder="Your Message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40 transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-white text-black font-medium text-sm hover:bg-gold transition-colors flex items-center justify-center gap-2"
            >
              {sent ? <><Check className="w-4 h-4" strokeWidth={1.5} /> Message Sent</> : <>Send Message <Send className="w-4 h-4" strokeWidth={1.5} /></>}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
