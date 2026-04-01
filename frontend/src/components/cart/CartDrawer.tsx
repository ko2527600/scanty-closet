import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, CreditCard } from 'lucide-react';
import { useCartStore } from '../../store/cart';
import { formatPrice } from '../../lib/utils';
import { Button } from '../ui/Button';
import { CartItem } from './CartItem';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-darkgrey/60 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full sm:max-w-md h-full bg-brand-darkgrey border-l border-white/5 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/5">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="text-brand-red" size={24} />
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Your Closet</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-brand-silver/50 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-8 py-4 divide-y divide-white/5 scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.05,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center space-y-8 py-20"
                  >
                    <div className="relative">
                      <ShoppingBag size={120} strokeWidth={0.5} className="text-brand-silver/5" />
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-0 flex items-center justify-center text-brand-red opacity-20"
                      >
                        <ShoppingBag size={40} />
                      </motion.div>
                    </div>
                    <div className="text-center space-y-2">
                       <p className="text-xl font-black uppercase italic tracking-tighter text-white">Your closet is empty</p>
                       <p className="text-[10px] font-bold text-brand-silver/30 uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">
                         Don't be late to the trends. Start curating your style today.
                       </p>
                    </div>
                    <Button 
                      variant="primary" 
                      className="px-10 h-14 rounded-2xl italic font-black uppercase tracking-tight group"
                      onClick={onClose}
                    >
                      Explore Collection
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 space-y-6 bg-white/5 border-t border-white/5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30">Subtotal</span>
                    <span className="text-lg font-black text-white italic">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30">Shipping</span>
                    <span className="text-xs font-black text-brand-green uppercase tracking-widest italic">Calculated at next step</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                   <Button 
                     size="lg" 
                     className="h-16 rounded-2xl text-lg font-black uppercase italic tracking-tighter w-full group"
                     onClick={() => {
                       onClose();
                       navigate('/cart');
                     }}
                   >
                     Proceed To Checkout
                     <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                   </Button>
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     className="text-[10px] font-black uppercase tracking-widest text-brand-silver/20 hover:text-red-500 transition-colors"
                     onClick={clearCart}
                   >
                     Clear Entire Closet
                   </Button>
                </div>

                <div className="flex items-center justify-center space-x-6 text-brand-silver/10">
                   <CreditCard size={20} />
                   <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Secure Checkout Guaranteed</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
