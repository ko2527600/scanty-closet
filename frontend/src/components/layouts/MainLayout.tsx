import { Navbar } from './Navbar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-darkgrey flex flex-col">
      <Navbar />
      <main className="pt-20 flex-grow">
        {children}
      </main>
      <footer className="bg-brand-darkgrey border-t border-white/5 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center rotate-3">
              <span className="text-white font-black text-sm italic">S</span>
            </div>
            <span className="text-white font-black uppercase tracking-tighter text-lg">Scanty's Closet</span>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center items-center gap-6 pt-2">
            <a 
              href="https://instagram.com/scantycloset" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-brand-silver/50 hover:text-brand-red transition-all duration-300 flex items-center space-x-2 group hover:-translate-y-1"
            >
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-brand-red/10">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <span className="text-xs font-medium uppercase tracking-widest">scantycloset</span>
            </a>
            
            <a 
              href="https://facebook.com/scantycloset" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-brand-silver/50 hover:text-[#1877F2] transition-all duration-300 flex items-center space-x-2 group hover:-translate-y-1"
            >
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#1877F2]/10">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </div>
              <span className="text-xs font-medium uppercase tracking-widest">scantycloset</span>
            </a>

            <a 
              href="https://snapchat.com/add/enapaye1" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-brand-silver/50 hover:text-[#FFFC00] transition-all duration-300 flex items-center space-x-2 group hover:-translate-y-1"
            >
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#FFFC00]/10">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                 <path d="M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"></path>
                </svg>
              </div>
              <span className="text-xs font-medium uppercase tracking-widest">@enapaye1</span>
            </a>
          </div>

          <p className="text-brand-silver/30 text-xs italic tracking-widest font-medium uppercase pt-2">
            "Punctuality is the soul of business"
          </p>
          <div className="text-brand-silver/20 text-[10px] uppercase font-bold tracking-widest">
            © {new Date().getFullYear()} Scanty's Closet. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
