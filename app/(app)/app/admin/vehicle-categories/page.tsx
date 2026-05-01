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

export default function VehicleCategoriesPage() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<VehicleCategory[]>([]);
  const [form, setForm] = useState({
    code: "",
    name: "",
    fuelSubsidyPercentage: "0",
    dailyQuota: "",
    weeklyQuota: "",
    monthlyQuota: "",
  });

  const load = async () => {
    if (!accessToken) return;
    const res = await getVehicleCategories(accessToken, { includeInactive: true });
    setRows(res.data ?? []);
  };

  useEffect(() => {
    void load();
  }, [accessToken]);

  const createItem = async () => {
    if (!accessToken) return;
    if (!form.code.trim() || !form.name.trim()) return;
    const subsidy = Number(form.fuelSubsidyPercentage);
    if (!Number.isFinite(subsidy) || subsidy < 0 || subsidy > 100) return;

    const quotaRules: Array<{ period: "DAILY" | "WEEKLY" | "MONTHLY"; litersLimit: number }> = [];
    const daily = Number(form.dailyQuota);
    const weekly = Number(form.weeklyQuota);
    const monthly = Number(form.monthlyQuota);
    if (Number.isFinite(daily) && daily > 0) quotaRules.push({ period: "DAILY", litersLimit: daily });
    if (Number.isFinite(weekly) && weekly > 0) quotaRules.push({ period: "WEEKLY", litersLimit: weekly });
    if (Number.isFinite(monthly) && monthly > 0) quotaRules.push({ period: "MONTHLY", litersLimit: monthly });
    if (quotaRules.length === 0) return;

    await createVehicleCategory(accessToken, {
      code: form.code.trim(),
      name: form.name.trim(),
      fuelSubsidyPercentage: subsidy,
      quotaRules,
    });
    setForm({
      code: "",
      name: "",
      fuelSubsidyPercentage: "0",
      dailyQuota: "",
      weeklyQuota: "",
      monthlyQuota: "",
    });
    await load();
  };

  const toggleActive = async (row: VehicleCategory) => {
    if (!accessToken) return;
    await updateVehicleCategory(accessToken, row.id, { isActive: !row.isActive });
    await load();
  };

  const remove = async (row: VehicleCategory) => {
    if (!accessToken) return;
    await deleteVehicleCategory(accessToken, row.id);
    await load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Vehicle Categories</h1>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <Input placeholder="Code (e.g. PRIVATE_CAR)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input
          type="number"
          min={0}
          max={100}
          step="0.01"
          placeholder="Subsidy %"
          value={form.fuelSubsidyPercentage}
          onChange={(e) => setForm({ ...form, fuelSubsidyPercentage: e.target.value })}
        />
        <Input
          type="number"
          min={0}
          step="0.01"
          placeholder="Daily quota (liters)"
          value={form.dailyQuota}
          onChange={(e) => setForm({ ...form, dailyQuota: e.target.value })}
        />
        <Input
          type="number"
          min={0}
          step="0.01"
          placeholder="Weekly quota (liters)"
          value={form.weeklyQuota}
          onChange={(e) => setForm({ ...form, weeklyQuota: e.target.value })}
        />
        <Input
          type="number"
          min={0}
          step="0.01"
          placeholder="Monthly quota (liters)"
          value={form.monthlyQuota}
          onChange={(e) => setForm({ ...form, monthlyQuota: e.target.value })}
        />
      </div>
      <div>
        <Button onClick={() => void createItem()}>Add</Button>
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between rounded border p-3">
            <div>
              <div className="font-medium">{row.name} ({row.code})</div>
              <div className="text-sm text-muted-foreground">
                {(Number(row.fuelSubsidyPercentage) || 0).toFixed(2)}% subsidy · {row.isActive ? "Active" : "Inactive"}
              </div>
              <div className="text-xs text-muted-foreground">
                Quotas: {row.quotaRules.map((rule) => `${rule.period} ${Number(rule.litersLimit).toFixed(2)}L`).join(" · ")}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => void toggleActive(row)}>
                {row.isActive ? "Disable" : "Enable"}
              </Button>
              <Button variant="destructive" onClick={() => void remove(row)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
