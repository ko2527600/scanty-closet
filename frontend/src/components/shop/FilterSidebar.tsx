import { Search, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface FilterSidebarProps {
  filters: {
    brands: string[];
    categories: string[];
    sizes: string[];
    colors: string[];
  };
  selectedFilters: any;
  onFilterChange: (type: string, value: string) => void;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
}

export function FilterSidebar({ 
  filters, 
  selectedFilters, 
  onFilterChange, 
  onSearchChange,
  onClearFilters 
}: FilterSidebarProps) {
  return (
    <div className="space-y-10 w-full lg:w-72 shrink-0">
      {/* Search */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30 italic">Search</h3>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-silver/30 group-focus-within:text-brand-red transition-colors" size={18} />
          <Input 
            placeholder="Search sneakers..." 
            className="pl-12" 
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Brand Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30 italic">Brands</h3>
          <button onClick={onClearFilters} className="text-[9px] font-black uppercase tracking-widest text-brand-red hover:underline">Clear</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.brands.map((brand) => (
            <button
              key={brand}
              onClick={() => onFilterChange('brand', brand)}
              className="group"
            >
              <Badge 
                variant={selectedFilters.brand.includes(brand) ? 'primary' : 'secondary'}
                className="cursor-pointer transition-all hover:border-brand-red/50 py-2 px-4 rounded-xl"
              >
                {brand}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30 italic">Categories</h3>
        <div className="space-y-2">
          {filters.categories.map((cat) => (
            <label key={cat} className="flex items-center space-x-3 group cursor-pointer">
              <div 
                onClick={() => onFilterChange('category', cat)}
                className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center
                  ${selectedFilters.category.includes(cat) 
                    ? 'border-brand-red bg-brand-red' 
                    : 'border-white/10 bg-white/5 group-hover:border-white/20'}`}
              >
                {selectedFilters.category.includes(cat) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <span className={`text-sm font-semibold transition-colors uppercase tracking-tight
                ${selectedFilters.category.includes(cat) ? 'text-white' : 'text-brand-silver/50 group-hover:text-brand-silver'}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

       {/* Size Filter */}
       <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30 italic">Sizes</h3>
        <div className="grid grid-cols-4 gap-2">
          {filters.sizes.map((size) => (
            <button
              key={size}
              onClick={() => onFilterChange('size', size)}
              className={`h-10 rounded-xl border-2 text-xs font-black transition-all flex items-center justify-center
                ${selectedFilters.size.includes(size) 
                  ? 'border-brand-red bg-brand-red text-white' 
                  : 'border-white/10 bg-white/5 text-brand-silver/50 hover:border-white/20'}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedFilters.brand.length > 0 || selectedFilters.category.length > 0 || selectedFilters.size.length > 0) && (
        <div className="pt-6 border-t border-white/5 space-y-4">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30 italic">Active Filters</h3>
           <div className="flex flex-wrap gap-2">
             {[...selectedFilters.brand, ...selectedFilters.category, ...selectedFilters.size].map((f) => (
               <Badge key={f} variant="outline" className="flex items-center gap-2 py-1.5 px-3">
                 {f}
                 <X size={10} className="text-brand-red cursor-pointer" />
               </Badge>
             ))}
           </div>
        </div>
      )}
    </div>
  );
}
