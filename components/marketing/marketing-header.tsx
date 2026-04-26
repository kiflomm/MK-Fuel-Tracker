"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MarketingHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const navLinks = [
    { label: "Home", href: isHome ? "#home" : "/#home" },
    { label: "Impact", href: isHome ? "#impact" : "/#impact" },
    { label: "Services", href: isHome ? "#services" : "/#services" },
    { label: "Authorities", href: isHome ? "#authorities" : "/#authorities" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b-4 border-yellow-600/20 shadow-sm font-['Public_Sans']">
      <Link href="/" className="flex items-center gap-3">
        <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-500 text-3xl">
          energy_savings_leaf
        </span>
        <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white uppercase">
          Mekelle Fuel Tracker
        </span>
      </Link>
      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            className="text-neutral-600 dark:text-neutral-400 font-medium hover:text-yellow-700 dark:hover:text-yellow-300 transition-all duration-300 cursor-pointer active:scale-95 transform"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/sign-in">
          <button className="px-6 py-2 bg-primary-container text-on-primary-container font-label-caps text-xs uppercase rounded transition-all hover:bg-surface-tint hover:text-white transform active:scale-95">
            Login
          </button>
        </Link>
      </div>
    </header>
  );
}
