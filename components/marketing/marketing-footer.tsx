"use client";

import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-neutral-100 dark:bg-neutral-950 border-t-2 border-yellow-600/10 font-['Public_Sans'] text-sm tracking-wide">
      <div className="flex flex-col items-center md:items-start gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-yellow-600">energy_savings_leaf</span>
          <span className="font-black text-neutral-800 dark:text-neutral-200 text-lg">
            MEKELLE ENERGY OVERSIGHT
          </span>
        </div>
        <p className="text-neutral-500 dark:text-neutral-500 max-w-md text-center md:text-left text-xs leading-relaxed">
          © 2024 Mekelle Energy Oversight. Official Government Portal. Dedicated to the
          sustainable development of the Tigray region.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        <Link
          className="text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          href="/privacy"
        >
          Privacy Policy
        </Link>
        <Link
          className="text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          href="/terms"
        >
          Terms of Service
        </Link>
        <Link
          className="text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          href="/support"
        >
          Contact Support
        </Link>
      </div>
    </footer>
  );
}
