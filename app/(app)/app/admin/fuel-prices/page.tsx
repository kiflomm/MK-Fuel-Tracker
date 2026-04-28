"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { getFuelPrices, upsertFuelPrice, FuelPrice } from "@/lib/api/admin";
import { format, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FuelPricesPage() {
  const { accessToken } = useAuth();
  const [prices, setPrices] = useState<FuelPrice[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const normalized = dateString.replace(" ", "T");
      const date = new Date(normalized);
      if (!isValid(date)) return "-";
      return format(date, "MMM d, yyyy h:mm a");
    } catch {
      return "-";
    }
  };

  useEffect(() => {
    if (accessToken) fetchPrices();
  }, [accessToken]);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      if (!accessToken) return;
      const res = await getFuelPrices(accessToken);
      if (res.data) setPrices(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-950 to-neutral-900 px-6 py-7 shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-blue-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>price_change</span>
              <span className="text-[10px] font-black tracking-[0.25em] text-blue-400 uppercase">Economic Controls</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Fuel Prices</h1>
            <p className="text-sm text-neutral-400 font-medium">Configure the global price per liter for each fuel type.</p>
          </div>
          <UpdatePriceDialog onSuccess={fetchPrices} />
        </div>
      </div>

      <div className="rounded-xl border border-outline/10 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Fuel Type</TableHead>
              <TableHead>Price (Birr/L)</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Loading prices...
                </TableCell>
              </TableRow>
            ) : prices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No prices configured.
                </TableCell>
              </TableRow>
            ) : (
              prices.map((price) => (
                <TableRow key={price.id}>
                  <TableCell>{price.id}</TableCell>
                  <TableCell className="font-medium">
                    <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-700/10">
                      {price.fuelType}
                    </span>
                  </TableCell>
                  <TableCell>{Number(price.pricePerLiter).toFixed(2)}</TableCell>
                  <TableCell>{formatDate(price.createdAt)}</TableCell>
                  <TableCell>{formatDate(price.updatedAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function UpdatePriceDialog({ onSuccess }: { onSuccess: () => void }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [fuelType, setFuelType] = useState("BENZENE");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    try {
      setIsSubmitting(true);
      await upsertFuelPrice(accessToken, {
        fuelType,
        pricePerLiter: parseFloat(price),
      });
      onSuccess();
      setOpen(false);
      setPrice("");
    } catch (error) {
      console.error(error);
      alert("Failed to update fuel price");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-container text-on-primary-container hover:bg-surface-tint hover:text-white transition-all shadow-sm font-label-caps text-[10px] uppercase tracking-widest px-4 h-9 rounded-full">
          Update Price
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Update Fuel Price</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Fuel Type</Label>
            <Select value={fuelType} onValueChange={setFuelType}>
              <SelectTrigger className="w-full bg-transparent">
                <SelectValue placeholder="Fuel Type" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="BENZENE">Benzene</SelectItem>
                <SelectItem value="DIESEL">Diesel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>New Price (per liter)</Label>
            <Input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 74.50" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Price"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
