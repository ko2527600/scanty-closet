import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Star, 
  Truck, 
  ShieldCheck, 
  RefreshCcw,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn, formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useCartStore } from '../store/cart';
import { toast } from 'sonner';

// Mock data for a single product
const MOCK_PRODUCT = {
  id: '1',
  name: 'Air Force 1 Premium "Soul Edition"',
  brand: 'Nike',
  price: 150,
  description: 'Experience the pinnacle of street style with the Air Force 1 Premium "Soul Edition". Crafted with top-tier materials and featuring our iconic Scanty-inspired colorway, these sneakers aren\'t just footwear—they\'re a statement of punctuality and style.',
  features: [
    'Premium pebble grain leather upper',
    'Encapsulated Air-Sole unit for lightweight cushioning',
    'Classic rubber outsole with pivot circles',
    'Exclusive Scanty\'s Closet heel branding',
  ],
  images: [
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop',
  ],
  sizes: ['7', '8', '9', '10', '11', '12'],
  colors: [
    { name: 'Pure Red', hex: '#dc2626' },
    { name: 'Dark Onyx', hex: '#1f2937' },
    { name: 'Silver Moon', hex: '#e5e7eb' },
  ],
  reviews: [
    { id: 1, user: 'John D.', rating: 5, comment: 'Punctuality is real! Arrived exactly when promised. The quality is insane.', date: '2026-03-20' },
    { id: 2, user: 'Sarah K.', rating: 4, comment: 'Love the red accents. Very comfortable for all-day wear.', date: '2026-03-22' },
  ]
};

export function ProductDetails() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(MOCK_PRODUCT.colors[0].name);
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Punctuality check: Please select a size before adding to closet.', {
        style: { background: '#111', color: '#fff', border: '1px solid #dc2626' }
      });
      return;
    }

    addItem({
      id: `${id}-${selectedSize}-${selectedColor}`,
      productId: id || '1',
      name: MOCK_PRODUCT.name,
      price: MOCK_PRODUCT.price,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
      image: MOCK_PRODUCT.images[0],
    });

    toast.success('Added to your closet!', {
      description: `${MOCK_PRODUCT.name} - Size ${selectedSize}`,
      style: { background: '#111', color: '#fff', border: '1px solid #fff/10' }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 space-y-24">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30 italic">
        <Link to="/shop" className="hover:text-brand-red transition-colors flex items-center">
          <ArrowLeft size={12} className="mr-2" /> Back to Shop
        </Link>
        <span>/</span>
        <span className="text-brand-silver/50">Sneakers</span>
        <span>/</span>
        <span className="text-white">Product {id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: Image Gallery */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-white/5 border border-white/5 group">
             <AnimatePresence mode="wait">
               <motion.img
                 key={activeImage}
                 initial={{ opacity: 0, scale: 1.1 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                 src={MOCK_PRODUCT.images[activeImage]}
                 alt={MOCK_PRODUCT.name}
                 className="w-full h-full object-cover"
               />
             </AnimatePresence>
             
             {/* Simple Gallery Arrows */}
             <div className="absolute inset-0 flex items-center justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                 onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : MOCK_PRODUCT.images.length - 1)}
                 className="w-12 h-12 rounded-full bg-brand-darkgrey/80 backdrop-blur-md flex items-center justify-center text-white"
               >
                 <ChevronLeft size={24} />
               </button>
               <button 
                 onClick={() => setActiveImage(prev => prev < MOCK_PRODUCT.images.length - 1 ? prev + 1 : 0)}
                 className="w-12 h-12 rounded-full bg-brand-darkgrey/80 backdrop-blur-md flex items-center justify-center text-white"
               >
                 <ChevronRight size={24} />
               </button>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {MOCK_PRODUCT.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={cn(
                  "aspect-square rounded-2xl overflow-hidden border-2 transition-all",
                  activeImage === idx ? "border-brand-red p-1" : "border-transparent opacity-50 hover:opacity-100"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info Section */}
        <div className="space-y-12">
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="primary">New Arrival</Badge>
                <div className="flex items-center space-x-1 text-brand-red">
                   <Star size={14} fill="currentColor" />
                   <Star size={14} fill="currentColor" />
                   <Star size={14} fill="currentColor" />
                   <Star size={14} fill="currentColor" />
                   <Star size={14} className="opacity-30" />
                   <span className="text-brand-silver/50 text-[10px] font-black ml-2 uppercase tracking-widest">(24 Reviews)</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-brand-red font-black uppercase tracking-[0.3em] text-[10px] italic">{MOCK_PRODUCT.brand}</p>
                <h1 className="text-5xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight">
                  {MOCK_PRODUCT.name}
                </h1>
              </div>

              <div className="text-4xl font-black text-white italic">
                {formatPrice(MOCK_PRODUCT.price)}
              </div>

              <p className="text-brand-silver/50 font-medium leading-relaxed">
                {MOCK_PRODUCT.description}
              </p>
           </div>

           {/* Selectors */}
           <div className="space-y-8">
              {/* Color Selector */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30 italic">Select Color: <span className="text-white">{selectedColor}</span></h3>
                <div className="flex items-center space-x-4">
                  {MOCK_PRODUCT.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all relative flex items-center justify-center",
                        selectedColor === color.name ? "border-brand-red scale-110" : "border-white/10"
                      )}
                    >
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color.hex }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30 italic">Select Size (US)</h3>
                  <button className="text-[9px] font-black uppercase tracking-widest text-brand-red hover:underline">Size Guide</button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {MOCK_PRODUCT.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "h-12 rounded-xl border-2 text-sm font-black transition-all",
                        selectedSize === size 
                          ? "bg-brand-red border-brand-red text-white" 
                          : "bg-white/5 border-white/10 text-brand-silver/50 hover:border-white/20"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
           </div>

           {/* Actions */}
           <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
              <Button 
                onClick={handleAddToCart}
                size="lg" 
                className="flex-1 h-20 rounded-2xl text-xl italic font-black uppercase tracking-tight group"
              >
                <ShoppingBag className="mr-3 group-hover:rotate-12 transition-transform" />
                Add to Closet
              </Button>
              <Button variant="outline" size="lg" className="h-20 w-20 rounded-2xl group">
                 <Star className="group-hover:fill-brand-red group-hover:text-brand-red transition-all" />
              </Button>
           </div>

           {/* Benefits */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-3 group">
                 <div className="p-3 bg-white/5 rounded-xl text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors">
                    <Truck size={18} />
                 </div>
                 <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white italic">On-Time</p>
                    <p className="text-[9px] font-bold text-brand-silver/30 uppercase tracking-tight">Guaranteed</p>
                 </div>
              </div>
              <div className="flex items-center space-x-3 group">
                 <div className="p-3 bg-white/5 rounded-xl text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors">
                    <ShieldCheck size={18} />
                 </div>
                 <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white italic">Authentic</p>
                    <p className="text-[9px] font-bold text-brand-silver/30 uppercase tracking-tight">Verified</p>
                 </div>
              </div>
              <div className="flex items-center space-x-3 group">
                 <div className="p-3 bg-white/5 rounded-xl text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors">
                    <RefreshCcw size={18} />
                 </div>
                 <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white italic">Flexible</p>
                    <p className="text-[9px] font-bold text-brand-silver/30 uppercase tracking-tight">30-Day Returns</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
