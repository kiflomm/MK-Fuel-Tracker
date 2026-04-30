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
  const [form, setForm] = useState({ code: "", name: "", fuelSubsidyPercentage: "0" });

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
    await createVehicleCategory(accessToken, {
      code: form.code.trim(),
      name: form.name.trim(),
      fuelSubsidyPercentage: subsidy,
    });
    setForm({ code: "", name: "", fuelSubsidyPercentage: "0" });
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
      <div className="flex gap-2">
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
