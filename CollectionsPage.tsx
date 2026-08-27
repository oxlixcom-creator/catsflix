import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating'>('newest');

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ]).then(([prodRes, catRes]) => {
      if (prodRes.data) setProducts(prodRes.data as Product[]);
      if (catRes.data) setCategories(catRes.data as Category[]);
      setLoading(false);
    });
  }, []);

  const filtered = products
    .filter((p) => !activeCategory || p.category_id === activeCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });

  return (
    <div className="pt-32 pb-20 px-5 sm:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-[11px] tracking-[0.4em] text-gold/70 uppercase">All Products</span>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl font-light text-white">
            The Full <span className="gold-text italic">Collection</span>
          </h1>
          <p className="mt-4 text-silver/60 font-light max-w-xl mx-auto">
            Every piece in our arsenal of black — curated for those who refuse to blend in.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wide uppercase transition-all ${
                !activeCategory ? 'bg-gold text-black' : 'glass text-silver/70 hover:text-gold'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wide uppercase transition-all ${
                  activeCategory === cat.id ? 'bg-gold text-black' : 'glass text-silver/70 hover:text-gold'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 rounded-full glass text-sm text-silver focus:outline-none focus:border-gold/40 cursor-pointer"
          >
            <option value="newest" className="bg-onyx-smoke">Newest</option>
            <option value="price-asc" className="bg-onyx-smoke">Price: Low to High</option>
            <option value="price-desc" className="bg-onyx-smoke">Price: High to Low</option>
            <option value="rating" className="bg-onyx-smoke">Top Rated</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl glass animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-silver/50 font-light">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
