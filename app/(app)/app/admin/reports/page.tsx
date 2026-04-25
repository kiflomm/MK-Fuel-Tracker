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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">View system activity and analytics.</p>
        </div>
        <div className="w-64">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dailyTotals">Daily Totals</SelectItem>
              <SelectItem value="serviceActivity">Service Activity</SelectItem>
              <SelectItem value="distribution">Distribution Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border p-4 bg-background">
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
