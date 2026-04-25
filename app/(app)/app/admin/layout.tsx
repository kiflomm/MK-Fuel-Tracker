"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/app/admin", label: "Dashboard", exact: true },
  { href: "/app/admin/stations", label: "Stations" },
  { href: "/app/admin/users", label: "Users" },
  { href: "/app/admin/fuel-prices", label: "Fuel Prices" },
  { href: "/app/admin/quota-rules", label: "Quota Rules" },
  { href: "/app/admin/reports", label: "Reports" },
];

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex w-full gap-8">
      <aside className="w-64 shrink-0 pr-4">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Admin</h2>
        <nav className="flex flex-col space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
