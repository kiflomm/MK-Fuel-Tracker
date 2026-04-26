import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-white font-['Public_Sans']">
      
      {/* Left Visual Panel */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-neutral-900 to-neutral-800 overflow-hidden flex-col justify-between p-12 xl:p-16">
        {/* Background blobs & patterns */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] -ml-48 -mb-48 pointer-events-none"></div>
        
        {/* Top brand */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl">
            <span className="material-symbols-outlined text-yellow-500 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield_person
            </span>
          </div>
          <div>
            <h2 className="text-white font-black tracking-[0.2em] uppercase text-sm">GovPortal</h2>
            <p className="text-yellow-500/50 text-[10px] font-bold uppercase tracking-[0.3em]">Mekelle Fuel Tracker</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 max-w-xl">
          <h1 className="text-5xl xl:text-7xl font-black text-white tracking-tighter leading-[1.05] mb-8">
            Secure.<br/>
            Efficient.<br/>
            Intelligent.
          </h1>
          <p className="text-lg xl:text-xl text-white/60 font-medium leading-relaxed mb-10 max-w-md">
            The next generation fuel monitoring and distribution portal for authenticated officials and station managers.
          </p>
          <div className="flex items-center gap-4">
            <div className="h-1 w-12 bg-yellow-500 rounded-full"></div>
            <span className="text-yellow-500/40 text-[10px] uppercase tracking-[0.3em] font-black">Authorized Access Only</span>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col relative bg-neutral-50 shadow-[-20px_0_40px_-15px_rgba(0,0,0,0.1)] z-20">
        <div className="absolute top-6 left-6 lg:top-8 lg:left-8">
          <Button variant="ghost" size="sm" asChild className="text-neutral-500 hover:text-black hover:bg-neutral-200/50 font-label-caps text-[10px] tracking-widest uppercase gap-2 transition-all hover:-translate-x-1 font-bold rounded-full h-8 px-4">
            <Link href="/">
              <Home className="size-3.5" />
              <span>Portal Home</span>
            </Link>
          </Button>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-[400px]">
            {children}
          </div>
        </div>
      </div>
      
    </div>
  );
}
