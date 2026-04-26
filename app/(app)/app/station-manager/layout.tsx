"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/app/station-manager", label: "Overview", exact: true, icon: "dashboard", desc: "Live status & summary" },
  { href: "/app/station-manager/workers", label: "Workers", icon: "badge", desc: "Manage staff access" },
  { href: "/app/station-manager/queue", label: "Live Queue", icon: "directions_car", desc: "Monitor vehicles" },
  { href: "/app/station-manager/reports", label: "Reports", icon: "assessment", desc: "Daily intake & sales" },
];

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function StationManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex w-full gap-8">
      <aside className="w-72 shrink-0 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
        {/* Sidebar Header */}
        <div className="mb-6 px-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-green-700 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_gas_station</span>
            <h2 className="text-xs font-black tracking-[0.2em] text-green-700 uppercase">Station Command</h2>
          </div>
          <div className="h-0.5 bg-gradient-to-r from-green-600 via-green-400 to-transparent rounded-full" />
          <p className="text-[10px] text-black/40 mt-1.5 uppercase tracking-widest font-semibold">Local Facility Management</p>
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
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group",
                  isActive
                    ? "bg-green-50 shadow-sm ring-1 ring-green-600/20"
                    : "hover:bg-surface-tint hover:shadow-md hover:translate-x-0.5"
                )}
              >
                {/* Icon badge */}
                <span
                  className={cn(
                    "material-symbols-outlined text-[18px] w-8 h-8 flex items-center justify-center rounded-lg shrink-0 transition-all",
                    isActive
                      ? "bg-green-600/20 text-green-800"
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
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-600 shrink-0" />
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
