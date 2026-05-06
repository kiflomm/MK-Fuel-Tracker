"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { 
  getStationTransactions, 
  getStationDailyTotals, 
  StationTransaction, 
  StationDailyTotal 
} from "@/lib/api/station-manager";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const { accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState("transactions");
  const [loading, setLoading] = useState(false);
  
  const [transactions, setTransactions] = useState<StationTransaction[]>([]);
  const [dailyTotals, setDailyTotals] = useState<StationDailyTotal[]>([]);

  const [dateRange, setDateRange] = useState({ 
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0], 
    endDate: new Date().toISOString().split('T')[0] 
  });

  useEffect(() => {
    if (accessToken) {
      if (activeTab === "transactions") fetchTransactions();
      else fetchDailyTotals();
    }
  }, [accessToken, activeTab]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      if (!accessToken) return;
      const res = await getStationTransactions(accessToken, { 
        from: dateRange.startDate, 
        to: dateRange.endDate 
      });
      if (res.data) setTransactions(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyTotals = async () => {
    setLoading(true);
    try {
      if (!accessToken) return;
      const res = await getStationDailyTotals(accessToken, { 
        from: dateRange.startDate, 
        to: dateRange.endDate 
      });
      if (res.data) setDailyTotals(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatFixed = (value: unknown, decimals = 2) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue.toFixed(decimals) : (0).toFixed(decimals);
  };

  const formatLocale = (value: unknown) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue.toLocaleString() : "0";
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-950 to-neutral-900 px-6 py-7 shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-violet-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
              <span className="text-[10px] font-black tracking-[0.25em] text-violet-400 uppercase">Station Analytics</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Station Reports</h1>
            <p className="text-sm text-neutral-400 font-medium">View history and performance data for your station.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-outline/10 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-black/40 text-lg">filter_alt</span>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40">Data Filters</h3>
        </div>
        <div className="flex flex-wrap gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Period Start</label>
            <Input type="date" value={dateRange.startDate} onChange={e => setDateRange({...dateRange, startDate: e.target.value})} className="rounded-xl border-outline/10" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Period End</label>
            <Input type="date" value={dateRange.endDate} onChange={e => setDateRange({...dateRange, endDate: e.target.value})} className="rounded-xl border-outline/10" />
          </div>
          <Button 
            onClick={() => activeTab === "transactions" ? fetchTransactions() : fetchDailyTotals()}
            className="rounded-xl font-bold uppercase text-[10px] tracking-widest px-6 bg-yellow-400 text-black hover:bg-yellow-500 transition-all shadow-sm h-10"
          >
            Apply Query
          </Button>
        </div>
      </div>

      <Tabs defaultValue="transactions" onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-neutral-100/50 p-1 rounded-xl border border-outline/5 h-12">
          <TabsTrigger 
            value="transactions" 
            className="rounded-lg px-6 text-[10px] font-black uppercase tracking-widest data-[state=active]:!bg-yellow-400 data-[state=active]:!text-black data-[state=active]:shadow-sm h-full transition-all text-black"
          >
            Recent Transactions
          </TabsTrigger>
          <TabsTrigger 
            value="daily-totals" 
            className="rounded-lg px-6 text-[10px] font-black uppercase tracking-widest data-[state=active]:!bg-yellow-400 data-[state=active]:!text-black data-[state=active]:shadow-sm h-full transition-all text-black"
          >
            Daily Totals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <div className="rounded-xl border border-outline/10 overflow-hidden shadow-sm bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50/50 hover:bg-neutral-50/50 h-11">
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4">Timestamp</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4">Vehicle Plate</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4">Fuel Type</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4">Volume</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4">Gross Amount</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4">Worker</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      <span className="material-symbols-outlined text-3xl text-black/5 animate-spin block mb-2">refresh</span>
                      <span className="text-xs font-bold uppercase tracking-widest opacity-40">Fetching logs...</span>
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      <span className="material-symbols-outlined text-3xl text-black/5 block mb-2">history</span>
                      <span className="text-xs font-bold uppercase tracking-widest opacity-40">No transactions found for this period.</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.id} className="group hover:bg-neutral-50/50 transition-colors border-b border-outline/5 last:border-0">
                      <TableCell className="px-4 py-3.5">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-bold text-neutral-600">
                            {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-[9px] font-black text-black/20 uppercase tracking-tighter">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3.5">
                        <span className="font-black text-neutral-800 tracking-tight">{tx.plateNumber}</span>
                      </TableCell>
                      <TableCell className="px-4 py-3.5">
                        <span className="inline-flex items-center rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-violet-700 ring-1 ring-inset ring-violet-700/10">
                          {tx.fuelType}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3.5 font-black text-neutral-900 tabular-nums">
                        {formatFixed(tx.liters)} <span className="text-[10px] text-black/30 ml-0.5">L</span>
                      </TableCell>
                      <TableCell className="px-4 py-3.5 font-black text-neutral-900 tabular-nums">
                        {formatLocale(tx.totalPrice)} <span className="text-[10px] text-black/30 ml-0.5">ETB</span>
                      </TableCell>
                      <TableCell className="px-4 py-3.5">
                        <span className="text-[12px] font-bold text-neutral-600">{tx.workerName}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="daily-totals" className="mt-6">
          <div className="rounded-xl border border-outline/10 overflow-hidden shadow-sm bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50/50 hover:bg-neutral-50/50 h-11">
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4">Operational Date</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4">Total Volume dispensed</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4">Gross Revenue</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4">TX Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      <span className="material-symbols-outlined text-3xl text-black/5 animate-spin block mb-2">refresh</span>
                      <span className="text-xs font-bold uppercase tracking-widest opacity-40">Calculating totals...</span>
                    </TableCell>
                  </TableRow>
                ) : dailyTotals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      <span className="material-symbols-outlined text-3xl text-black/5 block mb-2">summarize</span>
                      <span className="text-xs font-bold uppercase tracking-widest opacity-40">No summary data found.</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  dailyTotals.map((day) => (
                    <TableRow key={day.date} className="group hover:bg-neutral-50/50 transition-colors border-b border-outline/5 last:border-0">
                      <TableCell className="px-4 py-3.5">
                        <span className="font-bold text-neutral-800">{new Date(day.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </TableCell>
                      <TableCell className="px-4 py-3.5 font-black text-neutral-900 tabular-nums text-lg">
                        {formatFixed(day.totalLitersDispensed)} <span className="text-[10px] text-black/30 ml-0.5 font-black uppercase">Liters</span>
                      </TableCell>
                      <TableCell className="px-4 py-3.5 font-black text-neutral-900 tabular-nums">
                        {formatLocale(day.totalGrossAmount)} <span className="text-[10px] text-black/30 ml-0.5">ETB</span>
                      </TableCell>
                      <TableCell className="px-4 py-3.5">
                        <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-700 ring-1 ring-inset ring-neutral-700/10">
                          {day.completedTransactionCount} Transactions
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
