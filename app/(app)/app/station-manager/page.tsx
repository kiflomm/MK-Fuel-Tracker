"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import {
  getLiveQueue,
  getStationFuelInventory,
  LiveQueue,
  StationFuelInventoryRow,
} from "@/lib/api/station-manager";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  {
    href: "/app/station-manager/workers",
    icon: "badge",
    title: "Personnel",
    subtitle: "Manage Workers",
    desc: "Add, remove, or modify worker access credentials for this station.",
    accent: "from-blue-500/10 to-indigo-500/5",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    badge: "Access",
    badgeColor: "bg-blue-50 text-blue-700 ring-blue-700/10",
  },
  {
    href: "/app/station-manager/queue",
    icon: "directions_car",
    title: "Monitoring",
    subtitle: "Live Queue",
    desc: "Monitor incoming vehicles, pause intake, or review recent transactions.",
    accent: "from-green-500/10 to-emerald-500/5",
    border: "border-green-200",
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
    badge: "Active",
    badgeColor: "bg-green-50 text-green-700 ring-green-700/10",
  },
  {
    href: "/app/station-manager/reports",
    icon: "assessment",
    title: "Analytics",
    subtitle: "Daily Reports",
    desc: "View end-of-day reports, total sales, and detailed station analytics.",
    accent: "from-amber-500/10 to-yellow-500/5",
    border: "border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    badge: "Metrics",
    badgeColor: "bg-amber-50 text-amber-700 ring-amber-700/10",
  },
];

export default function StationManagerPage() {
  const { user, accessToken } = useAuth();
  const [queue, setQueue] = useState<LiveQueue | null>(null);
  const [fuelInventory, setFuelInventory] = useState<StationFuelInventoryRow[] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!accessToken) return;
      const [queueRes, invRes] = await Promise.all([
        getLiveQueue(accessToken),
        getStationFuelInventory(accessToken),
      ]);
      if (queueRes.data) setQueue(queueRes.data);
      if (invRes.data) setFuelInventory(invRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-10">

      {/* Hero Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800 px-6 sm:px-8 py-8 sm:py-10 shadow-xl">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" }} />
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-yellow-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_gas_station</span>
              <span className="text-xs font-black tracking-[0.25em] text-yellow-500 uppercase">Station Facility Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mb-2">
              Station Overview
            </h1>
            <p className="text-neutral-400 text-sm font-medium">
              Manager: <span className="text-yellow-400 font-bold">{user?.firstName ?? "Unknown"}</span> • Station: <span className="text-white font-bold">{queue?.stationName ?? "Loading..."}</span>
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchData()} className="shrink-0 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white font-label-caps text-[10px] tracking-widest uppercase rounded-full">
            <span className="material-symbols-outlined text-sm mr-1">refresh</span>
            Refresh Status
          </Button>
        </div>

        {/* Status bar */}
        <div className="relative z-10 mt-8 flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <span className={`material-symbols-outlined text-base ${queue?.isIntakePaused ? 'text-red-400' : 'text-green-400'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {queue?.isIntakePaused ? "pause_circle" : "check_circle"}
            </span>
            <span className={`text-xs font-semibold ${queue?.isIntakePaused ? 'text-red-400' : 'text-green-400'}`}>
              {loading ? "Checking Queue..." : queue?.isIntakePaused ? "Intake Paused" : "Accepting Vehicles"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-blue-400" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
            <span className="text-xs font-semibold text-blue-400">
              {loading ? "..." : `${queue?.queueLength ?? 0} Vehicles in Queue`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-neutral-400" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
            <span className="text-xs font-semibold text-neutral-400">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Fuel inventory (manual refresh uses header button) */}
      <div className="rounded-2xl border border-outline/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-yellow-700 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
              <h2 className="text-xs font-black tracking-[0.2em] uppercase text-yellow-700">
                Fuel Inventory
              </h2>
            </div>
            <p className="text-[10px] text-black/40 uppercase tracking-widest font-semibold">
              Live stock levels by fuel type
            </p>
          </div>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-neutral-50 rounded-xl border border-dashed border-outline/20">
            <span className="material-symbols-outlined text-3xl text-black/10 animate-spin mb-2">refresh</span>
            <p className="text-xs font-bold text-black/40 uppercase tracking-widest">
              Synchronizing inventory…
            </p>
          </div>
        ) : !fuelInventory || fuelInventory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-neutral-50 rounded-xl border border-dashed border-outline/20">
            <span className="material-symbols-outlined text-3xl text-black/10 mb-2">inventory</span>
            <p className="text-xs font-bold text-black/40 uppercase tracking-widest">
              No inventory data available
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-outline/10 overflow-hidden shadow-sm bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50/50 hover:bg-neutral-50/50 h-11">
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4">Fuel type</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4">Code</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4 text-right">Remaining (L)</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4 text-right">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fuelInventory.map((row) => (
                  <TableRow key={row.fuelTypeId} className="group hover:bg-neutral-50/50 transition-colors border-b border-outline/5 last:border-0">
                    <TableCell className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-neutral-800">{row.fuelTypeName}</span>
                        {!row.fuelTypeIsActive && (
                          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-700 ring-1 ring-inset ring-amber-700/10">
                            Inactive
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <span className="font-mono text-[11px] font-bold text-black/40 bg-black/5 px-2 py-1 rounded">
                        {row.fuelTypeCode}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right font-black text-neutral-900 tabular-nums">
                      {row.remainingLiters.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[11px] font-bold text-black/60 truncate max-w-[120px]">
                          {row.inventoryUpdatedAt ? new Date(row.inventoryUpdatedAt).toLocaleDateString() : "—"}
                        </span>
                        <span className="text-[9px] font-black text-black/30 uppercase tracking-tighter">
                          {row.inventoryUpdatedAt ? new Date(row.inventoryUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="mt-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200/50 flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-600 text-lg">info</span>
          <p className="text-[11px] font-medium text-amber-800 leading-relaxed">
            Inventory levels are managed by the regional administration. Station managers have read-only access to this data for operational oversight.
          </p>
        </div>
      </div>

      {/* Section heading */}
      <div>
        <h2 className="text-xs font-black tracking-[0.2em] uppercase text-black/40 mb-4">Station Modules</h2>

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

    </div>
  );
}
