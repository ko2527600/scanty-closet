import { Navbar } from './Navbar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-darkgrey">
      <Navbar />
      <main className="pt-20">
        {children}
      </main>
      <footer className="bg-brand-darkgrey border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center rotate-3">
              <span className="text-white font-black text-sm italic">S</span>
            </div>
            <span className="text-white font-black uppercase tracking-tighter text-lg">Scanty's Closet</span>
          </div>
          <p className="text-brand-silver/30 text-xs italic tracking-widest font-medium uppercase">
            "Punctuality is the soul of business"
          </p>
          <div className="text-brand-silver/20 text-[10px] uppercase font-bold tracking-widest pt-4">
            © 2026 Scanty's Closet. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
