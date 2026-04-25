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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Station Reports</h1>
        <p className="text-muted-foreground">View history and performance data for your station.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-medium">Start Date</label>
            <Input type="date" value={dateRange.startDate} onChange={e => setDateRange({...dateRange, startDate: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">End Date</label>
            <Input type="date" value={dateRange.endDate} onChange={e => setDateRange({...dateRange, endDate: e.target.value})} />
          </div>
          <Button onClick={() => activeTab === "transactions" ? fetchTransactions() : fetchDailyTotals()}>
            Apply Filters
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="daily-totals">Daily Totals</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Plate</TableHead>
                  <TableHead>Fuel Type</TableHead>
                  <TableHead>Liters</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Worker</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-6">Loading...</TableCell></TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-6">No transactions found.</TableCell></TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{tx.plateNumber}</TableCell>
                      <TableCell>{tx.fuelType}</TableCell>
                      <TableCell>{tx.liters.toFixed(2)} L</TableCell>
                      <TableCell>{tx.totalPrice.toLocaleString()} ETB</TableCell>
                      <TableCell>{tx.workerName}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="daily-totals" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Liters</TableHead>
                  <TableHead>Total Revenue</TableHead>
                  <TableHead>Transactions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-6">Loading...</TableCell></TableRow>
                ) : dailyTotals.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-6">No data found.</TableCell></TableRow>
                ) : (
                  dailyTotals.map((day) => (
                    <TableRow key={day.date}>
                      <TableCell className="font-medium">{new Date(day.date).toLocaleDateString()}</TableCell>
                      <TableCell>{day.totalLiters.toFixed(2)} L</TableCell>
                      <TableCell>{day.totalRevenue.toLocaleString()} ETB</TableCell>
                      <TableCell>{day.transactionCount}</TableCell>
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
