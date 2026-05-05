"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/app/admin", label: "Dashboard", exact: true, icon: "dashboard", desc: "Overview & stats" },
  { href: "/app/admin/stations", label: "Stations", icon: "local_gas_station", desc: "Manage fuel stations" },
  { href: "/app/admin/users", label: "Users", icon: "manage_accounts", desc: "Managers & owners" },
  { href: "/app/admin/vehicle-categories", label: "Vehicle Categories", icon: "category", desc: "Dynamic category list" },
  { href: "/app/admin/fuel-types", label: "Fuel Types", icon: "local_gas_station", desc: "Manage fuel options & pricing" },
  { href: "/app/admin/reports", label: "Reports", icon: "assessment", desc: "Analytics & exports" },
  { href: "/app/admin/audit-logs", label: "Audit Logs", icon: "policy", desc: "System activity trail" },
];

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer on scroll
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    
    let isScrolling = false;
    const handleScroll = () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          setIsMobileMenuOpen(false);
          isScrolling = false;
        });
        isScrolling = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  return (
    <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-8 relative">
      
      {/* MOBILE HEADER TOGGLE */}
      <div className="lg:hidden w-full flex items-center justify-between bg-yellow-50/50 rounded-2xl p-4 border border-yellow-200/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-yellow-700 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
          <h2 className="text-xs font-black tracking-[0.2em] text-yellow-700 uppercase">Admin Menu</h2>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 bg-yellow-600/10 hover:bg-yellow-600/20 rounded-xl text-yellow-800 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">{isMobileMenuOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={cn(
        "shrink-0 transition-transform duration-300 z-50",
        // Desktop styles
        "lg:w-72 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:block lg:translate-x-0",
        // Mobile styles
        isMobileMenuOpen 
          ? "fixed inset-y-0 left-0 w-[280px] bg-white p-6 shadow-2xl h-[100dvh] top-0 overflow-y-auto overflow-x-hidden translate-x-0" 
          : "fixed inset-y-0 left-0 w-[280px] bg-white p-6 shadow-2xl h-[100dvh] top-0 overflow-y-auto overflow-x-hidden -translate-x-full lg:translate-x-0 lg:p-0 lg:shadow-none lg:bg-transparent"
      )}>
        {/* Sidebar Header */}
        <div className="mb-6 px-1 flex justify-between items-start lg:block">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-yellow-700 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
              <h2 className="text-xs font-black tracking-[0.2em] text-yellow-700 uppercase">Admin Control</h2>
            </div>
            <div className="h-0.5 bg-gradient-to-r from-yellow-600 via-yellow-400 to-transparent rounded-full" />
            <p className="text-[10px] text-black/40 mt-1.5 uppercase tracking-widest font-semibold">System Administration Panel</p>
          </div>
          {/* Close button on mobile inside the drawer */}
          <button 
            className="lg:hidden p-1.5 bg-neutral-100 rounded-lg text-neutral-500 hover:text-black transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group",
                  isActive
                    ? "bg-primary-container shadow-sm ring-1 ring-yellow-600/20"
                    : "hover:bg-surface-tint hover:shadow-md hover:translate-x-0.5"
                )}
              >
                {/* Icon badge */}
                <span
                  className={cn(
                    "material-symbols-outlined text-[18px] w-8 h-8 flex items-center justify-center rounded-lg shrink-0 transition-all",
                    isActive
                      ? "bg-yellow-600/20 text-yellow-800"
                      : "bg-black/5 text-black/50 group-hover:bg-white/20 group-hover:text-white"
                  )}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>

                {/* Label + desc */}
                <div className="flex flex-col min-w-0">
                  <span className={cn(
                    "text-sm font-bold leading-none tracking-tight",
                    isActive ? "text-black" : "text-black/80 group-hover:text-white"
                  )}>
                    {item.label}
                  </span>
                  <span className={cn(
                    "text-[10px] leading-none mt-0.5 tracking-wide truncate",
                    isActive ? "text-black/50" : "text-black/40 group-hover:text-white/70"
                  )}>
                    {item.desc}
                  </span>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-600 shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0 text-black">
        {children}
      </div>
    </div>
  );
}
