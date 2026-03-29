import { Trash2, Plus, Minus } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import { useCartStore, type CartItem as CartItemType } from '../../store/cart';

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center space-x-4 py-6 border-b border-white/5 group">
      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/5 shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="text-sm font-black text-white uppercase tracking-tight truncate group-hover:text-brand-red transition-colors">
          {item.name}
        </h4>
        <p className="text-[10px] font-bold text-brand-silver/30 uppercase tracking-widest">
          {item.size} / {item.color}
        </p>
        <p className="text-sm font-black text-white italic">
          {formatPrice(item.price)}
        </p>
      </div>

      <div className="flex flex-col items-end space-y-3">
        <button 
          onClick={() => removeItem(item.id)}
          className="text-brand-silver/30 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
        
        <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
          <button 
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            className="p-1 text-brand-silver hover:text-white transition-colors"
          >
            <Minus size={12} />
          </button>
          <span className="w-8 text-center text-xs font-black text-white">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-1 text-brand-silver hover:text-white transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
