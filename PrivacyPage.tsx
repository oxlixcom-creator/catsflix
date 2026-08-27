import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-20 px-5 sm:px-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="font-mono text-[11px] tracking-[0.4em] text-gold/70 uppercase">Legal</span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-light text-white">Privacy <span className="gold-text italic">Policy</span></h1>
          <p className="mt-4 text-xs text-silver-dim font-mono">Last updated: January 2026</p>
        </motion.div>

        <div className="glass rounded-2xl p-8 space-y-6 text-silver/60 font-light leading-relaxed text-sm">
          <section>
            <h2 className="font-display text-xl text-white mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you create an account, make a purchase, or contact our concierge team. This includes your name, email address, phone number, shipping address, and payment information.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">2. How We Use Your Information</h2>
            <p>We use your information to process orders, communicate with you about your purchases, provide customer support, and send you updates about new collections and exclusive offers (only if you have opted in).</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">3. Data Security</h2>
            <p>We employ industry-standard encryption and security measures to protect your personal information. Payment data is processed through secure, PCI-compliant payment gateways and is never stored on our servers.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">4. Cookies</h2>
            <p>We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookies through your browser settings.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. You may also unsubscribe from marketing communications at any time. To exercise these rights, contact us at concierge@onyxstore.com.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-white mb-3">6. Third-Party Services</h2>
            <p>We use trusted third-party services for payments (Stripe), authentication (Supabase), and analytics. These providers have their own privacy policies governing the use of your information.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
