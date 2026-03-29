import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, X, Plus, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import api from '../../lib/axios';

interface Category {
  id: string;
  name: string;
}

interface Variant {
  id?: string;
  size: string;
  color: string;
  sku: string;
  stock_quantity: number;
  image_urls: string[];
}

interface ProductFormData {
  name: string;
  description: string;
  brand: string;
  price: string;
  categoryId: string;
  variants: Variant[];
}

export function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    brand: '',
    price: '',
    categoryId: '',
    variants: [{ size: '', color: '', sku: '', stock_quantity: 0, image_urls: [] }]
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    }
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        brand: product.brand,
        price: product.price.toString(),
        categoryId: product.category_id || '',
        variants: product.variants.length > 0 ? product.variants : [{ size: '', color: '', sku: '', stock_quantity: 0, image_urls: [] }]
      });
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      if (id) {
        return api.put(`/products/${id}`, data);
      } else {
        return api.post('/products', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      navigate('/admin/products');
    }
  });

  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index]!, [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: '', color: '', sku: '', stock_quantity: 0, image_urls: [] }]
    });
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length === 1) return;
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (id && isLoading) return <div className="p-12 text-center text-slate-400 italic">Loading product...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-10 border-b border-slate-200 -mx-8 px-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/products')}
            className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight italic">
              {id ? 'Edit Product' : 'Add New Product'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={() => navigate('/admin/products')}
             className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-semibold shadow-xl shadow-red-200 disabled:opacity-50"
          >
            <Save size={18} />
            {mutation.isPending ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 italic">
             <span className="w-1.5 h-6 bg-red-500 rounded-full" />
             Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Product Name</label>
              <input
                required
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-500/20 transition-all text-sm"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Brand</label>
              <input
                required
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-500/20 transition-all text-sm"
                value={formData.brand}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Category</label>
              <select
                required
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-500/20 transition-all text-sm appearance-none"
                value={formData.categoryId}
                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Base Price ($)</label>
              <input
                required
                type="number"
                step="0.01"
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-500/20 transition-all text-sm"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-500/20 transition-all text-sm resize-none"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 italic">
               <span className="w-1.5 h-6 bg-red-500 rounded-full" />
               Product Variants
            </h3>
            <button
              type="button"
              onClick={addVariant}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-lg transition-all border border-red-100"
            >
              Add Variant
            </button>
          </div>
          
          <div className="space-y-6">
            {formData.variants.map((variant, index) => (
              <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                {formData.variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Size</label>
                    <input
                      required
                      placeholder="e.g. Medium, 42"
                      className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs"
                      value={variant.size}
                      onChange={e => handleVariantChange(index, 'size', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Color</label>
                    <input
                      required
                      placeholder="e.g. Red, Matte Black"
                      className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs"
                      value={variant.color}
                      onChange={e => handleVariantChange(index, 'color', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">SKU</label>
                    <input
                      required
                      placeholder="Unique SKU"
                      className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs font-mono"
                      value={variant.sku}
                      onChange={e => handleVariantChange(index, 'sku', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Stock</label>
                    <input
                      required
                      type="number"
                      className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs"
                      value={variant.stock_quantity}
                      onChange={e => handleVariantChange(index, 'stock_quantity', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4">
                   <div className="w-16 h-16 rounded-lg bg-white border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                      <ImageIcon size={24} />
                   </div>
                   <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">Upload images for this variant</p>
                      <input 
                        type="text"
                        placeholder="Image URL (comma separated)"
                        className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs"
                        onChange={e => handleVariantChange(index, 'image_urls', e.target.value.split(',').map(s => s.trim()))}
                      />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
