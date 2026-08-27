import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/supabase';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [input, setInput] = useState(query);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInput(query);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const sanitized = query.replace(/[%_,().\\]/g, ' ').trim();
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${sanitized}%,description.ilike.%${sanitized}%,sku.ilike.%${sanitized}%`)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setResults((data as Product[]) ?? []);
        setLoading(false);
      });
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(input.trim() ? { q: input.trim() } : {});
  };

  const clearSearch = () => {
    setInput('');
    setSearchParams({});
  };

  return (
    <div className="pt-32 pb-20 px-5 sm:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="font-mono text-[11px] tracking-[0.4em] text-gold/70 uppercase">Search</span>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl font-light text-white">
            Find your <span className="gold-text italic">dark</span>
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-dim" strokeWidth={1.5} />
            <input
              type="text"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search products, descriptions, SKU..."
              className="w-full pl-14 pr-12 py-4 rounded-full glass text-sm text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40 transition-colors"
            />
            {input && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-silver-dim hover:text-gold transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </form>

        {query && (
          <p className="text-center text-sm text-silver/50 font-light mb-8">
            {loading ? 'Searching...' : `${results.length} ${results.length === 1 ? 'result' : 'results'} for "${query}"`}
          </p>
        )}

        {!query && !loading && (
          <div className="text-center py-20">
            <SearchIcon className="w-16 h-16 text-silver-dim mx-auto mb-6" strokeWidth={1} />
            <p className="text-silver/50 font-light">Start typing to search the collection.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {['Jacket', 'Watch', 'Perfume', 'Dress', 'Bag'].map((term) => (
                <button
                  key={term}
                  onClick={() => { setInput(term); setSearchParams({ q: term }); }}
                  className="px-4 py-2 rounded-full glass text-xs text-silver/70 hover:text-gold hover:glass-gold transition-all font-mono uppercase tracking-wide"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {query && !loading && results.length === 0 && (
          <div className="text-center py-20">
            <p className="text-silver/50 font-light">No products found. Try a different search term.</p>
            <Link to="/collections" className="mt-6 inline-block text-gold/70 hover:text-gold text-sm">
              Browse all products
            </Link>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {results.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
