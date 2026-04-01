import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { FilterSidebar } from '../components/shop/FilterSidebar';
import { SortDropdown } from '../components/shop/SortDropdown';
import { ProductCard } from '../components/products/ProductCard';
import { ShoppingBag, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../lib/axios';

const FILTERS = {
  brands: ['Nike', 'Adidas', 'Reebok', 'Puma', 'New Balance'],
  categories: ['Lifestyle', 'Running', 'Classic', 'Modern', 'Culture'],
  sizes: ['7', '8', '9', '10', '11', '12'],
  colors: ['Red', 'Green', 'Black', 'White', 'Silver'],
};

interface Product {
  id: string;
  name: string;
  brand: string;
  price: string | number;
  category: { name: string } | null;
  variants: { image_urls: string[] }[];
}

export function Shop() {
  const [searchParams] = useSearchParams();
  const initialSort = searchParams.get('sort') || 'relevance';

  const [search, setSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<any>({
    brand: [],
    category: [],
    size: [],
  });
  const [sort, setSort] = useState(initialSort);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get('/products');
      return data;
    },
  });

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
    if (!products) return [];
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase());
        const matchesBrand =
          selectedFilters.brand.length === 0 || selectedFilters.brand.includes(p.brand);
        const matchesCategory =
          selectedFilters.category.length === 0 ||
          selectedFilters.category.includes(p.category?.name || '');
        return matchesSearch && matchesBrand && matchesCategory;
      })
      .sort((a, b) => {
        if (sort === 'price_asc') return Number(a.price) - Number(b.price);
        if (sort === 'price_desc') return Number(b.price) - Number(a.price);
        return 0;
      });
  }, [products, search, selectedFilters, sort]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 space-y-12">
      <Helmet>
        <title>The Shop | Scanty's Closet - Discover Exclusive Heat</title>
        <meta name="description" content="Browse our curated collection of premium sneakers. Filter by brand, size, and color to find your next pair." />
        <meta property="og:title" content="Shop Premium Sneakers | Scanty's Closet" />
        <meta property="og:description" content="Discover the latest drops and timeless classics. Shop our full collection now." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-12 border-b border-white/5">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-brand-red font-black uppercase tracking-widest text-xs italic">
            <ShoppingBag size={16} />
            <span>Discover &amp; Shop</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none">
            The <br /> <span className="text-brand-silver/20 decoration-brand-red underline underline-offset-8 decoration-4 font-black">Collection.</span>
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
        <div className="hidden lg:block">
          <FilterSidebar
            filters={FILTERS}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onSearchChange={setSearch}
            onClearFilters={() => setSelectedFilters({ brand: [], category: [], size: [] })}
          />
        </div>

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

        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30 italic">
              {isLoading ? 'Loading collection...' : `Showing ${filteredProducts.length} Premium Pieces`}
            </p>
            {!isLoading && filteredProducts.length === 0 && products && products.length > 0 && (
              <p className="text-brand-red text-sm font-black italic">No matches found for your criteria.</p>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-[2rem] bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 && products?.length === 0 ? (
            <div className="py-32 text-center space-y-4">
              <ShoppingBag size={48} className="mx-auto text-brand-silver/20" />
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white/30">No products yet.</h3>
              <p className="text-brand-silver/30 text-sm">The admin hasn't added any products to the catalog yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
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
        </div>
      </div>
    </div>
  );
}
