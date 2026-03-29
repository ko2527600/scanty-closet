import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/Button';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24 px-6 scale-100 group">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-brand-red/20 rounded-full blur-[12rem] -z-10 animate-pulse" />
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 text-center lg:text-left"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-brand-red decoration-brand-red decoration-2 underline-offset-4"
            >
              New Collection 2026
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9] drop-shadow-2xl">
              Elevate Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-white decoration-white underline underline-offset-8 decoration-4">Street Game.</span>
            </h1>
            <p className="text-brand-silver/50 max-w-xl mx-auto lg:mx-0 font-medium text-lg leading-relaxed">
              Step into the world of premium sneakers where punctuality meets style. Explore our curated selection of limited pieces from the iconic brands.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Button size="lg" className="h-16 px-10 rounded-2xl group/btn" onClick={() => window.location.href='/shop'}>
              Shop Latest
              <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl group/btn">
              <ShoppingBag className="mr-2" />
              View Trends
            </Button>
          </div>
          
          {/* Stats */}
          <div className="pt-12 grid grid-cols-3 gap-8">
            <div className="space-y-1">
              <div className="text-3xl font-black text-white italic">15k+</div>
              <div className="text-[10px] uppercase font-bold text-brand-silver/30 tracking-widest">Happy Clients</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-white italic">50+</div>
              <div className="text-[10px] uppercase font-bold text-brand-silver/30 tracking-widest">Premium Brands</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-white italic">100%</div>
              <div className="text-[10px] uppercase font-bold text-brand-silver/30 tracking-widest">On-Time Always</div>
            </div>
          </div>
        </motion.div>

        {/* Visual Product Mockup (Placeholder Circle for now) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative aspect-square max-w-[500px] mx-auto group"
        >
          {/* Main Visual Circle */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-red to-transparent rounded-[4rem] group-hover:rotate-6 transition-transform duration-700 -z-10 blur-xl opacity-30" />
          <div className="w-full h-full bg-white/5 border border-white/10 rounded-[4rem] flex items-center justify-center p-8 backdrop-blur-2xl group-hover:-rotate-3 transition-transform duration-700 shadow-2xl overflow-hidden group/img">
            {/* Inner Brand S */}
            <span className="text-white/5 font-black text-[20rem] absolute -bottom-20 -right-20 italic">S</span>
            <div className="relative z-10 w-full aspect-square rounded-[3rem] bg-brand-darkgrey shadow-inset group-hover/img:scale-105 transition-transform duration-1000 overflow-hidden">
               {/* Image Placeholder with rich color */}
               <div className="w-full h-full bg-gradient-to-tr from-brand-red/10 via-brand-red/5 to-transparent flex items-center justify-center">
                 <div className="w-48 h-48 bg-brand-red rounded-3xl flex items-center justify-center rotate-12">
                   <span className="text-white font-black text-7xl italic">S</span>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
