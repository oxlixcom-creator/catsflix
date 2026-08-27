import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import About from '@/components/About';

const values = [
  { title: 'Crafted, not made', text: 'Every piece is selected by hand, obsessing over material, form, and finish.' },
  { title: 'Limited by design', text: 'We release in small drops. Rarity is the point, not a side effect.' },
  { title: 'Black, always', text: 'A single devotion to the absence of color — the most complete palette there is.' },
];

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20 px-5 sm:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="font-mono text-[11px] tracking-[0.4em] text-gold/70 uppercase">Our Story</span>
          <h1 className="mt-4 font-display text-4xl sm:text-7xl font-light text-white">
            A devotion to the <span className="gold-text italic">dark.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-silver/60 font-light leading-relaxed">
            ONYX STORE was born from a simple obsession: that black is not the absence of beauty, but its purest expression. We curate only what we would wear, use, and live with ourselves.
          </p>
        </motion.div>

        <About />

        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-8"
            >
              <div className="w-10 h-px bg-gold/40 mb-4" />
              <h3 className="font-display text-xl text-white">{v.title}</h3>
              <p className="mt-2 text-sm text-silver/50 font-light">{v.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link to="/collections" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-black font-medium text-sm hover:bg-gold transition-colors">
            Explore the Collection <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
