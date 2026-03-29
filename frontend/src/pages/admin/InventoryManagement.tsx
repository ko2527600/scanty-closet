import { Search, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, Package as PackageIcon } from 'lucide-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

interface Variant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  sku: string;
  stock_quantity: number;
  product: {
    name: string;
    brand: string;
  };
}

export function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery<any[]>({
    queryKey: ['inventory-products'],
    queryFn: async () => {
      const { data } = await api.get('/products');
      return data;
    },
  });

  const variants: Variant[] = products?.flatMap(p => 
    p.variants.map((v: any) => ({ ...v, product: { name: p.name, brand: p.brand } }))
  ) || [];

  const updateStockMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string, quantity: number }) => {
      await api.put(`/variants/${id}`, { stockQuantity: quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
    },
  });

  const filteredVariants = variants.filter(v => 
    v.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = variants.filter(v => v.stock_quantity > 0 && v.stock_quantity <= 5).length;
  const outOfStockCount = variants.filter(v => v.stock_quantity === 0).length;

  const handleQuickAdd = (variant: Variant) => {
    updateStockMutation.mutate({ id: variant.id, quantity: variant.stock_quantity + 10 });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic">Inventory Tracking</h1>
          <p className="text-slate-500 mt-1">Monitor stock levels and manage variants.</p>
        </div>
        <div className="flex gap-4">
          <button 
             onClick={() => queryClient.invalidateQueries({ queryKey: ['inventory-products'] })}
             className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            <span>Sync Stock</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-red-100/50 rounded-xl text-red-600 font-bold">
             <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-red-600 uppercase tracking-widest text-[10px]">Low Stock Alert</p>
            <p className="text-2xl font-black text-slate-900">{lowStockCount}</p>
          </div>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-emerald-100/50 rounded-xl text-emerald-600 font-bold">
             <ArrowUpRight size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-600 uppercase tracking-widest text-[10px]">Total Variants</p>
            <p className="text-2xl font-black text-slate-900">{variants.length}</p>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-white/10 rounded-xl text-white font-bold">
             <ArrowDownRight size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-white/50 uppercase tracking-widest text-[10px]">Out of Stock</p>
            <p className="text-2xl font-black text-white">{outOfStockCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search variants, SKUs..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 italic">Finding variants...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                  <th className="px-6 py-4">Variant Info</th>
                  <th className="px-6 py-4">SKU Code</th>
                  <th className="px-6 py-4">Current Stock</th>
                  <th className="px-6 py-4">Stock Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {filteredVariants.map(variant => (
                   <tr key={variant.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0 flex items-center justify-center text-slate-400">
                           <PackageIcon size={20} />
                         </div>
                         <div>
                           <p className="text-sm font-black text-slate-900 tracking-tight">{variant.product.name}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                             {variant.size} / {variant.color}
                           </p>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4 font-mono text-xs text-slate-500">{variant.sku}</td>
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                         <span className={cn(
                           "text-xl font-black",
                           variant.stock_quantity === 0 ? "text-red-500" : "text-slate-900"
                         )}>
                           {variant.stock_quantity}
                         </span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">units</span>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                        {variant.stock_quantity === 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-black tracking-widest uppercase shadow-lg shadow-slate-200">OUT</span>
                        ) : variant.stock_quantity <= 5 ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black tracking-widest uppercase shadow-lg shadow-red-200">LOW</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black tracking-widest uppercase shadow-lg shadow-emerald-200">OK</span>
                        )}
                     </td>
                     <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => handleQuickAdd(variant)}
                         disabled={updateStockMutation.isPending}
                         className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-100 disabled:opacity-50"
                       >
                          Add 10
                       </button>
                     </td>
                   </tr>
                 ))}
                 {filteredVariants.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                      No variants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

