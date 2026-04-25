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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fuel Prices</h1>
          <p className="text-muted-foreground">Configure the global price per liter for each fuel type.</p>
        </div>
        <UpdatePriceDialog onSuccess={fetchPrices} />
      </div>

      <div className="rounded-md border">
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
      <DialogTrigger asChild><Button>Update Price</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Update Fuel Price</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Fuel Type</Label>
            <select required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={fuelType} onChange={e => setFuelType(e.target.value)}>
              <option value="BENZENE">Benzene</option>
              <option value="DIESEL">Diesel</option>
            </select>
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
