import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  ChevronRight,
  Boxes,
  MessageSquare,
  LayoutGrid
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { cn } from '../../lib/utils';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { id: 'products', label: 'Products', icon: Package, path: '/admin/products' },
  { id: 'categories', label: 'Categories', icon: LayoutGrid, path: '/admin/categories' },
  { id: 'inventory', label: 'Inventory', icon: Boxes, path: '/admin/inventory' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/admin/messages' },
];

export function AdminSidebar() {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tighter text-red-500 uppercase">
          Scanty Admin
        </h2>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium",
                isActive 
                  ? "bg-red-500 text-white" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                {item.label}
              </div>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link 
          to="/profile"
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors"
        >
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
