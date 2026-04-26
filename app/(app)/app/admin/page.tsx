"use client";

import { useAuth } from "@/lib/auth/context";
import Link from "next/link";

const SECTIONS = [
  {
    href: "/app/admin/stations",
    icon: "local_gas_station",
    title: "Platform Management",
    subtitle: "Stations & Users",
    desc: "Add and manage fuel stations, assign station managers, and oversee the distribution network.",
    accent: "from-amber-500/10 to-yellow-500/5",
    border: "border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    badge: "Network",
    badgeColor: "bg-amber-50 text-amber-700 ring-amber-700/10",
  },
  {
    href: "/app/admin/fuel-prices",
    icon: "price_change",
    title: "Pricing & Rules",
    subtitle: "Economics",
    desc: "Configure global fuel pricing per liter and enforce distribution quota rules per vehicle category.",
    accent: "from-blue-500/10 to-indigo-500/5",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    badge: "Controls",
    badgeColor: "bg-blue-50 text-blue-700 ring-blue-700/10",
  },
  {
    href: "/app/admin/reports",
    icon: "assessment",
    title: "Analytics",
    subtitle: "Reports",
    desc: "View daily distribution totals, system-wide performance metrics, and exportable operational reports.",
    accent: "from-green-500/10 to-emerald-500/5",
    border: "border-green-200",
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
    badge: "Insights",
    badgeColor: "bg-green-50 text-green-700 ring-green-700/10",
  },
];

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="w-full space-y-10">

      {/* Hero Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800 px-6 sm:px-8 py-8 sm:py-10 shadow-xl">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" }} />
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-yellow-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
            <span className="text-xs font-black tracking-[0.25em] text-yellow-500 uppercase">System Command Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mb-2">
            Admin Overview
          </h1>
          <p className="text-neutral-400 text-sm font-medium">
            Welcome back, <span className="text-yellow-400 font-bold">{user?.firstName ?? "Admin"}</span> — Tigray Regional Energy Oversight Division
          </p>
        </div>
        {/* Status bar */}
        <div className="relative z-10 mt-8 flex flex-wrap gap-4">
          {[
            { icon: "check_circle", label: "System Operational", color: "text-green-400" },
            { icon: "security", label: "All Stations Monitored", color: "text-blue-400" },
            { icon: "schedule", label: new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }), color: "text-neutral-400" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={`material-symbols-outlined text-base ${item.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              <span className={`text-xs font-semibold ${item.color}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section heading */}
      <div>
        <h2 className="text-xs font-black tracking-[0.2em] uppercase text-black/40 mb-4">Control Modules</h2>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((section) => (
            <Link key={section.href} href={section.href} className="group block">
              <div className={`relative rounded-2xl border ${section.border} bg-gradient-to-br ${section.accent} p-5 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}>

                {/* Badge */}
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ring-1 ring-inset mb-4 ${section.badgeColor}`}>
                  {section.badge}
                </span>

                {/* Icon + Title */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`${section.iconBg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined text-xl ${section.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{section.icon}</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-black tracking-widest uppercase text-black/40">{section.title}</div>
                    <div className="text-xl font-black text-black leading-tight">{section.subtitle}</div>
                  </div>
                </div>

                {/* Desc */}
                <p className="text-xs text-black/60 leading-relaxed">{section.desc}</p>

                {/* Arrow CTA */}
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-black/40 group-hover:text-black/70 transition-colors">
                  <span>Open module</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick links row */}
      <div className="rounded-2xl border border-outline/10 bg-neutral-50 p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-3">Quick Access</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/app/admin/quota-rules", icon: "rule", label: "Quota Rules" },
            { href: "/app/admin/users", icon: "manage_accounts", label: "Users" },
            { href: "/app/admin/stations", icon: "local_gas_station", label: "Stations" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-1.5 rounded-full border border-outline/20 bg-white px-3 py-1.5 text-xs font-semibold text-black/70 hover:bg-primary-container hover:text-black hover:border-yellow-300 transition-all shadow-sm">
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
