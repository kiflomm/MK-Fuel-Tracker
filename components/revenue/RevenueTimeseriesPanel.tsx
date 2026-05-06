"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getRevenueTimeseries,
  getStations,
  type RevenueGranularity,
  type RevenueTimeseriesBucket,
  type RevenueTimeseriesData,
  type Station,
} from "@/lib/api/admin";
import { getWorkerRevenueTimeseries } from "@/lib/api/station-worker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatStationWithId } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

function formatPeriodLabel(periodStart: string, granularity: RevenueGranularity): string {
  const d = parseISO(periodStart);
  if (granularity === "DAILY") return format(d, "MMM d, yyyy");
  if (granularity === "WEEKLY") return `Week of ${format(d, "MMM d, yyyy")}`;
  return format(d, "MMM yyyy");
}

export function RevenueTimeseriesPanel({
  accessToken,
  variant,
}: {
  accessToken: string | null;
  variant: "admin" | "worker";
}) {
  const showStationBreakdown = variant === "admin";

  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [granularity, setGranularity] = useState<RevenueGranularity>("DAILY");
  const [stationIdRaw, setStationIdRaw] = useState("");
  const [stations, setStations] = useState<Station[]>([]);
  const [data, setData] = useState<RevenueTimeseriesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!accessToken || !showStationBreakdown) return;
    void getStations(accessToken).then((res) => setStations(res.data ?? []));
  }, [accessToken, showStationBreakdown]);

  const stationIdParsed = useMemo(() => {
    const t = stationIdRaw.trim();
    if (t === "") return undefined;
    const n = parseInt(t, 10);
    return Number.isFinite(n) && n >= 1 ? n : undefined;
  }, [stationIdRaw]);

  const load = useCallback(async () => {
    if (!accessToken) return;
    if (variant === "admin" && stationIdRaw.trim() !== "" && stationIdParsed === undefined) {
      return;
    }
    setLoading(true);
    try {
      if (variant === "admin") {
        const res = await getRevenueTimeseries(accessToken, {
          from,
          to,
          granularity,
          stationId: stationIdParsed,
        });
        setData(res.data ?? null);
      } else {
        const res = await getWorkerRevenueTimeseries(accessToken, {
          from,
          to,
          granularity,
        });
        setData(res.data ?? null);
      }
    } catch (e) {
      console.error(e);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [accessToken, variant, from, to, granularity, stationIdParsed, stationIdRaw]);

  useEffect(() => {
    void load();
  }, [load]);

  const chartData = useMemo(() => {
    if (!data?.buckets.length) return [];
    return data.buckets.map((b) => ({
      label: formatPeriodLabel(b.periodStart, data.granularity),
      revenue: Number(b.totals.revenue),
    }));
  }, [data]);

  const toggleBreakdown = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="grid gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            From (UTC)
          </span>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-44" />
        </div>
        <div className="grid gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            To (UTC)
          </span>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-44" />
        </div>
        <div className="grid gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Granularity
          </span>
          <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
            {(["DAILY", "WEEKLY", "MONTHLY"] as const).map((g) => (
              <Button
                key={g}
                type="button"
                size="sm"
                variant={granularity === g ? "default" : "ghost"}
                className="flex-1 min-w-[4.5rem] text-xs"
                onClick={() => setGranularity(g)}
              >
                {g === "DAILY" ? "Daily" : g === "WEEKLY" ? "Weekly" : "Monthly"}
              </Button>
            ))}
          </div>
        </div>
        {showStationBreakdown && (
          <div className="grid gap-2 min-w-[12rem]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Station (optional)
            </span>
            <Select
              value={stationIdRaw.trim() === "" ? "__all__" : stationIdRaw}
              onValueChange={(v) => setStationIdRaw(v === "__all__" ? "" : v)}
            >
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="All stations" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="__all__">All stations</SelectItem>
                {stations.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name} (ID {s.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <Button type="button" onClick={() => void load()} disabled={loading} className="shrink-0">
          Refresh
        </Button>
      </div>

      <p className="text-xs text-neutral-500">
        Revenue includes completed transactions with{" "}
        <span className="font-semibold text-neutral-700">SUCCESS</span> payments only. Buckets use UTC
        (weekly: ISO weeks, Monday start).
      </p>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <span className="material-symbols-outlined animate-spin text-violet-600">progress_activity</span>
          <p className="text-sm text-neutral-500 font-medium">Loading revenue data…</p>
        </div>
      ) : !data || data.buckets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 rounded-lg border border-dashed border-outline/20">
          <span className="material-symbols-outlined text-neutral-300 text-4xl">payments</span>
          <p className="text-sm text-neutral-500 font-medium">No revenue in this range.</p>
        </div>
      ) : (
        <>
          <ChartContainer
            config={{ revenue: { label: "Revenue (Birr)", color: "hsl(142 76% 36%)" } }}
            className="h-[280px] w-full max-h-[360px]"
          >
            <BarChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} interval={0} angle={-35} textAnchor="end" height={60} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} width={56} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            </BarChart>
          </ChartContainer>

          <div className="rounded-lg border border-outline/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50/50">
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Period</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Revenue</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Liters</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Transactions</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Unique vehicles</TableHead>
                  {showStationBreakdown && (
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider">By station</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.buckets.map((row: RevenueTimeseriesBucket) => {
                  const key = row.periodStart;
                  const isOpen = expanded[key];
                  const stations = row.byStation ?? [];
                  return (
                    <TableRow key={key} className="hover:bg-neutral-50/50 align-top">
                      <TableCell className="font-semibold text-neutral-900">
                        {formatPeriodLabel(row.periodStart, data.granularity)}
                      </TableCell>
                      <TableCell className="font-mono text-sm font-semibold text-emerald-700">
                        {row.totals.revenue} Birr
                      </TableCell>
                      <TableCell className="font-mono text-sm text-neutral-600">
                        {row.totals.litersDispensed} L
                      </TableCell>
                      <TableCell className="font-medium text-neutral-700">{row.totals.transactionCount}</TableCell>
                      <TableCell className="font-medium text-neutral-700">{row.totals.uniqueVehicles}</TableCell>
                      {showStationBreakdown && (
                        <TableCell className="min-w-[200px]">
                          {stations.length === 0 ? (
                            <span className="text-xs text-neutral-400">—</span>
                          ) : (
                            <>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() => toggleBreakdown(key)}
                              >
                                {isOpen ? "Hide" : "Show"} {stations.length} station{stations.length === 1 ? "" : "s"}
                              </Button>
                              {isOpen && (
                                <Table className="mt-2 text-xs">
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Station</TableHead>
                                      <TableHead className="text-right">Revenue</TableHead>
                                      <TableHead className="text-right">Liters</TableHead>
                                      <TableHead className="text-right">Txns</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {stations.map((s) => (
                                      <TableRow key={s.stationId}>
                                        <TableCell>
                                          {formatStationWithId(s.stationId, s.stationName)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">{s.revenue}</TableCell>
                                        <TableCell className="text-right font-mono">{s.litersDispensed}</TableCell>
                                        <TableCell className="text-right">{s.transactionCount}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              )}
                            </>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
