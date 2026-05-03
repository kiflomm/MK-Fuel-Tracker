"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import {
  adjustStationFuelInventory,
  getFuelInventoryAdjustments,
  getFuelTypes,
  getStation,
  getStationFuelInventory,
  type FuelInventoryAdjustmentEntry,
  type FuelType,
  type Station,
  type StationFuelInventoryItem,
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function formatL(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function StationFuelInventoryPage() {
  const params = useParams();
  const stationIdRaw = params.stationId;
  const stationId =
    typeof stationIdRaw === "string"
      ? parseInt(stationIdRaw, 10)
      : Array.isArray(stationIdRaw)
        ? parseInt(stationIdRaw[0] ?? "", 10)
        : NaN;

  const { accessToken } = useAuth();
  const [station, setStation] = useState<Station | null>(null);
  const [inventory, setInventory] = useState<StationFuelInventoryItem[]>([]);
  const [adjustments, setAdjustments] = useState<FuelInventoryAdjustmentEntry[]>(
    [],
  );
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [stationError, setStationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fuelTypeId, setFuelTypeId] = useState("");
  const [remainingLiters, setRemainingLiters] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const loadAll = useCallback(async () => {
    if (!accessToken || !Number.isFinite(stationId) || stationId < 1) return;
    setLoading(true);
    setStationError(null);
    try {
      const [stationRes, invRes, adjRes, typesRes] = await Promise.all([
        getStation(accessToken, stationId),
        getStationFuelInventory(accessToken, stationId),
        getFuelInventoryAdjustments(accessToken, {
          stationId,
          limit: 100,
          offset: 0,
        }),
        getFuelTypes(accessToken, { includeInactive: true }),
      ]);
      if (stationRes.data) setStation(stationRes.data);
      if (invRes.data) setInventory(invRes.data);
      if (adjRes.data) setAdjustments(adjRes.data);
      if (typesRes.data) {
        setFuelTypes(typesRes.data);
        setFuelTypeId((prev) => {
          if (prev) return prev;
          const firstActive = typesRes.data!.find((t) => t.isActive);
          return String((firstActive ?? typesRes.data![0]).id);
        });
      }
    } catch (e) {
      console.error(e);
      setStationError("Could not load station or inventory.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, stationId]);

  useEffect(() => {
    if (!accessToken || !Number.isFinite(stationId) || stationId < 1) {
      setLoading(false);
      return;
    }
    void loadAll();
  }, [accessToken, stationId, loadAll]);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !fuelTypeId || !Number.isFinite(stationId)) return;
    const liters = parseFloat(remainingLiters);
    if (Number.isNaN(liters) || liters < 0) {
      alert("Enter a valid liters amount (≥ 0).");
      return;
    }
    setSubmitting(true);
    try {
      await adjustStationFuelInventory(accessToken, stationId, {
        fuelTypeId: Number(fuelTypeId),
        remainingLiters: liters,
        reason: reason.trim() || undefined,
        note: note.trim() || undefined,
      });
      setRemainingLiters("");
      setReason("");
      setNote("");
      await loadAll();
    } catch (err) {
      console.error(err);
      alert("Adjustment failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!Number.isFinite(stationId) || stationId < 1) {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/app/admin/stations">
            <span className="material-symbols-outlined text-base mr-1 align-middle">
              arrow_back
            </span>
            Stations
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">Invalid station.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/app/admin/stations">
            <span className="material-symbols-outlined text-base mr-1 align-middle">
              arrow_back
            </span>
            Stations
          </Link>
        </Button>
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-950 to-neutral-900 px-6 py-7 shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="material-symbols-outlined text-amber-400 text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              inventory_2
            </span>
            <span className="text-[10px] font-black tracking-[0.25em] text-amber-400 uppercase">
              Station inventory
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">
            {station?.name ?? `Station ${stationId}`}
          </h1>
          <p className="text-sm text-neutral-400 font-medium">
            Per–fuel-type remaining liters and full adjustment audit trail.
          </p>
        </div>
      </div>

      {stationError ? (
        <p className="text-sm text-destructive">{stationError}</p>
      ) : null}

      <Tabs defaultValue="overview">
        <TabsList variant="line" className="w-full justify-start">
          <TabsTrigger value="overview">Inventory & adjust</TabsTrigger>
          <TabsTrigger value="history">Audit history</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => void loadAll()} disabled={loading}>
              <span className="material-symbols-outlined text-base mr-1 align-middle">refresh</span>
              Refresh
            </Button>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground py-6">Loading…</p>
          ) : (
            <>
              <div className="rounded-lg border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-left">
                      <th className="px-3 py-2">Fuel</th>
                      <th className="px-3 py-2">Code</th>
                      <th className="px-3 py-2 text-right">Remaining (L)</th>
                      <th className="px-3 py-2 text-right">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-8 text-center text-muted-foreground"
                        >
                          No inventory rows yet. Submit an adjustment below to create one.
                        </td>
                      </tr>
                    ) : (
                      inventory.map((row) => (
                        <tr key={row.fuelTypeId} className="border-b last:border-0">
                          <td className="px-3 py-2 font-medium">
                            {row.fuelTypeName}
                            {!row.fuelTypeIsActive ? (
                              <span className="ml-2 text-[10px] text-amber-700">
                                Inactive
                              </span>
                            ) : null}
                          </td>
                          <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                            {row.fuelTypeCode}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums font-semibold">
                            {formatL(row.remainingLiters)}
                          </td>
                          <td className="px-3 py-2 text-right text-xs text-muted-foreground">
                            {row.inventoryUpdatedAt
                              ? new Date(row.inventoryUpdatedAt).toLocaleString()
                              : "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <form
                onSubmit={handleAdjust}
                className="space-y-3 rounded-lg border p-4 bg-muted/20"
              >
                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Set remaining liters (logged)
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Fuel type</Label>
                    <Select value={fuelTypeId} onValueChange={setFuelTypeId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map((ft) => (
                          <SelectItem key={ft.id} value={String(ft.id)}>
                            {ft.name} ({ft.code}){!ft.isActive ? " · inactive" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inv-liters">New remaining liters</Label>
                    <Input
                      id="inv-liters"
                      type="number"
                      step="any"
                      min={0}
                      required
                      value={remainingLiters}
                      onChange={(e) => setRemainingLiters(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inv-reason">Reason (optional)</Label>
                  <Input
                    id="inv-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Physical dip, delivery received"
                    maxLength={500}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inv-note">Note (optional)</Label>
                  <Textarea
                    id="inv-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Additional context…"
                    maxLength={2000}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={submitting || !fuelTypeId}>
                    {submitting ? "Saving…" : "Apply adjustment"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <div className="flex justify-end mb-4">
            <Button type="button" variant="outline" size="sm" onClick={() => void loadAll()} disabled={loading}>
              <span className="material-symbols-outlined text-base mr-1 align-middle">refresh</span>
              Refresh
            </Button>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground py-6">Loading…</p>
          ) : adjustments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6">
              No adjustments recorded for this station yet.
            </p>
          ) : (
            <div className="rounded-lg border max-h-[min(520px,60vh)] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                  <tr className="border-b text-[10px] font-black uppercase tracking-widest text-muted-foreground text-left">
                    <th className="px-2 py-2">When</th>
                    <th className="px-2 py-2">Fuel</th>
                    <th className="px-2 py-2 text-right">Previous</th>
                    <th className="px-2 py-2 text-right">Updated</th>
                    <th className="px-2 py-2 text-right">Δ</th>
                    <th className="px-2 py-2">By</th>
                    <th className="px-2 py-2">Reason / note</th>
                  </tr>
                </thead>
                <tbody>
                  {adjustments.map((a) => (
                    <tr key={a.id} className="border-b last:border-0 align-top">
                      <td className="px-2 py-2 whitespace-nowrap text-muted-foreground">
                        {new Date(a.changedAt).toLocaleString()}
                      </td>
                      <td className="px-2 py-2">
                        <div className="font-medium">{a.fuelTypeName}</div>
                        <div className="font-mono text-muted-foreground">{a.fuelTypeCode}</div>
                      </td>
                      <td className="px-2 py-2 text-right tabular-nums">
                        {formatL(a.previousLiters)}
                      </td>
                      <td className="px-2 py-2 text-right tabular-nums font-medium">
                        {formatL(a.updatedLiters)}
                      </td>
                      <td className="px-2 py-2 text-right tabular-nums">{formatL(a.deltaLiters)}</td>
                      <td className="px-2 py-2">
                        {a.changedByFirstName} {a.changedByLastName}
                        <div
                          className="text-muted-foreground truncate max-w-[8rem]"
                          title={a.changedByEmail}
                        >
                          {a.changedByEmail}
                        </div>
                      </td>
                      <td className="px-2 py-2 max-w-[14rem]">
                        {a.reason ? (
                          <div className="font-medium text-foreground">{a.reason}</div>
                        ) : null}
                        {a.note ? (
                          <div className="text-muted-foreground whitespace-pre-wrap">{a.note}</div>
                        ) : null}
                        {!a.reason && !a.note ? (
                          <span className="text-muted-foreground">—</span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
