import { Search, FileText, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

interface Order {
  id: string;
  total_amount: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  order_date: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const STATUS_COLORS = {
  PENDING: 'bg-slate-100 text-slate-600',
  PROCESSING: 'bg-blue-50 text-blue-600',
  SHIPPED: 'bg-indigo-50 text-indigo-600',
  DELIVERED: 'bg-emerald-50 text-emerald-600',
  CANCELLED: 'bg-red-50 text-red-600',
};

export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders');
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await api.put(`/orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  const filteredOrders = orders?.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${o.user.first_name} ${o.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic">Order Management</h1>
        <p className="text-slate-500 mt-1">View and process customer orders system-wide.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by order ID, customer name..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 italic">Tracking orders...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Date Placed</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders?.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group text-sm font-medium">
                    <td className="px-6 py-4 text-red-500 font-bold tracking-tighter">
                       #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                             <UserIcon size={12} />
                          </div>
                          <span className="text-slate-900">{order.user.first_name} {order.user.last_name}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border-0 cursor-pointer focus:ring-0 ${STATUS_COLORS[order.status]}`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-black tracking-tight">${order.total_amount}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                       {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-100 flex items-center gap-2">
                            <FileText size={14} />
                            Details
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                       No orders found.
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
