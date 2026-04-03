import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { Menu, X } from 'lucide-react';

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50 flex items-center px-4 justify-between">
         <h2 className="text-xl font-bold tracking-tighter text-red-500 uppercase">
            Scanty Admin
         </h2>
         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-900">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
           className="md:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" 
           onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 w-full max-w-[100vw]">
        <div className="max-w-7xl mx-auto backdrop-blur-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
