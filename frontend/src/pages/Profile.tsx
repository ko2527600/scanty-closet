import { useState } from 'react';
import { User, MapPin, Phone, Mail, LogOut } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { formatPrice } from '../lib/utils';
import api from '../lib/axios';

interface Order {
  id: string;
  order_date: string;
  total_amount: string | number;
  status: string;
  order_items: { id: string }[];
}

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'error' | 'primary'> = {
  DELIVERED: 'success',
  SHIPPED: 'primary',
  PROCESSING: 'warning',
  PENDING: 'warning',
  CANCELLED: 'error',
};

export function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders/my-orders');
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center space-y-8">
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Please login to view your profile.</h1>
        <Button size="lg" onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-brand-red font-black uppercase tracking-widest text-xs italic">
            <User size={16} />
            <span>Welcome, {user.firstName}</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none">
            Your <br /> <span className="text-brand-silver/20 decoration-brand-red underline underline-offset-8 decoration-4 font-black italic">Closet.</span>
          </h1>
        </div>

        <Button variant="outline" className="h-14 px-8 rounded-2xl group/btn" onClick={() => { logout(); navigate('/'); }}>
          <LogOut className="mr-2 group-hover:text-brand-red transition-colors" />
          Logout Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        {/* Left: Info Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8 backdrop-blur-xl">
            <div className="w-24 h-24 bg-brand-red rounded-3xl flex items-center justify-center rotate-3 mx-auto">
              <span className="text-white font-black text-4xl italic">{user.firstName[0]}</span>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{user.firstName} {user.lastName}</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30">
                {user.role === 'ADMIN' ? 'Store Admin' : 'Premium Collector'}
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-white/5 text-brand-silver/50">
              <div className="flex items-center space-x-4">
                <Mail size={16} className="text-brand-red" />
                <span className="text-sm font-semibold">{user.email}</span>
              </div>
              <div className="flex items-center space-x-4">
                <Phone size={16} className="text-brand-red" />
                <span className="text-sm font-semibold">0245060754</span>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin size={16} className="text-brand-red" />
                <span className="text-sm font-semibold">Accra, Ghana</span>
              </div>
            </div>

            {user.role === 'ADMIN' && (
              <Button className="w-full" onClick={() => navigate('/admin')}>
                Admin Dashboard
              </Button>
            )}
          </div>
        </div>

        {/* Right: Tabs */}
        <div className="lg:col-span-3 space-y-12">
          <div className="flex items-center space-x-12 border-b border-white/5 pb-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`text-2xl font-black uppercase italic tracking-tighter transition-all 
                ${activeTab === 'orders' ? 'text-brand-red scale-110' : 'text-brand-silver/20 hover:text-brand-silver/50'}`}
            >
              Order History
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`text-2xl font-black uppercase italic tracking-tighter transition-all 
                ${activeTab === 'settings' ? 'text-brand-red scale-110' : 'text-brand-silver/20 hover:text-brand-silver/50'}`}
            >
              Settings
            </button>
          </div>

          {activeTab === 'orders' ? (
            <div className="space-y-8">
              {ordersLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : orders && orders.length > 0 ? (
                <Table headers={['Order ID', 'Date', 'Total', 'Items', 'Status']}>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-black italic text-brand-red text-xs">
                        {order.id.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell className="text-white/50">
                        {new Date(order.order_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-black text-white">
                        {formatPrice(Number(order.total_amount))}
                      </TableCell>
                      <TableCell className="text-white/50">
                        x{order.order_items.length}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[order.status] ?? 'warning'}>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </Table>
              ) : (
                <div className="py-24 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto text-brand-silver/20">
                    <User size={36} />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white/30">No orders yet.</h3>
                  <p className="text-brand-silver/30 text-sm">Your order history will appear here once you make a purchase.</p>
                  <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 max-w-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-silver/30 italic">Update Profile Details</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-brand-silver/30">First Name</label>
                    <div className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 font-bold text-white">{user.firstName}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-brand-silver/30">Last Name</label>
                    <div className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 font-bold text-white">{user.lastName}</div>
                  </div>
                </div>
                <Button variant="outline">Update My Info</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
