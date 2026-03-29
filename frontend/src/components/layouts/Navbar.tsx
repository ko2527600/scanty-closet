import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/cart';
import { useAuthStore } from '../../store/auth';
import { CartDrawer } from '../cart/CartDrawer';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const cartItemsCount = useCartStore((state) => state.items.length);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN';
  const controls = useAnimation();

  useEffect(() => {
    if (cartItemsCount > 0) {
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.3 }
      });
    }
  }, [cartItemsCount, controls]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    ...(isAdmin ? [{ name: 'Admin', href: '/admin' }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-darkgrey/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform">
            <span className="text-white font-black text-xl italic">S</span>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-white font-black uppercase tracking-tighter text-xl">Scanty's</span>
            <span className="text-brand-silver/50 text-[10px] uppercase font-bold tracking-[0.2em]">Closet</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                'text-sm font-semibold tracking-wide uppercase transition-colors hover:text-brand-red',
                location.pathname === link.href ? 'text-brand-red' : 'text-brand-silver/70'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="p-2 text-brand-silver hover:text-white transition-colors">
            <Search size={20} />
          </button>
          <Link to="/profile" className="p-2 text-brand-silver hover:text-white transition-colors">
            <User size={20} />
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-brand-silver hover:text-white transition-colors group"
          >
            <motion.div animate={controls}>
              <ShoppingBag size={20} />
            </motion.div>
            <AnimatePresence>
              {cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-darkgrey shadow-lg"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <Button size="sm" className="hidden lg:flex" onClick={() => window.location.href='/shop'}>
            Explore Now
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-brand-silver" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Cart Drawer Overlay */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-darkgrey border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-lg font-bold text-brand-silver uppercase"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/5" />
              <div className="flex items-center justify-between pt-2">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="flex items-center space-x-2 text-brand-silver"
                >
                  <ShoppingBag size={20} />
                  <span>Cart ({cartItemsCount})</span>
                </button>
                <Link to="/profile" className="flex items-center space-x-2 text-brand-silver" onClick={() => setIsOpen(false)}>
                  <User size={20} />
                  <span>Account</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
