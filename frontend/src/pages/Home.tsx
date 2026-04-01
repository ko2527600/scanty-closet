import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/home/Hero';
import { ProductCard } from '../components/products/ProductCard';
import { Button } from '../components/ui/Button';
import { ArrowRight, ChevronRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { ProductGridSkeleton } from '../components/ui/ProductSkeleton';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: string | number;
  variants: { image_urls: string[] }[];
}

export function Home() {
  const navigate = useNavigate();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get('/products');
      return data;
    },
  });

  const featured = products?.slice(0, 4) ?? [];

  return (
    <div className="space-y-32 mb-32">
      <Helmet>
        <title>Scanty's Closet | Premium Sneaker Destination</title>
        <meta name="description" content="Discover the most exclusive sneaker collections at Scanty's Closet. From timeless classics to the latest performance drops, find your next pair here." />
        <meta property="og:title" content="Scanty's Closet | Premium Sneaker Destination" />
        <meta property="og:description" content="Shop the rarest kicks and latest drops in Ghana. Premium sneakers, guaranteed authentic." />
        <meta property="og:image" content="/images/assets/hero.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

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
              Featured <br /> <span className="text-brand-silver/20 decoration-brand-red underline underline-offset-8 decoration-4">Essentials.</span>
            </h2>
          </div>
          <Button variant="outline" className="h-14 px-8 rounded-2xl group/btn" onClick={() => navigate('/shop')}>
            View All Collection
            <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>

        {isLoading || featured.length === 0 ? (
          <ProductGridSkeleton count={4} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                price={Number(product.price)}
                image={product.variants?.[0]?.image_urls?.[0] || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop'}
              />
            ))}
          </div>
        )}
      </section>

      {/* Category Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative h-full bg-white/5 border border-white/5 rounded-[4rem] overflow-hidden p-12 flex flex-col justify-end cursor-pointer shadow-2xl"
            onClick={() => navigate('/shop')}
          >
            <img 
              src="/images/assets/lifestyle.png" 
              alt="Lifestyle Classics" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-darkgrey via-brand-darkgrey/40 to-transparent pointer-events-none" />
            <div className="space-y-6 relative z-10">
              <h3 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
                Lifestyle <br /> Classics
              </h3>
              <p className="text-brand-silver/50 max-w-sm font-medium">Daily essentials for the modern lifestyle. Where comfort meets pure streetwear culture.</p>
              <Button className="h-14 px-8 rounded-2xl">Explore Culture</Button>
            </div>
          </motion.div>

          <div className="flex flex-col gap-8 h-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative flex-1 bg-white/5 border border-white/5 rounded-[3rem] overflow-hidden p-10 flex flex-col justify-center cursor-pointer shadow-xl"
              onClick={() => navigate('/shop')}
            >
              <img 
                src="/images/assets/performance.png" 
                alt="Performance Gear" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-darkgrey to-transparent pointer-events-none" />
              <div className="space-y-4 relative z-10">
                <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">Performance</h4>
                <Button variant="ghost" className="p-0 text-brand-red group-hover:translate-x-2 transition-transform h-auto">
                  Shop Advanced Gear <ChevronRight size={16} />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative flex-1 bg-brand-red border border-white/5 rounded-[3rem] overflow-hidden p-10 flex flex-col justify-center cursor-pointer shadow-xl"
              onClick={() => navigate('/shop')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent -z-10" />
              <div className="space-y-4">
                <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">New Arrivals</h4>
                <p className="text-white/70 text-sm font-bold uppercase tracking-widest italic">Curated Weekly</p>
                <Button variant="ghost" className="p-0 text-white group-hover:translate-x-2 transition-transform h-auto">
                  Complete Your Fit <ChevronRight size={16} />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Motto */}
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
