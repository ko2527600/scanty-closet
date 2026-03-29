import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { MainLayout } from './components/layouts/MainLayout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { AdminLayout } from './components/layouts/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { ProductManagement } from './pages/admin/ProductManagement';
import { ProductEditor } from './pages/admin/ProductEditor';
import { InventoryManagement } from './pages/admin/InventoryManagement';
import { OrderManagement } from './pages/admin/OrderManagement';
import { Toaster } from 'sonner';

function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: 'CUSTOMER' | 'ADMIN' }) {
  const { token, user } = useAuthStore();
  
  if (!token) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/" />;
  
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" expand={false} richColors closeButton />
      <Routes>
        {/* Public/Customer Storefront Routes */}
        <Route element={<MainLayout><Outlet /></MainLayout>}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/new" element={<ProductEditor />} />
          <Route path="products/:id/edit" element={<ProductEditor />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
