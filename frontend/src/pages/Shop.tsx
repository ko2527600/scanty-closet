import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterSidebar } from '../components/shop/FilterSidebar';
import { SortDropdown } from '../components/shop/SortDropdown';
import { ProductCard } from '../components/products/ProductCard';
import { ShoppingBag, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../components/ui/Button';

// Mock data for initial UI building
const MOCK_PRODUCTS = [
  { id: '1', name: 'Air Force 1 Premium', brand: 'Nike', category: 'Lifestyle', price: 150, image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop' },
  { id: '2', name: 'Ultra Boost 5.0', brand: 'Adidas', category: 'Running', price: 180, image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=2031&auto=format&fit=crop' },
  { id: '3', name: 'Classic Leather G', brand: 'Reebok', category: 'Classic', price: 120, image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=2071&auto=format&fit=crop' },
  { id: '4', name: 'Court Legacy SE', brand: 'Nike', category: 'Lifestyle', price: 95, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop' },
  { id: '5', name: 'NMD_R1 V2', brand: 'Adidas', category: 'Modern', price: 140, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop' },
  { id: '6', name: 'Air Jordan 1 Low', brand: 'Nike', category: 'Culture', price: 110, image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1974&auto=format&fit=crop' },
];

const FILTERS = {
  brands: ['Nike', 'Adidas', 'Reebok', 'Puma', 'New Balance'],
  categories: ['Lifestyle', 'Running', 'Classic', 'Modern', 'Culture'],
  sizes: ['7', '8', '9', '10', '11', '12'],
  colors: ['Red', 'Green', 'Black', 'White', 'Silver'],
};

export function Shop() {
  const [search, setSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<any>({
    brand: [],
    category: [],
    size: [],
  });
  const [sort, setSort] = useState('relevance');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleFilterChange = (type: string, value: string) => {
    setSelectedFilters((prev: any) => {
      const current = prev[type as keyof typeof prev] || [];
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter((v: string) => v !== value) };
      }
      return { ...prev, [type]: [...current, value] };
    });
  };

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.brand.toLowerCase().includes(search.toLowerCase());
      const matchesBrand = selectedFilters.brand.length === 0 || selectedFilters.brand.includes(p.brand);
      const matchesCategory = selectedFilters.category.length === 0 || selectedFilters.category.includes(p.category);
      
      return matchesSearch && matchesBrand && matchesCategory;
    }).sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      return 0; // relevance
    });
  }, [search, selectedFilters, sort]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-12 border-b border-white/5">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-brand-red font-black uppercase tracking-widest text-xs italic">
            <ShoppingBag size={16} />
            <span>Discover & Shop</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none">
            The <br/> <span className="text-brand-silver/20 decoration-brand-red underline underline-offset-8 decoration-4 font-black">Collection.</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <SortDropdown currentSort={sort} onSortChange={setSort} />
          <Button 
            variant="outline" 
            className="lg:hidden h-12 px-6 rounded-xl border-white/10"
            onClick={() => setIsSidebarOpen(true)}
          >
            <SlidersHorizontal size={18} className="mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar for Desktop */}
         <div className="hidden lg:block">
            <FilterSidebar 
              filters={FILTERS} 
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onSearchChange={setSearch}
              onClearFilters={() => setSelectedFilters({ brand: [], category: [], size: [] })}
            />
         </div>

         {/* Mobile Sidebar Overlay */}
         <AnimatePresence>
           {isSidebarOpen && (
             <div className="fixed inset-0 z-[100] lg:hidden">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute inset-0 bg-brand-darkgrey/80 backdrop-blur-xl"
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="absolute right-0 top-0 bottom-0 w-80 bg-brand-darkgrey border-l border-white/5 p-8 overflow-y-auto"
                >
                   <div className="flex items-center justify-between mb-8">
                     <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Filters</h2>
                     <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                        <X size={24} className="text-brand-silver" />
                     </Button>
                   </div>
                   <FilterSidebar 
                    filters={FILTERS} 
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                    onSearchChange={setSearch}
                    onClearFilters={() => setSelectedFilters({ brand: [], category: [], size: [] })}
                  />
                </motion.div>
             </div>
           )}
         </AnimatePresence>

         {/* Product Grid */}
         <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30 italic">
                 Showing {filteredProducts.length} Premium Pieces
               </p>
               {filteredProducts.length === 0 && (
                 <p className="text-brand-red text-sm font-black italic">No matches found for your criteria.</p>
               )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
               {filteredProducts.map((product) => (
                 <ProductCard key={product.id} {...product} />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
