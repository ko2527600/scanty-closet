import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  ArrowLeft,
  Star,
  Truck,
  ShieldCheck,
  RefreshCcw,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { cn, formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useCartStore } from '../store/cart';
import { toast } from 'sonner';
import api from '../lib/axios';
import { Helmet } from 'react-helmet-async';
import { ProductCard } from '../components/products/ProductCard';
import { getOptimizedImage } from '../lib/cloudinary';

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock_quantity: number;
  image_urls: string[];
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user: { first_name: string; last_name: string };
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: string | number;
  description: string;
  category: { name: string } | null;
  variants: ProductVariant[];
  reviews: Review[];
  relatedProducts?: any[];
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop';

export function ProductDetails() {
  const { id } = useParams();
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  // Scroll to top when product ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedVariantId('');
    setActiveImage(0);
  }, [id]);

  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
    enabled: !!id,
  });

  const selectedVariant = product?.variants.find((v) => v.id === selectedVariantId);
  const allImages = product?.variants.flatMap((v) => v.image_urls).filter(Boolean) ?? [];
  const images = allImages.length > 0 ? allImages : [FALLBACK_IMAGE];

  // Unique sizes and colors
  const uniqueSizes = [...new Set(product?.variants.map((v) => v.size) ?? [])];
  const uniqueColors = [...new Set(product?.variants.map((v) => v.color) ?? [])];

  const handleAddToCart = () => {
    if (!selectedVariantId || !product || !selectedVariant) {
      toast.error('Please select a size/variant before adding to closet.', {
        style: { background: '#111', color: '#fff', border: '1px solid #dc2626' },
      });
      return;
    }
    if (selectedVariant.stock_quantity === 0) {
      toast.error('This variant is out of stock.');
      return;
    }

    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      size: selectedVariant.size,
      color: selectedVariant.color,
      image: images[0] ?? FALLBACK_IMAGE,
    });

    toast.success('Added to your closet!', {
      description: `${product.name} — Size ${selectedVariant.size} / ${selectedVariant.color}`,
      style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-square rounded-[3rem] bg-white/5 animate-pulse" />
          <div className="space-y-8">
            <div className="h-12 w-2/3 rounded-2xl bg-white/5 animate-pulse" />
            <div className="h-8 w-1/3 rounded-2xl bg-white/5 animate-pulse" />
            <div className="h-32 rounded-2xl bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center space-y-6">
        <h1 className="text-4xl font-black italic uppercase text-white/30">Product not found.</h1>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 space-y-24">
      <Helmet>
        <title>{`${product.name} | Scanty's Closet`}</title>
        <meta name="description" content={product.description.slice(0, 160)} />
        <meta property="og:title" content={`${product.name} - ${formatPrice(Number(product.price))}`} />
        <meta property="og:description" content={`Get the ${product.name} at Scanty's Closet. Guaranteed authentic sneakers with premium delivery.`} />
        <meta property="og:image" content={images[0]} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={String(product.price)} />
        <meta property="product:price:currency" content="GHS" />
      </Helmet>

      {/* Breadcrumbs */}
      <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30 italic overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
        <Link to="/shop" className="hover:text-brand-red transition-colors flex items-center shrink-0">
          <ArrowLeft size={12} className="mr-2" /> Back to Shop
        </Link>
        <span>/</span>
        <span className="text-brand-silver/50">{product.category?.name ?? 'Sneakers'}</span>
        <span>/</span>
        <span className="text-white truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-white/5 border border-white/5 group">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                src={getOptimizedImage(images[activeImage] ?? FALLBACK_IMAGE, 1200)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 flex items-center justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                className="w-12 h-12 rounded-full bg-brand-darkgrey/80 backdrop-blur-md flex items-center justify-center text-white"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => setActiveImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                className="w-12 h-12 rounded-full bg-brand-darkgrey/80 backdrop-blur-md flex items-center justify-center text-white"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-6">
              {images.slice(0, 3).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    'aspect-square rounded-2xl overflow-hidden border-2 transition-all',
                    activeImage === idx ? 'border-brand-red p-1' : 'border-transparent opacity-50 hover:opacity-100'
                  )}
                >
                  <img src={getOptimizedImage(img, 200)} alt="" className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="primary">{product.category?.name ?? 'Sneaker'}</Badge>
              {avgRating !== null && (
                <div className="flex items-center space-x-1 text-brand-red">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill={s <= Math.round(avgRating) ? 'currentColor' : 'none'} />
                  ))}
                  <span className="text-brand-silver/50 text-[10px] font-black ml-2 uppercase tracking-widest">
                    ({product.reviews.length} Reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-brand-red font-black uppercase tracking-[0.3em] text-[10px] italic">{product.brand}</p>
              <h1 className="text-5xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="text-4xl font-black text-white italic">{formatPrice(Number(product.price))}</div>
            <p className="text-brand-silver/50 font-medium leading-relaxed">{product.description}</p>
          </div>

          {/* Variant Selectors */}
          <div className="space-y-8">
            {uniqueColors.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30 italic">
                  Available Colors
                </h3>
                <div className="flex flex-wrap gap-3">
                  {uniqueColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        const v = product.variants.find((vv) => vv.color === color);
                        if (v) setSelectedVariantId(v.id);
                      }}
                      className={cn(
                        'px-4 py-2 rounded-xl border-2 text-xs font-black uppercase tracking-wider transition-all',
                        selectedVariant?.color === color
                          ? 'border-brand-red bg-brand-red/10 text-white'
                          : 'border-white/10 text-brand-silver/50 hover:border-white/30'
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {uniqueSizes.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30 italic">
                    Select Size (US)
                  </h3>
                  <button className="text-[9px] font-black uppercase tracking-widest text-brand-red hover:underline">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {uniqueSizes.map((size) => {
                    const v = product.variants.find((vv) => vv.size === size);
                    const outOfStock = v?.stock_quantity === 0;
                    return (
                      <button
                        key={size}
                        onClick={() => { if (v && !outOfStock) setSelectedVariantId(v.id); }}
                        disabled={outOfStock}
                        className={cn(
                          'h-12 rounded-xl border-2 text-sm font-black transition-all',
                          selectedVariant?.size === size
                            ? 'bg-brand-red border-brand-red text-white'
                            : outOfStock
                            ? 'bg-white/5 border-white/5 text-brand-silver/20 cursor-not-allowed line-through'
                            : 'bg-white/5 border-white/10 text-brand-silver/50 hover:border-white/20'
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {product.variants.length === 0 && (
              <p className="text-sm text-brand-silver/30 italic">No variants available for this product yet.</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="flex-1 h-20 rounded-2xl text-xl italic font-black uppercase tracking-tight group"
              disabled={product.variants.length === 0}
            >
              <ShoppingBag className="mr-3 group-hover:rotate-12 transition-transform" />
              Add to Closet
            </Button>
            <Button variant="outline" size="lg" className="h-20 w-20 rounded-2xl group">
              <Star className="group-hover:fill-brand-red group-hover:text-brand-red transition-all" />
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-6 pt-4">
            {[
              { icon: <Truck size={18} />, label: 'On-Time', sub: 'Guaranteed' },
              { icon: <ShieldCheck size={18} />, label: 'Authentic', sub: 'Verified' },
              { icon: <RefreshCcw size={18} />, label: 'Flexible', sub: '30-Day Returns' },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex items-center space-x-3 group">
                <div className="p-3 bg-white/5 rounded-xl text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors">
                  {icon}
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white italic">{label}</p>
                  <p className="text-[9px] font-bold text-brand-silver/30 uppercase tracking-tight">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <div className="space-y-12 border-t border-white/5 pt-16">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Customer <span className="text-brand-silver/20">Reviews.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-black text-white italic">
                    {review.user.first_name} {review.user.last_name[0]}.
                  </p>
                  <div className="flex text-brand-red">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} fill={s <= review.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-brand-silver/50 text-sm leading-relaxed">{review.comment}</p>
                )}
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-silver/20">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="space-y-12 border-t border-white/5 pt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              Related <span className="text-brand-silver/20">Drops.</span>
            </h2>
            <Link 
              to="/shop" 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red hover:underline italic flex items-center"
            >
              View All <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {product.relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                brand={p.brand}
                price={Number(p.price)}
                image={p.variants[0]?.image_urls[0] || FALLBACK_IMAGE}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
