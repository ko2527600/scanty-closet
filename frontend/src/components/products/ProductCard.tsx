import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye } from 'lucide-react';
import { cn, formatPrice } from '../../lib/utils';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/cart';
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  className?: string;
}

export function ProductCard({ id, name, brand, price, image, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: `${id}-default`,
      productId: id,
      name,
      price,
      quantity: 1,
      size: 'Standard',
      color: 'Default',
      image,
    });

    toast.success('Quickly added to closet!', {
      description: `${name} (Standard Size)`,
      style: { background: '#111', color: '#fff', border: '1px solid #dc2626' }
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        'group relative bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden transition-all hover:bg-white/10 hover:border-white/10 hover:shadow-2xl hover:shadow-brand-red/10',
        className
      )}
    >
      {/* Image Wrapper */}
      <div className="aspect-[4/5] relative overflow-hidden bg-brand-silver/5">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-brand-darkgrey/40 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all flex items-center justify-center gap-3">
          <Link to={`/product/${id}`}>
            <Button variant="outline" size="icon" className="rounded-full bg-white text-brand-darkgrey">
              <Eye size={20} />
            </Button>
          </Link>
          <Button 
            onClick={handleQuickAdd}
            size="icon" 
            className="rounded-full"
          >
            <ShoppingBag size={20} />
          </Button>
        </div>

        {/* Brand Tag */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full bg-brand-darkgrey/80 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
            {brand}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-2">
        <Link to={`/product/${id}`}>
          <h3 className="text-white font-black text-lg uppercase tracking-tighter leading-tight group-hover:text-brand-red transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-2xl font-black text-white italic">
          {formatPrice(price)}
        </p>
      </div>
    </motion.div>
  );
}
