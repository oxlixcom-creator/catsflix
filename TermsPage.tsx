import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="pt-32 pb-20 px-5 sm:px-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="font-mono text-[11px] tracking-[0.4em] text-gold/70 uppercase">Legal</span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-light text-white">Terms & <span className="gold-text italic">Conditions</span></h1>
          <p className="mt-4 text-xs text-silver-dim font-mono">Last updated: January 2026</p>
        </motion.div>

        <div className="glass rounded-2xl p-8 space-y-6 text-silver/60 font-light leading-relaxed text-sm">
          <section>
            <h2 className="font-display text-xl text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using ONYX STORE, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">2. Products and Pricing</h2>
            <p>All products are subject to availability. We reserve the right to modify or discontinue products at any time. Prices are listed in USD and are subject to change without notice. We make every effort to display accurate pricing and product information.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">3. Orders and Payment</h2>
            <p>When you place an order, you authorize us to charge the specified payment method. We reserve the right to refuse or cancel any order. Orders are subject to verification and availability.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">4. Shipping and Delivery</h2>
            <p>We offer free shipping on orders over $200. Delivery times are estimates and may vary. We are not responsible for delays caused by shipping carriers or circumstances beyond our control.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">5. Returns</h2>
            <p>Please review our Return Policy for detailed information on returns and exchanges. Items must be returned in original condition within 30 days of delivery.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">6. Intellectual Property</h2>
            <p>All content on this site, including images, text, and design, is the property of ONYX STORE and protected by copyright laws. You may not reproduce or distribute our content without permission.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">7. Limitation of Liability</h2>
            <p>ONYX STORE shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
