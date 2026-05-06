"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import {
  addVehiclesToOwner,
  getUserById,
  getVehicleCategories,
  getVehicleQuotaRules,
  updateVehicleQuotaRules,
  type OwnerVehicle,
  type UserWithVehicles,
  type VehicleCategory,
} from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function parseUserId(raw: string | string[] | undefined): number {
  if (typeof raw === "string") return parseInt(raw, 10);
  if (Array.isArray(raw)) return parseInt(raw[0] ?? "", 10);
  return NaN;
}

export default function OwnerVehiclesPage() {
  const params = useParams();
  const ownerUserId = parseUserId(params.userId);
  const { accessToken } = useAuth();

  const [owner, setOwner] = useState<UserWithVehicles | null>(null);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [draft, setDraft] = useState<{ plateNumber: string; categoryId: string }>({
    plateNumber: "",
    categoryId: "",
  });
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [quotaDraft, setQuotaDraft] = useState<{ DAILY: string; WEEKLY: string; MONTHLY: string }>({
    DAILY: "",
    WEEKLY: "",
    MONTHLY: "",
  });

  const vehicles: OwnerVehicle[] = owner?.vehicles ?? [];
  const selectedPlate = vehicles.find((v) => v.id === selectedVehicleId)?.plateNumber;

  const refreshOwner = useCallback(async () => {
    if (!accessToken || !Number.isFinite(ownerUserId) || ownerUserId < 1) return;
    const res = await getUserById(accessToken, ownerUserId);
    setOwner(res.data ?? null);
  }, [accessToken, ownerUserId]);

  useEffect(() => {
    if (!accessToken || !Number.isFinite(ownerUserId) || ownerUserId < 1) {
      setLoading(false);
      setLoadError("Invalid user.");
      return;
    }
    void (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const [userRes, catRes] = await Promise.all([
          getUserById(accessToken, ownerUserId),
          getVehicleCategories(accessToken),
        ]);
        const user = userRes.data ?? null;
        setOwner(user);
        setCategories(catRes.data ?? []);
        if (user && user.role !== "VEHICLE_OWNER") {
          setLoadError("This account is not a vehicle owner.");
        }
      } catch {
        setLoadError("Could not load this user.");
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken, ownerUserId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !Number.isFinite(ownerUserId)) return;
    if (!draft.plateNumber.trim() || !draft.categoryId) return;
    const res = await addVehiclesToOwner(accessToken, ownerUserId, [
      {
        plateNumber: draft.plateNumber.trim(),
        categoryId: Number(draft.categoryId),
      },
    ]);
    setOwner((prev) => (prev ? { ...prev, vehicles: res.data ?? [] } : prev));
    setDraft({ ...draft, plateNumber: "" });
  };

  const selectVehicleForQuota = async (vehicleId: number) => {
    if (!accessToken) return;
    setSelectedVehicleId(vehicleId);
    const res = await getVehicleQuotaRules(accessToken, vehicleId);
    const next = { DAILY: "", WEEKLY: "", MONTHLY: "" };
    for (const rule of res.data ?? []) {
      next[rule.period] = String(rule.litersLimit);
    }
    setQuotaDraft(next);
  };

  const saveVehicleQuota = async () => {
    if (!accessToken || !selectedVehicleId) return;
    const quotaRules: Array<{ period: "DAILY" | "WEEKLY" | "MONTHLY"; litersLimit: number }> = [];
    (["DAILY", "WEEKLY", "MONTHLY"] as const).forEach((period) => {
      const litersLimit = Number(quotaDraft[period]);
      if (Number.isFinite(litersLimit) && litersLimit > 0) {
        quotaRules.push({ period, litersLimit });
      }
    });
    if (quotaRules.length === 0) return;
    await updateVehicleQuotaRules(accessToken, selectedVehicleId, quotaRules);
    await refreshOwner();
  };

  if (!Number.isFinite(ownerUserId) || ownerUserId < 1) {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" asChild className="rounded-full font-bold text-[10px] uppercase tracking-widest px-4 border-neutral-200">
          <Link href="/app/admin/users">
            <span className="material-symbols-outlined text-base mr-2">arrow_back</span>
            Back to Users
          </Link>
        </Button>
        <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-3 bg-neutral-50/50 rounded-2xl border border-dashed">
          <span className="material-symbols-outlined text-4xl text-neutral-300">person_off</span>
          <p className="text-sm font-bold uppercase tracking-widest">Invalid user account</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" asChild className="rounded-full font-bold text-[10px] uppercase tracking-widest px-4 border-neutral-200">
          <Link href="/app/admin/users">
            <span className="material-symbols-outlined text-base mr-2">arrow_back</span>
            Back to Users
          </Link>
        </Button>
        <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-3">
          <span className="material-symbols-outlined animate-spin text-4xl text-cyan-400">sync</span>
          <p className="text-sm font-bold uppercase tracking-widest">Loading vehicle profile...</p>
        </div>
      </div>
    );
  }

  if (loadError || !owner) {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/app/admin/users">
            <span className="material-symbols-outlined text-base mr-1 align-middle">arrow_back</span>
            Users
          </Link>
        </Button>
        <p className="text-sm text-destructive">{loadError ?? "User not found."}</p>
      </div>
    );
  }

  const ownerLabel = `${owner.firstName} ${owner.lastName}`.trim() || owner.email;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" asChild className="rounded-full font-bold text-[10px] uppercase tracking-widest px-4 border-neutral-200">
          <Link href="/app/admin/users">
            <span className="material-symbols-outlined text-base mr-2">arrow_back</span>
            Back to Users
          </Link>
        </Button>
      </div>
      
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-950 to-neutral-900 px-6 py-7 shadow-lg min-h-[160px] flex flex-col justify-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full -ml-10 -mb-10 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-cyan-400/20">
              <span className="material-symbols-outlined text-cyan-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>directions_car</span>
            </div>
            <span className="text-[10px] font-black tracking-[0.25em] text-cyan-400/80 uppercase">Ownership Identity</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-2">
            Manage Vehicles
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-medium max-w-xl leading-relaxed">
            Configure vehicle registrations, category assignments, and custom consumption quotas for <span className="text-white font-bold">{ownerLabel}</span>.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-outline/10 overflow-hidden shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5">Plate Number</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5">Category</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="p-0">
                   <Empty className="py-20 border-0 rounded-none bg-neutral-50/30">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <span className="material-symbols-outlined text-cyan-400">minor_crash</span>
                        </EmptyMedia>
                        <EmptyTitle className="text-neutral-900 font-bold">No vehicles registered</EmptyTitle>
                        <EmptyDescription>
                          This owner has no vehicles attached. Use the form below to add one.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((v) => (
                <TableRow key={v.id} className="group transition-colors hover:bg-neutral-50/50">
                  <TableCell className="px-4 py-4">
                    <span className="font-mono text-[11px] text-neutral-900 font-black bg-neutral-100 px-2.5 py-1 rounded uppercase tracking-[0.05em] border border-neutral-200 shadow-sm">
                      {v.plateNumber}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 font-bold text-neutral-800 text-sm">
                    {v.categoryName ?? v.categoryCode ?? `ID: ${v.categoryId}`}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right">
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      onClick={() => void selectVehicleForQuota(v.id)}
                      className="text-[10px] font-bold uppercase tracking-widest px-4 h-8 rounded-full border-neutral-200 hover:bg-neutral-50 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-xs mr-2">settings_suggest</span>
                      Edit Quota
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-outline/10 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/20 pb-4">
            <CardTitle className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add_circle</span>
              Register New Vehicle
            </CardTitle>
            <CardDescription className="text-xs">
              Attach a new plate number and vehicle category to this owner account.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plate" className="text-xs font-bold text-neutral-700">Plate Number</Label>
                <Input
                  id="plate"
                  placeholder="e.g. AA 12345"
                  value={draft.plateNumber}
                  onChange={(e) => setDraft({ ...draft, plateNumber: e.target.value })}
                  required
                  className="bg-neutral-50/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-neutral-700">Vehicle Category</Label>
                <Select value={draft.categoryId} onValueChange={(v) => setDraft({ ...draft, categoryId: v })}>
                  <SelectTrigger className="bg-neutral-50/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name} ({c.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end pt-2">
                <Button 
                  type="submit" 
                  className="bg-primary-container text-on-primary-container hover:bg-surface-tint hover:text-white transition-all shadow-md font-bold text-[11px] uppercase tracking-widest px-6 h-10 rounded-full"
                >
                  Register Vehicle
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {selectedVehicleId ? (
          <Card className="border-outline/10 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <CardHeader className="bg-cyan-50/50 pb-4 border-b border-cyan-100">
              <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">tune</span>
                Manual Overrides {selectedPlate && `— ${selectedPlate}`}
              </CardTitle>
              <CardDescription className="text-xs text-cyan-700/70 font-medium">
                Set specific consumption limits that override the default category policy for this vehicle.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quota-daily" className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Daily (L)</Label>
                    <Input
                      id="quota-daily"
                      type="number"
                      placeholder="Unlimited"
                      value={quotaDraft.DAILY}
                      onChange={(e) => setQuotaDraft({ ...quotaDraft, DAILY: e.target.value })}
                      className="font-black tabular-nums bg-neutral-50/50 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quota-weekly" className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Weekly (L)</Label>
                    <Input
                      id="quota-weekly"
                      type="number"
                      placeholder="Unlimited"
                      value={quotaDraft.WEEKLY}
                      onChange={(e) => setQuotaDraft({ ...quotaDraft, WEEKLY: e.target.value })}
                      className="font-black tabular-nums bg-neutral-50/50 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quota-monthly" className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Monthly (L)</Label>
                    <Input
                      id="quota-monthly"
                      type="number"
                      placeholder="Unlimited"
                      value={quotaDraft.MONTHLY}
                      onChange={(e) => setQuotaDraft({ ...quotaDraft, MONTHLY: e.target.value })}
                      className="font-black tabular-nums bg-neutral-50/50 focus:ring-cyan-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button 
                    type="button" 
                    onClick={() => void saveVehicleQuota()}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white transition-all shadow-md font-bold text-[11px] uppercase tracking-widest px-6 h-10 rounded-full"
                  >
                    Save Override Policy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 rounded-xl border border-dashed text-muted-foreground gap-4 bg-neutral-50/30">
            <span className="material-symbols-outlined text-4xl opacity-20">settings_suggest</span>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-center max-w-[200px] leading-relaxed">
              Select a vehicle to configure custom quota overrides
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
