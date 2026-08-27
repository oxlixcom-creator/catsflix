import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Plus, Trash2, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import type { Address } from '@/lib/supabase';

export default function SettingsPage() {
  const { session, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: 'United States' });

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }
    if (profile) {
      setFullName(profile.full_name ?? '');
      setPhone(profile.phone ?? '');
    }
    if (session.user?.id) {
      supabase.from('addresses').select('*').eq('user_id', session.user.id).order('is_default', { ascending: false }).then(({ data }) => {
        if (data) setAddresses(data as Address[]);
      });
    }
  }, [session, profile, navigate]);

  const saveProfile = async () => {
    if (!session?.user?.id) return;
    setSaving(true);
    await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', session.user.id);
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addAddress = async () => {
    if (!session?.user?.id) return;
    const { data } = await supabase.from('addresses').insert({ ...addrForm, user_id: session.user.id }).select().single();
    if (data) {
      setAddresses([...addresses, data as Address]);
      setAddrForm({ full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: 'United States' });
      setShowAddrForm(false);
    }
  };

  const deleteAddress = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  if (!session) return <div className="pt-32 min-h-screen" />;

  return (
    <div className="pt-32 pb-20 px-5 sm:px-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="font-mono text-[11px] tracking-[0.4em] text-gold/70 uppercase">Account</span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-light text-white">Settings</h1>
        </motion.div>

        {/* Profile info */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="font-display text-xl text-white mb-5">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono tracking-wide text-silver/60 uppercase mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-dim" strokeWidth={1.5} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-gold/40 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono tracking-wide text-silver/60 uppercase mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-dim" strokeWidth={1.5} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-gold/40 transition-colors"
                />
              </div>
            </div>
            <button
              onClick={saveProfile}
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-white text-black font-medium text-sm hover:bg-gold transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              {saved ? <><Check className="w-4 h-4" strokeWidth={1.5} /> Saved</> : saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Addresses */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl text-white">Saved Addresses</h2>
            <button onClick={() => setShowAddrForm(!showAddrForm)} className="px-4 py-2 rounded-full glass-gold text-gold text-xs font-medium hover:bg-gold hover:text-black transition-colors flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Add New
            </button>
          </div>

          {showAddrForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4 p-4 rounded-xl bg-black/30 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Full Name" value={addrForm.full_name} onChange={(e) => setAddrForm({ ...addrForm, full_name: e.target.value })} className="px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-sm text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40" />
                <input placeholder="Phone" value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} className="px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-sm text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40" />
              </div>
              <input placeholder="Address Line 1" value={addrForm.address_line1} onChange={(e) => setAddrForm({ ...addrForm, address_line1: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-sm text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40" />
              <input placeholder="Address Line 2 (optional)" value={addrForm.address_line2} onChange={(e) => setAddrForm({ ...addrForm, address_line2: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-sm text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40" />
              <div className="grid grid-cols-3 gap-3">
                <input placeholder="City" value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} className="px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-sm text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40" />
                <input placeholder="State" value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} className="px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-sm text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40" />
                <input placeholder="ZIP" value={addrForm.postal_code} onChange={(e) => setAddrForm({ ...addrForm, postal_code: e.target.value })} className="px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-sm text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40" />
              </div>
              <button onClick={addAddress} className="px-5 py-2 rounded-full bg-gold text-black font-medium text-sm hover:bg-gold-light transition-colors">Save Address</button>
            </motion.div>
          )}

          {addresses.length === 0 ? (
            <p className="text-sm text-silver/50 font-light flex items-center gap-2 py-4">
              <MapPin className="w-4 h-4 text-silver-dim" strokeWidth={1.5} /> No saved addresses yet.
            </p>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-4 rounded-xl bg-black/20 flex items-start justify-between">
                  <div className="text-sm">
                    <p className="text-white font-medium">{addr.full_name}</p>
                    <p className="text-silver/60 mt-1">{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}</p>
                    <p className="text-silver/60">{addr.city}, {addr.state} {addr.postal_code}</p>
                    <p className="text-silver/60">{addr.country}</p>
                    {addr.is_default && <span className="inline-block mt-1 text-xs text-gold/70">Default</span>}
                  </div>
                  <button onClick={() => deleteAddress(addr.id)} className="text-silver-dim hover:text-red-400 transition-colors" aria-label="Delete">
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
