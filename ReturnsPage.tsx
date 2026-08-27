import { motion } from 'framer-motion';

export default function ReturnsPage() {
  return (
    <div className="pt-32 pb-20 px-5 sm:px-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="font-mono text-[11px] tracking-[0.4em] text-gold/70 uppercase">Customer Care</span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-light text-white">Return <span className="gold-text italic">Policy</span></h1>
          <p className="mt-4 text-xs text-silver-dim font-mono">Last updated: January 2026</p>
        </motion.div>

        <div className="glass rounded-2xl p-8 space-y-6 text-silver/60 font-light leading-relaxed text-sm">
          <section>
            <h2 className="font-display text-xl text-white mb-3">30-Day Return Window</h2>
            <p>We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original condition with all tags attached. Returns received outside this window will not be accepted.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">How to Initiate a Return</h2>
            <p>To start a return, contact our concierge team at concierge@onyxstore.com with your order number and the reason for return. We will provide a return authorization and shipping instructions within 24 hours.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">Refund Processing</h2>
            <p>Once we receive and inspect your returned item, a refund will be issued to your original payment method within 5-7 business days. You will receive an email confirmation when the refund has been processed.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">Exchanges</h2>
            <p>To exchange an item for a different size or color, please return the original item and place a new order. This ensures the fastest possible processing of your exchange.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">Non-Returnable Items</h2>
            <p>The following items cannot be returned: opened fragrances, personalized items, and final sale merchandise. These exceptions will be clearly marked on the product page.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">Damaged or Defective Items</h2>
            <p>If you receive a damaged or defective item, contact us within 7 days of delivery. We will arrange a replacement or full refund at no cost to you, including return shipping.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">Shipping Costs</h2>
            <p>Return shipping is the responsibility of the customer unless the item was damaged, defective, or incorrectly shipped. We recommend using a trackable shipping method for your return.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
