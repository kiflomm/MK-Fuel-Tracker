"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { getDailyTotals, getServiceActivity, getDistributionReport } from "@/lib/api/admin";
import { RevenueTimeseriesPanel } from "@/components/revenue/RevenueTimeseriesPanel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseISO, format } from "date-fns";
import { formatStationWithId } from "@/lib/utils";

function formatWorkerCell(row: {
  stationWorker?: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
}) {
  const w = row.stationWorker;
  if (!w) return "—";
  const name = `${w.firstName ?? ""} ${w.lastName ?? ""}`.trim();
  if (name && w.email) return `${name} · ${w.email}`;
  if (name) return name;
  if (w.email) return w.email;
  return `User ID ${w.id}`;
}

type DistributionBucketRow = {
  station?: { id: number; name: string | null };
  vehicleCategory?: string;
  fuelType?: string;
  completedTransactionCount: number;
  totalLitersDispensed: string;
  totalGrossAmount: string;
  uniqueVehiclesServedCount: number;
};

function DistributionReportTables({ report }: { report: Record<string, unknown> }) {
  const totalsOverall = report.totalsOverall as
    | {
        completedTransactionCount: number;
        totalLitersDispensed: string;
        totalGrossAmount: string;
        uniqueVehiclesServedCount: number;
      }
    | undefined;
  const byStation = (report.byStation ?? []) as DistributionBucketRow[];
  const byVehicleCategory = (report.byVehicleCategory ?? []) as DistributionBucketRow[];
  const byFuelType = (report.byFuelType ?? []) as DistributionBucketRow[];

  if (!totalsOverall) {
    return <p className="p-6 text-sm text-neutral-500">No distribution data in this response.</p>;
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      <section>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">Overall</h3>
        <div className="rounded-lg border border-outline/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50/50">
                <TableHead className="font-bold text-[11px] uppercase tracking-wider">Transactions</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider">Liters</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider">Gross amount</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider">Unique vehicles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{totalsOverall.completedTransactionCount}</TableCell>
                <TableCell className="font-mono">{totalsOverall.totalLitersDispensed} L</TableCell>
                <TableCell className="font-mono text-emerald-700">{totalsOverall.totalGrossAmount} Birr</TableCell>
                <TableCell>{totalsOverall.uniqueVehiclesServedCount}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      {byStation.length > 0 ? (
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">By station</h3>
          <div className="rounded-lg border border-outline/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50/50">
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Station</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Transactions</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Liters</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Gross amount</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Unique vehicles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {byStation.map((row, i) => (
                  <TableRow key={`st-${row.station?.id ?? i}`}>
                    <TableCell className="font-medium">
                      {row.station
                        ? formatStationWithId(row.station.id, row.station.name)
                        : "—"}
                    </TableCell>
                    <TableCell>{row.completedTransactionCount}</TableCell>
                    <TableCell className="font-mono">{row.totalLitersDispensed} L</TableCell>
                    <TableCell className="font-mono text-emerald-700">{row.totalGrossAmount} Birr</TableCell>
                    <TableCell>{row.uniqueVehiclesServedCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      ) : null}

      {byVehicleCategory.length > 0 ? (
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">By vehicle category</h3>
          <div className="rounded-lg border border-outline/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50/50">
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Category</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Transactions</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Liters</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Gross amount</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Unique vehicles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {byVehicleCategory.map((row, i) => (
                  <TableRow key={`cat-${row.vehicleCategory ?? i}`}>
                    <TableCell className="font-mono font-medium">{row.vehicleCategory}</TableCell>
                    <TableCell>{row.completedTransactionCount}</TableCell>
                    <TableCell className="font-mono">{row.totalLitersDispensed} L</TableCell>
                    <TableCell className="font-mono text-emerald-700">{row.totalGrossAmount} Birr</TableCell>
                    <TableCell>{row.uniqueVehiclesServedCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      ) : null}

      {byFuelType.length > 0 ? (
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">By fuel type</h3>
          <div className="rounded-lg border border-outline/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50/50">
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Fuel type</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Transactions</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Liters</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Gross amount</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider">Unique vehicles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {byFuelType.map((row, i) => (
                  <TableRow key={`ft-${row.fuelType ?? i}`}>
                    <TableCell className="font-mono font-medium">{row.fuelType}</TableCell>
                    <TableCell>{row.completedTransactionCount}</TableCell>
                    <TableCell className="font-mono">{row.totalLitersDispensed} L</TableCell>
                    <TableCell className="font-mono text-emerald-700">{row.totalGrossAmount} Birr</TableCell>
                    <TableCell>{row.uniqueVehiclesServedCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default function ReportsPage() {
  const { accessToken } = useAuth();
  const [reportType, setReportType] = useState("dailyTotals");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!accessToken || reportType === "revenueTimeseries") return;
    fetchReport();
  }, [accessToken, reportType]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      if (!accessToken) return;
      let res;
      if (reportType === "dailyTotals") {
        res = await getDailyTotals(accessToken);
      } else if (reportType === "serviceActivity") {
        res = await getServiceActivity(accessToken);
      } else if (reportType === "distribution") {
        res = await getDistributionReport(accessToken);
      }

      if (res?.data) {
        const payload = res.data;
        if (Array.isArray(payload)) {
          setData(payload);
        } else if (reportType === "distribution" && payload && typeof payload === "object") {
          setData([payload]);
        } else {
          setData([payload]);
        }
      } else {
        setData([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-black">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-950 to-neutral-900 px-6 py-7 shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-violet-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>assessment</span>
              <span className="text-[10px] font-black tracking-[0.25em] text-violet-400 uppercase">Analytics & Insights</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Reports</h1>
            <p className="text-sm text-neutral-400 font-medium">View system activity, distribution totals, and operational metrics.</p>
          </div>
          <div className="w-56">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select Report Type" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="dailyTotals">Daily Totals</SelectItem>
                <SelectItem value="serviceActivity">Service Activity</SelectItem>
                <SelectItem value="distribution">Distribution Report</SelectItem>
                <SelectItem value="revenueTimeseries">Revenue over time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {reportType === "revenueTimeseries" ? (
        <div className="rounded-xl border border-outline/10 overflow-hidden bg-white shadow-sm overflow-x-auto">
          <RevenueTimeseriesPanel accessToken={accessToken ?? null} variant="admin" />
        </div>
      ) : (
      <div className="rounded-xl border border-outline/10 overflow-hidden bg-white shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="material-symbols-outlined animate-spin text-violet-600">progress_activity</span>
            <p className="text-sm text-neutral-500 font-medium">Synthesizing analytics data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="material-symbols-outlined text-neutral-300 text-4xl">analytics</span>
            <p className="text-sm text-neutral-500 font-medium">No results found for the selected parameters.</p>
          </div>
        ) : (
          <ReportTable data={data} reportType={reportType} />
        )}
      </div>
      )}
    </div>
  );
}

function ReportTable({ data, reportType }: { data: any[], reportType: string }) {
  if (reportType === "distribution" && data[0]?.totalsOverall) {
    return <DistributionReportTables report={data[0]} />;
  }

  if (reportType === "dailyTotals") {
    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50/50">
            <TableHead className="font-bold text-[11px] uppercase tracking-wider">Date</TableHead>
            <TableHead className="font-bold text-[11px] uppercase tracking-wider">Total Liters</TableHead>
            <TableHead className="font-bold text-[11px] uppercase tracking-wider">Total Revenue</TableHead>
            <TableHead className="font-bold text-[11px] uppercase tracking-wider">Vehicle Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i} className="hover:bg-neutral-50/50 transition-colors">
              <TableCell className="font-bold text-neutral-900">
                {row.date ? format(parseISO(String(row.date)), "MMM d, yyyy") : "N/A"}
                {row.stationId != null && (
                  <div className="text-xs font-normal text-neutral-500 mt-1">
                    {formatStationWithId(row.stationId, row.station?.name ?? null)}
                  </div>
                )}
              </TableCell>
              <TableCell className="font-mono text-sm font-semibold text-neutral-600">
                {Number(row.totalLitersDispensed ?? row.totalLiters ?? 0).toFixed(2)} L
              </TableCell>
              <TableCell className="font-mono text-sm font-semibold text-emerald-600">
                {Number(row.totalGrossAmount ?? row.totalRevenue ?? 0).toFixed(2)} Birr
              </TableCell>
              <TableCell className="font-bold text-neutral-700">
                {row.uniqueVehiclesServedCount ?? row.vehicleCount ?? 0}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (reportType === "serviceActivity") {
    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50/50">
            <TableHead className="font-bold text-[11px] uppercase tracking-wider">Station</TableHead>
            <TableHead className="font-bold text-[11px] uppercase tracking-wider">Worker</TableHead>
            <TableHead className="font-bold text-[11px] uppercase tracking-wider">Transactions</TableHead>
            <TableHead className="font-bold text-[11px] uppercase tracking-wider">Liters</TableHead>
            <TableHead className="font-bold text-[11px] uppercase tracking-wider">Gross amount</TableHead>
            <TableHead className="font-bold text-[11px] uppercase tracking-wider">Latest service</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i} className="hover:bg-neutral-50/50 transition-colors">
              <TableCell className="font-medium text-neutral-900">
                {formatStationWithId(row.stationId, row.station?.name ?? null)}
              </TableCell>
              <TableCell className="text-sm">{formatWorkerCell(row)}</TableCell>
              <TableCell>{row.completedTransactionCount ?? 0}</TableCell>
              <TableCell className="font-mono text-sm">{row.totalLitersDispensed ?? "0.00"} L</TableCell>
              <TableCell className="font-mono text-sm text-emerald-700">{row.totalGrossAmount ?? "0.00"} Birr</TableCell>
              <TableCell className="text-xs text-neutral-600">
                {row.latestServiceAt ? new Date(row.latestServiceAt).toLocaleString() : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  const columns = data.length > 0 ? Object.keys(data[0]).filter(k => typeof data[0][k] !== "object") : [];

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-neutral-50/50">
          {columns.map(col => (
            <TableHead key={col} className="font-bold text-[11px] uppercase tracking-wider">
              {col.replace(/([A-Z])/g, ' $1').trim()}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={i} className="hover:bg-neutral-50/50 transition-colors">
            {columns.map(col => (
              <TableCell key={col} className="text-sm font-medium text-neutral-700">
                {String(row[col])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
