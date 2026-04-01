import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import api from '../../lib/axios';

interface Category {
  id: string;
  name: string;
  _count?: {
    products: number;
  };
}

export function CategoryManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  const queryClient = useQueryClient();

  // Fetch Categories
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });

  // Create Category
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      return api.post('/categories', { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setNewName('');
      setIsAdding(false);
      toast.success('Category created successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error ?? 'Failed to create category.');
    }
  });

  // Update Category
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string, name: string }) => {
      return api.patch(`/categories/${id}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setEditingId(null);
      toast.success('Category updated!');
    }
  });

  // Delete Category
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category removed.');
    }
  });

  const filteredCategories = categories?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createMutation.mutate(newName);
  };

  const handleUpdate = (id: string) => {
    if (!editName.trim()) return;
    updateMutation.mutate({ id, name: editName });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
            Category <span className="text-brand-silver/20 italic">Manager.</span>
          </h1>
          <p className="text-slate-400 mt-2">Organize your shop structure and product collections.</p>
        </div>
        <Button 
          onClick={() => setIsAdding(true)} 
          className="h-12 px-6 rounded-xl group"
          disabled={isAdding}
        >
          <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" />
          New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Management List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search collections..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/30 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-6">Collection Name</th>
                  <th className="px-8 py-6">Products</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoading ? (
                  <tr><td colSpan={3} className="px-8 py-12 text-center text-slate-600 italic">Syncing with server...</td></tr>
                ) : filteredCategories?.length === 0 ? (
                  <tr><td colSpan={3} className="px-8 py-12 text-center text-slate-600 italic">No collections found.</td></tr>
                ) : filteredCategories?.map((cat) => (
                  <tr key={cat.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6">
                      {editingId === cat.id ? (
                        <div className="flex items-center gap-2">
                           <input 
                            autoFocus
                            className="bg-slate-950 border border-red-500/50 rounded-lg px-3 py-1 text-white text-sm"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdate(cat.id)}
                           />
                           <button onClick={() => handleUpdate(cat.id)} className="text-green-500 hover:scale-110 transition-transform">
                             <CheckCircle2 size={18} />
                           </button>
                           <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-white">
                             <X size={18} />
                           </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 bg-red-500 rounded-full" />
                           <span className="font-black text-white italic uppercase tracking-tight">{cat.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-bold text-slate-400">{cat._count?.products || 0} Items</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm(`Delete "${cat.name}"? This will only work if there are no products in it.`)) {
                                deleteMutation.mutate(cat.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Add / Help */}
        <div className="space-y-8">
           {isAdding && (
             <div className="bg-red-500 p-8 rounded-[2.5rem] shadow-2xl shadow-red-500/20 space-y-6">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Quick Add</h3>
                <form className="space-y-4" onSubmit={handleCreate}>
                   <Input 
                    label="Collection Title" 
                    placeholder="e.g. Basketball" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/30"
                   />
                   <div className="flex gap-2">
                     <Button type="submit" variant="outline" className="flex-1 bg-white text-red-500 border-none hover:bg-white/90">
                        {createMutation.isPending ? <Loader2 className="animate-spin" /> : 'Confirm'}
                     </Button>
                     <Button type="button" variant="ghost" className="text-white hover:bg-white/10" onClick={() => setIsAdding(false)}>
                        <X size={18} />
                     </Button>
                   </div>
                </form>
             </div>
           )}

           <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-red-500">
                 <AlertCircle size={24} />
              </div>
              <div className="space-y-2">
                 <h4 className="text-lg font-bold text-white uppercase italic tracking-tight">Best Practices</h4>
                 <p className="text-sm text-slate-400 leading-relaxed">
                    Categories help customers find products faster. We recommend keep names short (1-2 words) like "Active" or "Lifestyle".
                 </p>
              </div>
              <ul className="space-y-3 pt-4 border-t border-slate-800">
                 <li className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    Max 12 categories for best UI
                 </li>
                 <li className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    Avoid punctuation in titles
                 </li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
