"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import {
  createVehicleCategory,
  deleteVehicleCategory,
  getVehicleCategories,
  updateVehicleCategory,
  VehicleCategory,
} from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function VehicleCategoriesPage() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await getVehicleCategories(accessToken, { includeInactive: true });
      setRows(res.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [accessToken]);

  const toggleActive = async (row: VehicleCategory) => {
    if (!accessToken) return;
    await updateVehicleCategory(accessToken, row.id, { isActive: !row.isActive });
    await load();
  };

  const remove = async (row: VehicleCategory) => {
    if (!accessToken) return;
    if (!confirm(`Are you sure you want to delete the category "${row.name}"?`)) return;
    await deleteVehicleCategory(accessToken, row.id);
    await load();
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-950 to-neutral-900 px-6 py-7 shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-emerald-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
              <span className="text-[10px] font-black tracking-[0.25em] text-emerald-400 uppercase">Policy Framework</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Vehicle Categories</h1>
            <p className="text-sm text-neutral-400 font-medium">Define vehicle classes, subsidy rules, and allocation quotas.</p>
          </div>
          <CreateCategoryDialog onSuccess={load} />
        </div>
      </div>

      <div className="rounded-xl border border-outline/10 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Subsidy (%)</TableHead>
              <TableHead>Quotas (Liters)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Loading categories...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-700/10">
                      {row.code}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-neutral-800">{row.name}</TableCell>
                  <TableCell>
                    <span className="font-mono text-sm font-semibold text-emerald-600">
                      {(Number(row.fuelSubsidyPercentage) || 0).toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {row.quotaRules.map((rule) => (
                        <div key={rule.period} className="flex items-center gap-1 bg-neutral-100 rounded px-1.5 py-0.5 border border-neutral-200">
                          <span className="text-[9px] font-bold text-neutral-500 uppercase">{rule.period.charAt(0)}</span>
                          <span className="text-[10px] font-bold text-neutral-700">{Number(rule.litersLimit).toFixed(0)}L</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset",
                      row.isActive 
                        ? "bg-green-50 text-green-700 ring-green-600/20" 
                        : "bg-red-50 text-red-700 ring-red-600/20"
                    )}>
                      {row.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <EditCategoryDialog category={row} onSuccess={load} />
                    <Button variant="outline" size="sm" onClick={() => void toggleActive(row)}>
                      {row.isActive ? "Disable" : "Enable"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => void remove(row)}>
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

function CreateCategoryDialog({ onSuccess }: { onSuccess: () => void }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    code: "",
    name: "",
    fuelSubsidyPercentage: "0",
    dailyQuota: "",
    weeklyQuota: "",
    monthlyQuota: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    if (!form.code.trim() || !form.name.trim()) return;
    
    setIsSubmitting(true);
    try {
      const subsidy = Number(form.fuelSubsidyPercentage);
      const quotaRules: Array<{ period: "DAILY" | "WEEKLY" | "MONTHLY"; litersLimit: number }> = [];
      const daily = Number(form.dailyQuota);
      const weekly = Number(form.weeklyQuota);
      const monthly = Number(form.monthlyQuota);
      
      if (Number.isFinite(daily) && daily > 0) quotaRules.push({ period: "DAILY", litersLimit: daily });
      if (Number.isFinite(weekly) && weekly > 0) quotaRules.push({ period: "WEEKLY", litersLimit: weekly });
      if (Number.isFinite(monthly) && monthly > 0) quotaRules.push({ period: "MONTHLY", litersLimit: monthly });

      await createVehicleCategory(accessToken, {
        code: form.code.trim(),
        name: form.name.trim(),
        fuelSubsidyPercentage: subsidy,
        quotaRules,
      });
      
      onSuccess();
      setOpen(false);
      setForm({
        code: "",
        name: "",
        fuelSubsidyPercentage: "0",
        dailyQuota: "",
        weeklyQuota: "",
        monthlyQuota: "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-container text-on-primary-container hover:bg-surface-tint hover:text-white transition-all shadow-sm font-label-caps text-[10px] uppercase tracking-widest px-4 h-9 rounded-full">
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Vehicle Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" placeholder="e.g. TAXI" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" placeholder="e.g. Public Taxi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subsidy">Fuel Subsidy Percentage (%)</Label>
            <Input id="subsidy" type="number" step="0.01" value={form.fuelSubsidyPercentage} onChange={(e) => setForm({ ...form, fuelSubsidyPercentage: e.target.value })} />
          </div>
          <div className="border-t pt-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3 block">Quota Limits (Liters)</Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="daily" className="text-[10px] uppercase">Daily</Label>
                <Input id="daily" type="number" value={form.dailyQuota} onChange={(e) => setForm({ ...form, dailyQuota: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weekly" className="text-[10px] uppercase">Weekly</Label>
                <Input id="weekly" type="number" value={form.weeklyQuota} onChange={(e) => setForm({ ...form, weeklyQuota: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="monthly" className="text-[10px] uppercase">Monthly</Label>
                <Input id="monthly" type="number" value={form.monthlyQuota} onChange={(e) => setForm({ ...form, monthlyQuota: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Category"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditCategoryDialog({ category, onSuccess }: { category: VehicleCategory; onSuccess: () => void }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    code: category.code,
    name: category.name,
    fuelSubsidyPercentage: String(category.fuelSubsidyPercentage),
    dailyQuota: String(category.quotaRules.find(r => r.period === "DAILY")?.litersLimit || ""),
    weeklyQuota: String(category.quotaRules.find(r => r.period === "WEEKLY")?.litersLimit || ""),
    monthlyQuota: String(category.quotaRules.find(r => r.period === "MONTHLY")?.litersLimit || ""),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    
    setIsSubmitting(true);
    try {
      const subsidy = Number(form.fuelSubsidyPercentage);
      const quotaRules: Array<{ period: "DAILY" | "WEEKLY" | "MONTHLY"; litersLimit: number }> = [];
      const daily = Number(form.dailyQuota);
      const weekly = Number(form.weeklyQuota);
      const monthly = Number(form.monthlyQuota);
      
      if (Number.isFinite(daily) && daily > 0) quotaRules.push({ period: "DAILY", litersLimit: daily });
      if (Number.isFinite(weekly) && weekly > 0) quotaRules.push({ period: "WEEKLY", litersLimit: weekly });
      if (Number.isFinite(monthly) && monthly > 0) quotaRules.push({ period: "MONTHLY", litersLimit: monthly });

      await updateVehicleCategory(accessToken, category.id, {
        code: form.code.trim(),
        name: form.name.trim(),
        fuelSubsidyPercentage: subsidy,
        quotaRules,
      });
      
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Vehicle Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Code</Label>
              <Input id="edit-code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Display Name</Label>
              <Input id="edit-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-subsidy">Fuel Subsidy Percentage (%)</Label>
            <Input id="edit-subsidy" type="number" step="0.01" value={form.fuelSubsidyPercentage} onChange={(e) => setForm({ ...form, fuelSubsidyPercentage: e.target.value })} />
          </div>
          <div className="border-t pt-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3 block">Quota Limits (Liters)</Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-daily" className="text-[10px] uppercase">Daily</Label>
                <Input id="edit-daily" type="number" value={form.dailyQuota} onChange={(e) => setForm({ ...form, dailyQuota: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-weekly" className="text-[10px] uppercase">Weekly</Label>
                <Input id="edit-weekly" type="number" value={form.weeklyQuota} onChange={(e) => setForm({ ...form, weeklyQuota: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-monthly" className="text-[10px] uppercase">Monthly</Label>
                <Input id="edit-monthly" type="number" value={form.monthlyQuota} onChange={(e) => setForm({ ...form, monthlyQuota: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
