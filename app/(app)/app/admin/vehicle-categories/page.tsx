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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-950 to-neutral-900 px-6 py-7 shadow-lg min-h-[160px] flex flex-col justify-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full -ml-10 -mb-10 blur-2xl" />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-400/20">
                <span className="material-symbols-outlined text-emerald-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
              </div>
              <span className="text-[10px] font-black tracking-[0.25em] text-emerald-400/80 uppercase">Policy Framework</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-2">Vehicle Categories</h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium max-w-xl leading-relaxed">
              Define vehicle classes, subsidy rules, and allocation quotas for the national fuel distribution policy.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CreateCategoryDialog onSuccess={load} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-outline/10 overflow-hidden shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5">Code</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5">Name</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5">Subsidy (%)</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5">Quotas (Liters)</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5">Status</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                   <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined animate-spin text-3xl text-emerald-400">sync</span>
                      <p className="text-sm text-muted-foreground font-medium">Loading categories...</p>
                   </div>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-0">
                   <Empty className="py-20 border-0 rounded-none bg-neutral-50/30">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <span className="material-symbols-outlined text-emerald-400">category</span>
                        </EmptyMedia>
                        <EmptyTitle className="text-neutral-900 font-bold">No categories defined</EmptyTitle>
                        <EmptyDescription>
                          Start by creating a vehicle category to define fuel subsidies and quotas.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className="group transition-colors hover:bg-neutral-50/50">
                  <TableCell className="px-4 py-4">
                    <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider ring-1 ring-inset ring-emerald-600/10">
                      {row.code}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 font-black text-neutral-900 text-sm">{row.name}</TableCell>
                  <TableCell className="px-4 py-4">
                    <span className="font-mono text-sm font-black text-emerald-600 tabular-nums">
                      {(Number(row.fuelSubsidyPercentage) || 0).toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {row.quotaRules.map((rule) => (
                        <div key={rule.period} className="flex items-center gap-1.5 bg-neutral-50 rounded-md px-2 py-1 border border-neutral-200/60 shadow-sm">
                          <span className="text-[9px] font-black text-neutral-500 uppercase tracking-tighter">{rule.period.charAt(0)}</span>
                          <span className="text-[11px] font-black text-neutral-800 tabular-nums">{Number(rule.litersLimit).toFixed(0)}L</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <span className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset",
                      row.isActive 
                        ? "bg-green-50 text-green-700 ring-green-600/20" 
                        : "bg-red-50 text-red-700 ring-red-600/20"
                    )}>
                      {row.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right space-x-2">
                    <EditCategoryDialog category={row} onSuccess={load} />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => void toggleActive(row)}
                      className="text-[10px] font-bold uppercase tracking-widest px-3 h-8 rounded-full border-neutral-200 hover:bg-neutral-50"
                    >
                      {row.isActive ? "Disable" : "Enable"}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => void remove(row)}
                      className="text-[10px] font-bold uppercase tracking-widest px-3 h-8 rounded-full shadow-sm"
                    >
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
