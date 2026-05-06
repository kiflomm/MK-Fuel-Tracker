"use client";

import { useAuth } from "@/lib/auth/context";
import { RevenueTimeseriesPanel } from "@/components/revenue/RevenueTimeseriesPanel";

export default function StationWorkerRevenuePage() {
  const { accessToken } = useAuth();

  return (
    <div className="w-full space-y-6">
      <div className="relative">
        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary-container" />
        <h1 className="font-display-lg text-3xl md:text-4xl text-on-surface tracking-tight">
          Station revenue
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant font-medium max-w-2xl">
          Time-based revenue for your assigned station only. Same reporting periods as the government
          dashboard; data is scoped by your account.
        </p>
      </div>
      <div className="rounded-xl border border-outline/10 bg-white/80 shadow-sm overflow-hidden">
        <RevenueTimeseriesPanel accessToken={accessToken ?? null} variant="worker" />
      </div>
    </div>
  );
}
