import Link from "next/link";
import { ProtectedAppGate } from "@/components/auth/protected-app-gate";
import { LogoutButton } from "@/components/auth/logout-button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedAppGate>
      <div className="flex min-h-screen flex-col bg-background-landing relative font-['Public_Sans']">
        {/* Background Patterns — scoped to avoid bleeding outside the page */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute inset-0 tilfi-pattern opacity-5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/5 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full -ml-48 -mb-48 blur-3xl" />
        </div>

        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b-4 border-yellow-600/20 shadow-sm transition-all duration-300">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 h-20">
            <Link href="/app" className="flex items-center gap-3 group transition-transform active:scale-95">
              <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-500 text-3xl group-hover:rotate-12 transition-transform">
                energy_savings_leaf
              </span>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tighter text-neutral-900 dark:text-white uppercase leading-none">
                  Mekelle
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-yellow-700 dark:text-yellow-500 uppercase leading-none mt-1.5">
                  Fuel Tracker
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-6 mr-6 border-r border-outline/10 pr-6">
                <Link href="/app" className="text-xs font-semibold uppercase tracking-widest text-primary hover:text-surface-tint transition-colors">
                  Dashboard
                </Link>
              </nav>
              <LogoutButton />
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-1 px-6 py-10 relative z-10">
          {children}
        </main>

        <footer className="w-full py-8 mt-auto border-t border-outline/10 bg-surface-container-lowest/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              © 2026 GC Software Engineering • Mekelle Fuel Tracker
            </p>
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-8 bg-neutral-300"></div>
              <span className="material-symbols-outlined text-xs text-neutral-300" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
              <div className="h-[1px] w-8 bg-neutral-300"></div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedAppGate>
  );
}
