import { motion } from 'framer-motion';
import { Hero } from '../components/home/Hero';
import { ProductCard } from '../components/products/ProductCard';
import { Button } from '../components/ui/Button';
import { ArrowRight, ChevronRight, TrendingUp } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Air Force 1 Premium', brand: 'Nike', price: 150, image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop' },
  { id: '2', name: 'Ultra Boost 5.0', brand: 'Adidas', price: 180, image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=2031&auto=format&fit=crop' },
  { id: '3', name: 'Classic Leather G', brand: 'Reebok', price: 120, image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=2071&auto=format&fit=crop' },
  { id: '4', name: 'Court Legacy SE', brand: 'Nike', price: 95, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop' },
];

export function Home() {
  return (
    <div className="space-y-32 mb-32">
      <Hero />

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-brand-red font-black uppercase tracking-widest text-xs italic">
              <TrendingUp size={16} />
              <span>Trending Now</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
              Featured <br/> <span className="text-brand-silver/20 decoration-brand-red underline underline-offset-8 decoration-4">Essentials.</span>
            </h2>
          </div>
          <Button variant="outline" className="h-14 px-8 rounded-2xl group/btn" onClick={() => window.location.href='/shop'}>
            View All Collection
            <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* Category Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px]">
          {/* Large Lifestyle Tile */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative h-full bg-white/5 border border-white/5 rounded-[4rem] overflow-hidden p-12 flex flex-col justify-end"
          >
            <div className="absolute inset-0 bg-brand-red opacity-10 blur-[10rem] -z-10 group-hover:scale-150 transition-transform duration-1000" />
            <div className="space-y-6 relative z-10">
               <h3 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
                 Lifestyle <br/> Classics
               </h3>
               <p className="text-brand-silver/50 max-w-sm font-medium">Daily essentials for the modern lifestyle. Comfort meets style.</p>
               <Button className="h-14 px-8 rounded-2xl">Explore Culture</Button>
            </div>
          </motion.div>

          <div className="flex flex-col gap-8 h-full">
            {/* Sport Tier */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative flex-1 bg-white/5 border border-white/5 rounded-[3rem] overflow-hidden p-10 flex flex-col justify-center"
            >
               <div className="space-y-4">
                 <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">Performance Performance</h4>
                 <Button variant="ghost" className="p-0 text-brand-red group-hover:translate-x-2 transition-transform h-auto">
                    Shop Performance <ChevronRight size={16} />
                 </Button>
               </div>
            </motion.div>
            
            {/* Accessories Tier */}
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="group relative flex-1 bg-brand-red border border-white/5 rounded-[3rem] overflow-hidden p-10 flex flex-col justify-center"
            >
               <div className="space-y-4">
                 <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">Explaning Accessories</h4>
                 <Button variant="ghost" className="p-0 text-white group-hover:translate-x-2 transition-transform h-auto">
                    Complete Your Fit <ChevronRight size={16} />
                 </Button>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Motto / Call to Action */}
      <section className="relative overflow-hidden py-32 bg-white/5 mx-6 border border-white/5 rounded-[5rem]">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-red/5 blur-[12rem] -z-10" />
         <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-7xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.8]">
              Punctuality is the soul of business.
            </h2>
            <p className="text-brand-silver/30 text-xs italic tracking-widest font-black uppercase">
               The Scanty's Closet Motto Since 2026
            </p>
         </div>
      </section>
    </div>
  );
}
