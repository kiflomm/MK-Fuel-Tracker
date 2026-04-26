"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { getDailyTotals, getServiceActivity, getDistributionReport } from "@/lib/api/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseISO, format } from "date-fns";

export default function ReportsPage() {
  const { accessToken } = useAuth();
  const [reportType, setReportType] = useState("dailyTotals");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accessToken) fetchReport();
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
         // handle if the response is an object or array. 
         // Typically lists are arrays. If it's an object, we wrap it.
         setData(Array.isArray(res.data) ? res.data : [res.data]);
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
      {/* Premium Header */}
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
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-outline/10 p-6 bg-white shadow-sm overflow-x-auto">
        {loading ? (
          <p className="text-center text-muted-foreground py-6">Loading report data...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">No data available for this report.</p>
        ) : (
          <ReportTable data={data} reportType={reportType} />
        )}
      </div>
    </div>
  );
}

function ReportTable({ data, reportType }: { data: any[], reportType: string }) {
  if (reportType === "dailyTotals") {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Total Liters</TableHead>
            <TableHead>Total Revenue</TableHead>
            <TableHead>Vehicle Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">
                 {row.date ? format(parseISO(row.date), "MMM d, yyyy") : "N/A"}
              </TableCell>
              <TableCell>{Number(row.totalLiters || 0).toFixed(2)} L</TableCell>
              <TableCell>{Number(row.totalRevenue || 0).toFixed(2)} Birr</TableCell>
              <TableCell>{row.vehicleCount || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  // Fallback generic table for unknown formats (like distribution or serviceActivity if they differ)
  const columns = data.length > 0 ? Object.keys(data[0]).filter(k => typeof data[0][k] !== "object") : [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map(col => (
            <TableHead key={col} className="capitalize">{col.replace(/([A-Z])/g, ' $1').trim()}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={i}>
            {columns.map(col => (
              <TableCell key={col}>{String(row[col])}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
