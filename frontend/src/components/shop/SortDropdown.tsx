import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SortDropdownProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
}

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest Arrivals', value: 'newest' },
];

export function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 px-6 rounded-xl border border-white/10 bg-white/5 flex items-center space-x-3 text-sm font-semibold transition-all hover:border-white/20 group"
      >
        <span className="text-brand-silver/50 font-black uppercase tracking-widest text-[10px] italic">Sort By:</span>
        <span className="text-white uppercase tracking-tight">
          {SORT_OPTIONS.find((s) => s.value === currentSort)?.label || 'Relevance'}
        </span>
        <ChevronDown 
          size={16} 
          className={cn('text-brand-silver/50 transition-transform group-hover:text-brand-red', isOpen && 'rotate-180')} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-64 bg-brand-darkgrey border border-white/10 rounded-2xl shadow-2xl p-2 z-40 overflow-hidden backdrop-blur-xl"
          >
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full text-left px-5 py-3.5 rounded-xl text-sm font-bold transition-all uppercase tracking-tight',
                  currentSort === option.value 
                    ? 'bg-brand-red text-white' 
                    : 'text-brand-silver/50 hover:bg-white/5 hover:text-white'
                )}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
