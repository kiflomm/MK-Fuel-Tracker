"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import {
  getFuelTypes,
  createFuelTypeWithPrice,
  updateFuelType,
  deleteFuelType,
  upsertFuelPrice,
  FuelType,
} from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FuelTypesPage() {
  const { accessToken } = useAuth();
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);

  useEffect(() => {
    if (accessToken) fetchFuelTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, includeInactive]);

  const fetchFuelTypes = async () => {
    setLoading(true);
    try {
      if (!accessToken) return;
      const res = await getFuelTypes(accessToken, { includeInactive });
      if (res.data) setFuelTypes(res.data);
    } catch (error: any) {
      console.error(error);
      alert(error?.message ?? "Failed to load fuel types");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    if (!confirm("Delete this fuel type? This may be blocked if it is referenced by prices/payments.")) return;
    try {
      await deleteFuelType(accessToken, id);
      fetchFuelTypes();
    } catch (error: any) {
      console.error(error);
      alert(error?.message ?? "Failed to delete fuel type");
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-fuchsia-950 to-neutral-900 px-6 py-7 shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-fuchsia-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-fuchsia-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>local_gas_station</span>
              <span className="text-[10px] font-black tracking-[0.25em] text-fuchsia-400 uppercase">System Catalog</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Fuel Types</h1>
            <p className="text-sm text-neutral-400 font-medium">Create and manage the fuel type options used across the platform.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-transparent text-white border-white/20 hover:bg-white/10"
              onClick={() => setIncludeInactive((v) => !v)}
            >
              {includeInactive ? "Hide Inactive" : "Show Inactive"}
            </Button>
            <CreateFuelTypeDialog onSuccess={fetchFuelTypes} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-outline/10 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price (Birr/L)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Loading fuel types...
                </TableCell>
              </TableRow>
            ) : fuelTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No fuel types found.
                </TableCell>
              </TableRow>
            ) : (
              fuelTypes.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono font-semibold">{t.code}</TableCell>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>
                    {t.pricePerLiter ? (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                        {Number(t.pricePerLiter).toFixed(2)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-500 ring-1 ring-inset ring-gray-700/10">
                        Not set
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{t.isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <EditFuelTypeDialog fuelType={t} onSuccess={fetchFuelTypes} />
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(t.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function CreateFuelTypeDialog({ onSuccess }: { onSuccess: () => void }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ code: "", name: "", pricePerLiter: "", isActive: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    try {
      setIsSubmitting(true);
      await createFuelTypeWithPrice(accessToken, {
        code: formData.code,
        name: formData.name,
        pricePerLiter: parseFloat(formData.pricePerLiter),
        isActive: formData.isActive,
      });
      onSuccess();
      setOpen(false);
      setFormData({ code: "", name: "", pricePerLiter: "", isActive: true });
    } catch (error: any) {
      console.error(error);
      alert(error?.message ?? "Failed to create fuel type");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-container text-on-primary-container hover:bg-surface-tint hover:text-white transition-all shadow-sm font-label-caps text-[10px] uppercase tracking-widest px-4 h-9 rounded-full">
          Add Fuel Type
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Fuel Type</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Code</Label>
            <Input
              required
              value={formData.code}
              onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
              placeholder="e.g. DIESEL"
            />
          </div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Diesel"
            />
          </div>
          <div className="space-y-2">
            <Label>Price per Liter (Birr)</Label>
            <Input
              type="number"
              step="0.01"
              required
              value={formData.pricePerLiter}
              onChange={(e) => setFormData((p) => ({ ...p, pricePerLiter: e.target.value }))}
              placeholder="e.g. 74.50"
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.isActive ? "ACTIVE" : "INACTIVE"}
              onValueChange={(v) => setFormData((p) => ({ ...p, isActive: v === "ACTIVE" }))}
            >
              <SelectTrigger className="w-full bg-transparent">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditFuelTypeDialog({ fuelType, onSuccess }: { fuelType: FuelType; onSuccess: () => void }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    code: fuelType.code, 
    name: fuelType.name, 
    pricePerLiter: fuelType.pricePerLiter?.toString() || "", 
    isActive: fuelType.isActive 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setFormData({ 
      code: fuelType.code, 
      name: fuelType.name, 
      pricePerLiter: fuelType.pricePerLiter?.toString() || "", 
      isActive: fuelType.isActive 
    });
  }, [open, fuelType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    try {
      setIsSubmitting(true);
      
      // Update fuel type details
      await updateFuelType(accessToken, fuelType.id, {
        code: formData.code,
        name: formData.name,
        isActive: formData.isActive,
      });

      // Update price if provided
      if (formData.pricePerLiter && parseFloat(formData.pricePerLiter) > 0) {
        await upsertFuelPrice(accessToken, {
          fuelTypeCode: formData.code,
          pricePerLiter: parseFloat(formData.pricePerLiter),
        });
      }

      onSuccess();
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      alert(error?.message ?? "Failed to update fuel type");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Fuel Type</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Code</Label>
            <Input
              required
              value={formData.code}
              onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Price per Liter (Birr)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.pricePerLiter}
              onChange={(e) => setFormData((p) => ({ ...p, pricePerLiter: e.target.value }))}
              placeholder="e.g. 74.50"
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.isActive ? "ACTIVE" : "INACTIVE"}
              onValueChange={(v) => setFormData((p) => ({ ...p, isActive: v === "ACTIVE" }))}
            >
              <SelectTrigger className="w-full bg-transparent">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

