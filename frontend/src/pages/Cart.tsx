import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/cart';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { CartItem } from '../components/cart/CartItem';
import { Input } from '../components/ui/Input';

export function Cart() {
  const { items, total } = useCartStore();
  const navigate = useNavigate();

  const shipping = items.length > 0 ? 15 : 0;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center space-y-8">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto text-brand-silver/20">
          <ShoppingBag size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Your closet is empty.</h1>
          <p className="text-brand-silver/50 font-medium">Add some premium heat to your collection to get started.</p>
        </div>
        <Button size="lg" onClick={() => navigate('/shop')}>
          Explore Collection
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 space-y-12">
      <div className="space-y-4 border-b border-white/5 pb-12">
        <button 
          onClick={() => navigate('/shop')}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red italic flex items-center hover:underline"
        >
          <ArrowLeft size={12} className="mr-2" /> Continue Shopping
        </button>
        <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none">
          Checkout <br/> <span className="text-brand-silver/20 border-brand-red border-b-8">Summary.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        {/* Left: Cart Items & Form */}
        <div className="lg:col-span-2 space-y-12">
           <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30 italic">Items In Your Closet</h3>
              <div className="divide-y divide-white/5 border-t border-b border-white/5">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
           </div>

           <div className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30 italic">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input label="First Name" placeholder="Sneaker" />
                 <Input label="Last Name" placeholder="Head" />
                 <Input label="Email" placeholder="you@example.com" className="md:col-span-2" />
                 <Input label="Address" placeholder="123 Hype St" className="md:col-span-2" />
                 <Input label="City" placeholder="Streetwear City" />
                 <Input label="Postal Code" placeholder="ZIP CODE" />
              </div>
           </div>
        </div>

        {/* Right: Order Summary */}
        <div className="sticky top-32 space-y-8">
           <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8 backdrop-blur-xl">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Order Total</h3>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-silver/50">Subtotal</span>
                    <span className="text-sm font-black text-white">{formatPrice(total)}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-silver/50">Shipping</span>
                    <span className="text-sm font-black text-white">{formatPrice(shipping)}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-silver/50">Tax (8%)</span>
                    <span className="text-sm font-black text-white">{formatPrice(tax)}</span>
                 </div>
                 <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-lg font-black uppercase tracking-tighter text-white">Grand Total</span>
                    <span className="text-3xl font-black text-brand-red italic">{formatPrice(grandTotal)}</span>
                 </div>
              </div>

              <Button size="lg" className="w-full h-20 rounded-2xl text-xl font-black uppercase italic tracking-tight group">
                 <CreditCard className="mr-3 group-hover:rotate-12 transition-transform" />
                 Pay & Place Order
              </Button>

              <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
                 <div className="flex items-center text-[8px] font-bold uppercase tracking-[0.2em] text-brand-silver/30">
                    <Truck size={14} className="mr-3 text-brand-red" />
                    Estimated Delivery: 3-5 Business Days
                 </div>
                 <div className="flex items-center text-[8px] font-bold uppercase tracking-[0.2em] text-brand-silver/30">
                    <ShieldCheck size={14} className="mr-3 text-brand-red" />
                    Secure SSL Encrypted Payment
                 </div>
              </div>
           </div>
           
           <p className="text-center text-[10px] font-bold text-brand-silver/20 uppercase tracking-[0.2em]">
             "Punctuality is the soul of business"
           </p>
        </div>
      </div>
    </div>
  );
}
