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

function formatL(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "0.00";
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDateTime(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
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
  const [litersToAdd, setLitersToAdd] = useState("");
  const [adjustFormError, setAdjustFormError] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const selectedInventoryRow = inventory.find(
    (r) => r.fuelTypeId === Number(fuelTypeId),
  );

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
      const fuelTypesData = typesRes.data ?? [];
      if (fuelTypesData.length > 0) {
        setFuelTypes(fuelTypesData);
        setFuelTypeId((prev) => {
          if (prev) return prev;
          const firstActive = fuelTypesData.find((t) => t.isActive);
          const fallback = fuelTypesData[0];
          const selected = firstActive ?? fallback;
          return selected?.id !== undefined ? String(selected.id) : "";
        });
      } else {
        setFuelTypes([]);
        setFuelTypeId("");
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
    setAdjustFormError(null);
    if (!accessToken || !fuelTypeId || !Number.isFinite(stationId)) return;
    const delta = parseFloat(litersToAdd);
    if (Number.isNaN(delta) || delta <= 0) {
      setAdjustFormError("Enter a positive number of liters to add.");
      return;
    }
    setSubmitting(true);
    try {
      await adjustStationFuelInventory(accessToken, stationId, {
        fuelTypeId: Number(fuelTypeId),
        deltaLiters: delta,
        reason: reason.trim() || undefined,
        note: note.trim() || undefined,
      });
      setLitersToAdd("");
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

      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-950 to-neutral-900 px-6 py-7 shadow-lg min-h-[160px] flex flex-col justify-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full -ml-10 -mb-10 blur-2xl" />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-400/20">
                <span
                  className="material-symbols-outlined text-amber-400 text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  inventory_2
                </span>
              </div>
              <span className="text-[10px] font-black tracking-[0.25em] text-amber-400/80 uppercase">
                Stock Management
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-2">
              {station?.name ?? `Station ${stationId}`}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium max-w-xl leading-relaxed">
              Real-time monitoring of fuel levels with a complete auditable adjustment history for {station?.name || "this station"}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => void loadAll()} 
              disabled={loading}
              className="bg-white/5 border-white/10 text-white hover:bg-white/20 transition-all font-bold text-[10px] uppercase tracking-widest px-4 h-9 rounded-full backdrop-blur-sm"
            >
              <span className={cn("material-symbols-outlined text-base mr-2", loading && "animate-spin")}>refresh</span>
              {loading ? "Updating..." : "Refresh Status"}
            </Button>
          </div>
        </div>
      </div>

      {stationError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">error</span>
          {stationError}
        </div>
      ) : null}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList variant="line" className="w-full justify-start border-b border-outline/10 h-auto p-0 bg-transparent space-x-8">
          <TabsTrigger 
            value="overview" 
            className="px-0 py-3 text-[11px] font-bold uppercase tracking-widest data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none transition-all"
          >
            Inventory & Adjust
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="px-0 py-3 text-[11px] font-bold uppercase tracking-widest data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none transition-all"
          >
            Audit History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-6 focus-visible:outline-none">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
              <span className="material-symbols-outlined animate-spin text-3xl text-amber-400">sync</span>
              <p className="text-sm font-medium">Loading inventory data...</p>
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-outline/10 overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5">Fuel</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5">Code</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 text-right">Remaining (L)</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 text-right">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="p-0">
                          <Empty className="py-20 border-0 rounded-none bg-neutral-50/30">
                            <EmptyHeader>
                              <EmptyMedia variant="icon">
                                <span className="material-symbols-outlined text-amber-400">inventory_2</span>
                              </EmptyMedia>
                              <EmptyTitle className="text-neutral-900 font-bold">No inventory rows</EmptyTitle>
                              <EmptyDescription>
                                Submit an adjustment below to initialize fuel stock for this station.
                              </EmptyDescription>
                            </EmptyHeader>
                          </Empty>
                        </TableCell>
                      </TableRow>
                    ) : (
                      inventory.map((row) => (
                        <TableRow key={row.fuelTypeId} className="group transition-colors hover:bg-neutral-50/50">
                          <TableCell className="px-4 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-neutral-900 text-sm leading-tight">
                                {row.fuelTypeName}
                              </span>
                              {!row.fuelTypeIsActive && (
                                <div className="mt-1">
                                  <span className="inline-flex items-center rounded-sm bg-amber-50 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-700 ring-1 ring-inset ring-amber-600/10">
                                    Inactive
                                  </span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <span className="font-mono text-[10px] text-neutral-400 font-bold bg-neutral-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                              {row.fuelTypeCode}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-4 text-right">
                             <div className="inline-flex flex-col items-end">
                               <span className="tabular-nums font-black text-lg text-neutral-900 leading-none">
                                 {formatL(row.remainingLiters)}
                               </span>
                               <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Liters Available</span>
                             </div>
                          </TableCell>
                          <TableCell className="px-4 py-4 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xs font-bold text-neutral-600">
                                {formatDateTime(row.inventoryUpdatedAt).split(",")[0]}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-medium italic">
                                {formatDateTime(row.inventoryUpdatedAt).split(",")[1]}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <Card className="border-outline/10 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/20 pb-4">
                  <CardTitle className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Add to stock (logged)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    The liters you enter are added to the current balance for that fuel type. Audit
                    history records previous total, new total, and liters added.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleAdjust} className="space-y-4">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-neutral-700">Fuel type</Label>
                        <Select
                          value={fuelTypeId}
                          onValueChange={(v) => {
                            setFuelTypeId(v);
                            setAdjustFormError(null);
                          }}
                        >
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
                        {selectedInventoryRow ? (
                          <p className="text-xs text-muted-foreground">
                            Current remaining:{" "}
                            <span className="font-bold text-indigo-600 tabular-nums">
                              {formatL(selectedInventoryRow.remainingLiters)} L
                            </span>
                          </p>
                        ) : fuelTypeId ? (
                          <p className="text-xs text-muted-foreground">
                            Current remaining: <span className="font-medium">0.00 L</span> (no row yet)
                          </p>
                        ) : null}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inv-liters" className="text-xs font-bold text-neutral-700">Liters to add</Label>
                        <Input
                          id="inv-liters"
                          type="number"
                          step="any"
                          min={0.0001}
                          required
                          value={litersToAdd}
                          onChange={(e) => {
                            setLitersToAdd(e.target.value);
                            setAdjustFormError(null);
                          }}
                          placeholder="e.g. 500"
                          className="bg-neutral-50/50"
                        />
                      </div>
                    </div>
                    {adjustFormError ? (
                      <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{adjustFormError}</p>
                    ) : null}
                    <div className="space-y-2">
                      <Label htmlFor="inv-reason" className="text-xs font-bold text-neutral-700">Reason (optional)</Label>
                      <Input
                        id="inv-reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g. Physical dip, delivery received"
                        maxLength={500}
                        className="bg-neutral-50/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inv-note" className="text-xs font-bold text-neutral-700">Note (optional)</Label>
                      <Textarea
                        id="inv-note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Additional context…"
                        maxLength={2000}
                        rows={3}
                        className="bg-neutral-50/50 resize-none"
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button 
                        type="submit" 
                        disabled={submitting || !fuelTypeId} 
                        className="bg-primary-container text-on-primary-container hover:bg-surface-tint hover:text-white transition-all shadow-md font-bold text-[11px] uppercase tracking-widest px-6 h-10 rounded-full"
                      >
                        {submitting ? "Saving…" : "Apply adjustment"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="history" className="pt-6 focus-visible:outline-none">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
              <span className="material-symbols-outlined animate-spin text-3xl text-indigo-400">sync</span>
              <p className="text-sm font-medium">Loading audit history...</p>
            </div>
          ) : adjustments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6">
              No adjustments recorded for this station yet.
            </p>
          ) : (
            <div className="rounded-xl border border-outline/10 overflow-hidden shadow-sm bg-white">
              <Table className="text-xs">
                <TableHeader className="bg-muted/40 sticky top-0 z-10">
                  <TableRow className="hover:bg-muted/40">
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5">When</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5">Fuel</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 text-right">Previous</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 text-right">Updated</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5 text-right">Δ</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5">By</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider px-4 py-3.5">Reason / note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adjustments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                         <Empty className="py-20 border-0 rounded-none bg-neutral-50/30">
                            <EmptyHeader>
                              <EmptyMedia variant="icon">
                                <span className="material-symbols-outlined text-neutral-400">history</span>
                              </EmptyMedia>
                              <EmptyTitle className="text-neutral-900 font-bold">No history available</EmptyTitle>
                              <EmptyDescription>
                                No fuel adjustments have been recorded for this station yet.
                              </EmptyDescription>
                            </EmptyHeader>
                          </Empty>
                      </TableCell>
                    </TableRow>
                  ) : (
                    adjustments.map((a) => (
                      <TableRow key={a.id} className="align-top group">
                        <TableCell className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-neutral-700">
                              {formatDateTime(a.changedAt).split(",")[0]}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-medium italic">
                              {formatDateTime(a.changedAt).split(",")[1]}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <div className="font-bold text-neutral-900 text-sm">{a.fuelTypeName}</div>
                          <div className="mt-1">
                             <span className="font-mono text-[9px] text-neutral-400 font-bold bg-neutral-100 px-1.5 py-0.5 rounded uppercase tracking-[0.1em]">
                                {a.fuelTypeCode}
                             </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-right tabular-nums text-neutral-500 font-medium">
                          {formatL(a.previousLiters)}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-right tabular-nums font-black text-indigo-600 bg-indigo-50/20 group-hover:bg-indigo-50/40 transition-colors">
                          {formatL(a.updatedLiters)}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-right tabular-nums font-bold text-neutral-900">
                          {formatL(a.deltaLiters)}
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-neutral-900 text-xs">
                              {`${(a.changedByFirstName ?? "").trim()} ${(a.changedByLastName ?? "").trim()}`.trim() || "System Auto"}
                            </span>
                            <span
                              className="text-[10px] text-neutral-400 font-medium truncate max-w-[9rem]"
                              title={a.changedByEmail}
                            >
                              {a.changedByEmail}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4 max-w-[16rem]">
                          {a.reason ? (
                            <div className="font-bold text-neutral-800 text-xs mb-1.5 underline decoration-amber-400/30 underline-offset-4 decoration-2">{a.reason}</div>
                          ) : null}
                          {a.note ? (
                            <div className="text-neutral-500 text-[11px] leading-relaxed italic bg-neutral-50 p-2 rounded-sm border-l-2 border-neutral-200">{a.note}</div>
                          ) : null}
                          {!a.reason && !a.note ? (
                            <span className="text-neutral-300">—</span>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
