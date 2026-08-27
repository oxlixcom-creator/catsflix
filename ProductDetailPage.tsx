import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingBag, ArrowLeft, Minus, Plus, Truck, Shield, RotateCcw, ExternalLink, Store } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { useAuth } from '@/lib/auth-context';
import { formatPrice, formatDate, getAffiliateUrl, getDiscountPercent, isSafeExternalUrl } from '@/lib/utils';
import type { Product, Review, Profile } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .maybeSingle()
      .then(async ({ data }) => {
        if (data) {
          const prod = data as Product;
          setProduct(prod);
          setActiveImage(0);
          setQuantity(1);

          const [relRes, revRes] = await Promise.all([
            supabase.from('products').select('*').eq('is_active', true).eq('category_id', prod.category_id).neq('id', prod.id).limit(4),
            supabase.from('reviews').select('*, profile:profiles(full_name, email)').eq('product_id', prod.id).order('created_at', { ascending: false }),
          ]);
          if (relRes.data) setRelated(relRes.data as Product[]);
          if (revRes.data) setReviews(revRes.data as unknown as Review[]);
        }
        setLoading(false);
      });
  }, [slug]);

  const handleAddToCart = () => {
    if (!session) {
      navigate('/login');
      return;
    }
    if (product) addItem(product.id, quantity);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (product.is_affiliate) {
      const url = getAffiliateUrl(product);
      if (url && isSafeExternalUrl(url)) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    if (!session) {
      navigate('/login');
      return;
    }
    addItem(product.id, quantity).then(() => navigate('/cart'));
  };

  const submitReview = async () => {
    if (!session?.user?.id || !product) return;
    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      product_id: product.id,
      user_id: session.user.id,
      rating: reviewRating,
      comment: reviewComment,
    });
    if (!error) {
      setReviewComment('');
      const { data } = await supabase
        .from('reviews')
        .select('*, profile:profiles(full_name, email)')
        .eq('product_id', product.id)
        .order('created_at', { ascending: false });
      if (data) setReviews(data as unknown as Review[]);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-5 sm:px-8 min-h-screen">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-[3/4] rounded-3xl glass" />
            <div className="space-y-4">
              <div className="h-10 w-2/3 rounded-lg glass" />
              <div className="h-6 w-1/3 rounded-lg glass" />
              <div className="h-32 rounded-lg glass" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 px-5 min-h-screen text-center">
        <h1 className="font-display text-4xl text-white">Product not found</h1>
        <Link to="/collections" className="mt-6 inline-block text-gold hover:underline">Browse all products</Link>
      </div>
    );
  }

  const wished = isWishlisted(product.id);
  const images = product.images ?? [];

  return (
    <div className="pt-32 pb-20 px-5 sm:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Link to="/collections" className="inline-flex items-center gap-2 text-sm text-silver/60 hover:text-gold transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden glass luxury-shadow">
              <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
              {product.tag && (
                <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-gold/30 font-mono text-[10px] tracking-[0.2em] text-gold uppercase">
                  {product.tag}
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? 'border-gold' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="font-mono text-[11px] tracking-[0.3em] text-silver-dim uppercase">{product.sku}</span>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl font-light text-white">{product.name}</h1>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-gold text-gold' : 'text-silver-dim'}`} strokeWidth={0} />
                ))}
              </div>
              <span className="text-sm text-silver/70">{product.rating}</span>
              <span className="text-sm text-silver-dim">({product.review_count} reviews)</span>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="font-display text-4xl text-white">{formatPrice(product.price)}</span>
              {product.compare_at_price && (
                <>
                  <span className="text-xl text-silver-dim line-through">{formatPrice(product.compare_at_price)}</span>
                  {getDiscountPercent(product.price, product.compare_at_price) && (
                    <span className="px-2.5 py-1 rounded-full bg-gold/15 border border-gold/30 text-xs font-mono text-gold uppercase tracking-wide">
                      {getDiscountPercent(product.price, product.compare_at_price)}% Off
                    </span>
                  )}
                </>
              )}
            </div>

            {product.brand && (
              <p className="mt-3 text-sm text-silver/50 font-mono tracking-wide uppercase">by {product.brand}</p>
            )}

            <p className="mt-6 text-silver/60 font-light leading-relaxed">{product.description}</p>

            {/* Quantity */}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-sm text-silver/70 font-mono tracking-wide uppercase">Quantity</span>
              <div className="flex items-center gap-3 glass rounded-full px-4 py-2">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="text-silver hover:text-gold transition-colors">
                  <Minus className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <span className="w-8 text-center text-white">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="text-silver hover:text-gold transition-colors">
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
              <span className={`text-xs font-mono uppercase ${product.stock > 0 ? 'text-gold/70' : 'text-red-400/70'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Sold Out'}
              </span>
            </div>

            {/* Affiliate notice */}
            {product.is_affiliate && (
              <div className="mt-6 glass rounded-2xl p-4 flex items-start gap-3">
                <Store className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-white font-medium">Authorized Affiliate Product</p>
                  <p className="text-xs text-silver/60 mt-1 leading-relaxed">
                    This product is sold and shipped by {product.source_store || 'our authorized partner'}.
                    Clicking "Buy at Partner" will open their store in a new tab. ONYX does not process the payment or handle shipping for this item.
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {product.is_affiliate ? (
                <>
                  <button
                    onClick={handleBuyNow}
                    disabled={!getAffiliateUrl(product)}
                    className="flex-1 py-4 rounded-full bg-white text-black font-medium text-sm tracking-wide hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                    Buy at {product.source_store || 'Partner'}
                  </button>
                  <button
                    onClick={() => toggle(product.id)}
                    className="w-14 h-14 rounded-full glass flex items-center justify-center hover:glass-gold transition-all duration-300"
                    aria-label="Toggle wishlist"
                  >
                    <Heart className={`w-5 h-5 ${wished ? 'fill-gold text-gold' : 'text-silver'}`} strokeWidth={1.5} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 py-4 rounded-full glass-gold text-gold font-medium text-sm tracking-wide hover:bg-gold hover:text-black transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                    Add to Bag
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className="flex-1 py-4 rounded-full bg-white text-black font-medium text-sm tracking-wide hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] transition-all duration-300 disabled:opacity-40"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => toggle(product.id)}
                    className="w-14 h-14 rounded-full glass flex items-center justify-center hover:glass-gold transition-all duration-300"
                    aria-label="Toggle wishlist"
                  >
                    <Heart className={`w-5 h-5 ${wished ? 'fill-gold text-gold' : 'text-silver'}`} strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>

            {/* Features */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'On orders over $200' },
                { icon: Shield, label: 'Authenticity', sub: '100% genuine guarantee' },
                { icon: RotateCcw, label: '30-Day Returns', sub: 'Easy & secure' },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="glass rounded-2xl p-4 text-center">
                    <Icon className="w-5 h-5 text-gold mx-auto mb-2" strokeWidth={1.2} />
                    <p className="text-xs text-white font-medium">{f.label}</p>
                    <p className="text-[10px] text-silver-dim mt-1">{f.sub}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <div className="mt-20">
          <h2 className="font-display text-3xl font-light text-white mb-8">
            Customer <span className="gold-text italic">Reviews</span>
          </h2>

          {session && (
            <div className="glass rounded-2xl p-6 mb-8">
              <h3 className="text-sm font-mono tracking-wide text-gold/70 uppercase mb-4">Write a Review</h3>
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setReviewRating(s)}>
                    <Star className={`w-6 h-6 ${s <= reviewRating ? 'fill-gold text-gold' : 'text-silver-dim'}`} strokeWidth={0} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl glass text-sm text-white placeholder:text-silver-dim focus:outline-none focus:border-gold/40 resize-none"
              />
              <button
                onClick={submitReview}
                disabled={submitting}
                className="mt-3 px-6 py-2.5 rounded-full bg-gold text-black font-medium text-sm hover:bg-gold-light transition-colors disabled:opacity-40"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          )}

          {reviews.length === 0 ? (
            <p className="text-silver/50 font-light text-center py-10">No reviews yet. Be the first to share your experience.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const profile = review.profile as Pick<Profile, 'full_name' | 'email'> | undefined;
                return (
                  <div key={review.id} className="glass rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-white font-medium">{profile?.full_name || 'Anonymous'}</p>
                        <p className="text-xs text-silver-dim">{formatDate(review.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-gold text-gold' : 'text-silver-dim'}`} strokeWidth={0} />
                        ))}
                      </div>
                    </div>
                    {review.comment && <p className="text-sm text-silver/70 font-light leading-relaxed">{review.comment}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-3xl font-light text-white mb-8">
              You May Also <span className="gold-text italic">Like</span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
