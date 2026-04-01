import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, Trash2, ArrowLeft, Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/axios';

interface Category { id: string; name: string; }

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

// ─── Image Uploader Component ────────────────────────────────────────────────
function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append('images', f));
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange([...images, ...(data.urls as string[])]);
      toast.success(`${data.urls.length} image(s) uploaded successfully!`);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? (err as any).response?.data?.error ?? 'Upload failed.'
        : 'Upload failed.';
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    onChange(images.filter((u) => u !== url));
  };

  return (
    <div className="space-y-4">
      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((url) => (
            <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-red-400 hover:bg-red-50/50 transition-all"
      >
        {uploading ? (
          <>
            <Loader2 size={28} className="text-red-500 animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Uploading to Cloudinary...</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <Upload size={22} className="text-red-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">Drop images here or click to browse</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP — Max 10MB each</p>
            </div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

// ─── Main ProductEditor ───────────────────────────────────────────────────────
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
    variants: [{ size: '', color: '', sku: '', stock_quantity: 0, image_urls: [] }],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        brand: product.brand,
        price: product.price.toString(),
        categoryId: product.category_id || '',
        variants:
          product.variants.length > 0
            ? product.variants
            : [{ size: '', color: '', sku: '', stock_quantity: 0, image_urls: [] }],
      });
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      if (id) return api.put(`/products/${id}`, data);
      return api.post('/products', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(id ? 'Product updated!' : 'Product created!');
      navigate('/admin/products');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error ?? 'Failed to save product.');
    },
  });

  const handleVariantChange = (index: number, field: keyof Variant, value: unknown) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index]!, [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: '', color: '', sku: '', stock_quantity: 0, image_urls: [] }],
    });
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length === 1) return;
    setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== index) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.variants.some((v) => !v.size || !v.color || !v.sku)) {
      toast.error('Please fill in Size, Color, and SKU for every variant.');
      return;
    }
    mutation.mutate(formData);
  };

  if (id && isLoading)
    return (
      <div className="p-12 text-center text-slate-400 italic animate-pulse">
        Loading product...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Sticky Header */}
      <div className="flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-10 border-b border-slate-200 -mx-8 px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight italic">
            {id ? 'Edit Product' : 'Add New Product'}
          </h1>
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
            {mutation.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
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
            {[
              { label: 'Product Name', key: 'name', placeholder: 'e.g. Air Force 1 Premium', span: false },
              { label: 'Brand', key: 'brand', placeholder: 'e.g. Nike', span: false },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</label>
                <input
                  required
                  placeholder={placeholder}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-500/20 transition-all text-sm"
                  value={(formData as any)[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                />
              </div>
            ))}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Category</label>
                <Link to="/admin/categories" className="text-[10px] font-black uppercase text-red-500 hover:underline">Manage</Link>
              </div>
              <select
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-500/20 transition-all text-sm appearance-none"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Base Price (GHS)</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-500/20 transition-all text-sm"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</label>
            <textarea
              required
              rows={4}
              placeholder="Describe this product..."
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-500/20 transition-all text-sm resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 italic">
              <span className="w-1.5 h-6 bg-red-500 rounded-full" />
              Variants &amp; Images
            </h3>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-lg transition-all border border-red-100"
            >
              <Plus size={14} /> Add Variant
            </button>
          </div>

          <div className="space-y-8">
            {formData.variants.map((variant, index) => (
              <div
                key={index}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6 relative"
              >
                {/* Variant Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Variant #{index + 1}
                  </span>
                  {formData.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Fields */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Size', key: 'size', placeholder: 'e.g. 42 / L' },
                    { label: 'Color', key: 'color', placeholder: 'e.g. Red' },
                    { label: 'SKU', key: 'sku', placeholder: 'Unique SKU' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key} className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</label>
                      <input
                        required
                        placeholder={placeholder}
                        className={`w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs ${key === 'sku' ? 'font-mono' : ''}`}
                        value={(variant as any)[key]}
                        onChange={(e) => handleVariantChange(index, key as keyof Variant, e.target.value)}
                      />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Stock Qty</label>
                    <input
                      required
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs"
                      value={variant.stock_quantity}
                      onChange={(e) =>
                        handleVariantChange(index, 'stock_quantity', parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                    <ImageIcon size={14} />
                    <span>Product Images for this Variant</span>
                  </div>
                  <ImageUploader
                    images={variant.image_urls}
                    onChange={(urls) => handleVariantChange(index, 'image_urls', urls)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
