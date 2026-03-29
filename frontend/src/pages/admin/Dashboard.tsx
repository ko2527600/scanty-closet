import { TrendingUp, Users, ShoppingBag, Package } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

interface Order {
  total_amount: string;
}

interface Product {
  id: string;
}

export function Dashboard() {
  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders');
      return data;
    },
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data } = await api.get('/products');
      return data;
    },
  });

  const isLoading = ordersLoading || productsLoading;

  const totalRevenue = orders?.reduce((acc, order) => acc + parseFloat(order.total_amount), 0) || 0;
  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Unique Customers', value: '...', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Active Products', value: totalProducts.toString(), icon: Package, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest text-[10px]">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">
                {isLoading ? '...' : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 italic">
             <span className="w-1.5 h-6 bg-red-500 rounded-full" />
             Sales Overview
          </h3>
          <div className="h-full flex items-center justify-center text-slate-300 italic text-sm font-medium tracking-widest uppercase">
            Data Visualization Engine Warming Up...
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 italic">
             <span className="w-1.5 h-6 bg-red-500 rounded-full" />
             Recent Activity
          </h3>
          <div className="space-y-4">
             {orders?.slice(0, 5).map(order => (
               <div key={order.total_amount} className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0 group hover:translate-x-1 transition-transform">
                 <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                 <div>
                   <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">New sale: ${order.total_amount}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Order #{order.total_amount.slice(-4)}</p>
                 </div>
               </div>
             ))}
             {(!orders || orders.length === 0) && !isLoading && (
               <p className="text-sm text-slate-400 italic">No recent activity found.</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

