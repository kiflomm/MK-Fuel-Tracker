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
        <Button variant="outline" size="sm" asChild>
          <Link href="/app/admin/users">
            <span className="material-symbols-outlined text-base mr-1 align-middle">arrow_back</span>
            Users
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">Invalid user.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/app/admin/users">
            <span className="material-symbols-outlined text-base mr-1 align-middle">arrow_back</span>
            Users
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">Loading…</p>
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
        <Button variant="outline" size="sm" asChild>
          <Link href="/app/admin/users">
            <span className="material-symbols-outlined text-base mr-1 align-middle">arrow_back</span>
            Users
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Manage vehicles</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {ownerLabel}
          <span className="text-black/40"> · ID {owner.id}</span>
        </p>
      </div>

      <div className="rounded-md border p-4 space-y-3">
        <h2 className="text-sm font-semibold">Registered vehicles</h2>
        {vehicles.length === 0 ? (
          <p className="text-sm text-muted-foreground">No vehicles yet.</p>
        ) : (
          <ul className="space-y-2">
            {vehicles.map((v) => (
              <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span>
                  {v.plateNumber} — {v.categoryName ?? v.categoryCode ?? v.categoryId}
                </span>
                <Button type="button" size="sm" variant="outline" onClick={() => void selectVehicleForQuota(v.id)}>
                  Edit quota
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-md border p-4 space-y-3">
        <h2 className="text-sm font-semibold">Add vehicle</h2>
        <form onSubmit={handleAdd} className="space-y-3 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="plate">Plate number</Label>
            <Input
              id="plate"
              placeholder="Plate number"
              value={draft.plateNumber}
              onChange={(e) => setDraft({ ...draft, plateNumber: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={draft.categoryId} onValueChange={(v) => setDraft({ ...draft, categoryId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
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
          <Button type="submit">Add vehicle</Button>
        </form>
      </div>

      {selectedVehicleId ? (
        <div className="rounded-md border p-4 space-y-3">
          <h2 className="text-sm font-semibold">
            Manual quota{selectedPlate ? ` — ${selectedPlate}` : ` (vehicle #${selectedVehicleId})`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
            <div className="space-y-2">
              <Label htmlFor="quota-daily">Daily liters</Label>
              <Input
                id="quota-daily"
                type="number"
                placeholder="Daily liters"
                value={quotaDraft.DAILY}
                onChange={(e) => setQuotaDraft({ ...quotaDraft, DAILY: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quota-weekly">Weekly liters</Label>
              <Input
                id="quota-weekly"
                type="number"
                placeholder="Weekly liters"
                value={quotaDraft.WEEKLY}
                onChange={(e) => setQuotaDraft({ ...quotaDraft, WEEKLY: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quota-monthly">Monthly liters</Label>
              <Input
                id="quota-monthly"
                type="number"
                placeholder="Monthly liters"
                value={quotaDraft.MONTHLY}
                onChange={(e) => setQuotaDraft({ ...quotaDraft, MONTHLY: e.target.value })}
              />
            </div>
          </div>
          <Button type="button" onClick={() => void saveVehicleQuota()}>
            Save vehicle quota
          </Button>
        </div>
      ) : null}
    </div>
  );
}
