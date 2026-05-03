"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import {
  getStations,
  createStation,
  updateStation,
  Station,
  getStationFuelInventory,
  adjustStationFuelInventory,
  getFuelInventoryAdjustments,
  getFuelTypes,
  StationFuelInventoryItem,
  FuelInventoryAdjustmentEntry,
  FuelType,
} from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StationsPage() {
  const { accessToken } = useAuth();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    if (accessToken) {
      fetchStations();
    }
  }, [accessToken]);

  const fetchStations = async () => {
    setLoading(true);
    try {
      if (!accessToken) return;
      const res = await getStations(accessToken);
      if (res.data) setStations(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-950 to-neutral-900 px-6 py-7 shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-amber-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>local_gas_station</span>
              <span className="text-[10px] font-black tracking-[0.25em] text-amber-400 uppercase">Network Infrastructure</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Stations</h1>
            <p className="text-sm text-neutral-400 font-medium">Manage and monitor all fuel stations across the region.</p>
          </div>
          <CreateStationDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            onSuccess={fetchStations}
          />
        </div>
      </div>

      <div className="rounded-xl border border-outline/10 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Coordinates</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Legacy total (L)</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Loading stations...
                </TableCell>
              </TableRow>
            ) : stations.length === 0 ? (
              <TableRow>
               <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                   No stations found.
                </TableCell>
              </TableRow>
            ) : (
              stations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell>{station.id}</TableCell>
                  <TableCell className="font-medium">{station.name}</TableCell>
                  <TableCell>
                    {station.latitude && station.longitude
                      ? `${station.latitude}, ${station.longitude}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>{station.phone || "N/A"}</TableCell>
                  <TableCell>{station.remainingFuel ?? "N/A"}</TableCell>
                  <TableCell>{station.isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <ManageFuelInventoryDialog station={station} />
                    <EditStationDialog station={station} onSuccess={fetchStations} />
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

function CreateStationDialog({ open, onOpenChange, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, onSuccess: () => void }) {
  const { accessToken } = useAuth();
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    try {
      setIsSubmitting(true);
      await createStation(accessToken, {
        name,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        phone,
      });
      onSuccess();
      onOpenChange(false);
      setName("");
      setLatitude("");
      setLongitude("");
      setPhone("");
    } catch (error) {
      console.error(error);
      alert("Failed to create station");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary-container text-on-primary-container hover:bg-surface-tint hover:text-white transition-all shadow-sm font-label-caps text-[10px] uppercase tracking-widest px-4 h-9 rounded-full">
          Add Station
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Station</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Station Name</Label>
            <Input id="name" required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input id="latitude" type="number" step="any" value={latitude} onChange={e => setLatitude(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input id="longitude" type="number" step="any" value={longitude} onChange={e => setLongitude(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditStationDialog({ station, onSuccess }: { station: Station, onSuccess: () => void }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(station.name);
  const [latitude, setLatitude] = useState(station.latitude?.toString() || "");
  const [longitude, setLongitude] = useState(station.longitude?.toString() || "");
  const [phone, setPhone] = useState(station.phone || "");
  const [remainingFuel, setRemainingFuel] = useState(station.remainingFuel?.toString() || "");
  const [isActive, setIsActive] = useState(station.isActive);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    try {
      setIsSubmitting(true);
      await updateStation(accessToken, station.id, {
        name,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        phone,
        remainingFuel: remainingFuel ? parseFloat(remainingFuel) : undefined,
        isActive,
      });
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update station");
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
        <DialogHeader>
          <DialogTitle>Edit Station</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Station Name</Label>
            <Input id="edit-name" required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-latitude">Latitude</Label>
              <Input id="edit-latitude" type="number" step="any" value={latitude} onChange={e => setLatitude(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-longitude">Longitude</Label>
              <Input id="edit-longitude" type="number" step="any" value={longitude} onChange={e => setLongitude(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input id="edit-phone" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-remainingFuel">Legacy total remaining fuel (Liters)</Label>
            <Input id="edit-remainingFuel" type="number" step="any" value={remainingFuel} onChange={e => setRemainingFuel(e.target.value)} />
            <p className="text-xs text-muted-foreground">
              Per-type inventory and audited adjustments are managed under <strong>Fuel inventory</strong> on the stations list.
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <input 
              type="checkbox" 
              id="edit-status" 
              checked={isActive} 
              onChange={e => setIsActive(e.target.checked)} 
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="edit-status">Active Status</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ManageFuelInventoryDialog({ station }: { station: Station }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [inventory, setInventory] = useState<StationFuelInventoryItem[]>([]);
  const [adjustments, setAdjustments] = useState<FuelInventoryAdjustmentEntry[]>(
    [],
  );
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fuelTypeId, setFuelTypeId] = useState("");
  const [remainingLiters, setRemainingLiters] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const loadAll = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const [invRes, adjRes, typesRes] = await Promise.all([
        getStationFuelInventory(accessToken, station.id),
        getFuelInventoryAdjustments(accessToken, {
          stationId: station.id,
          limit: 100,
          offset: 0,
        }),
        getFuelTypes(accessToken, { includeInactive: true }),
      ]);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !accessToken) return;
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload when dialog opens / station changes
  }, [open, accessToken, station.id]);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !fuelTypeId) return;
    const liters = parseFloat(remainingLiters);
    if (Number.isNaN(liters) || liters < 0) {
      alert("Enter a valid liters amount (≥ 0).");
      return;
    }
    setSubmitting(true);
    try {
      await adjustStationFuelInventory(accessToken, station.id, {
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

  const formatL = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Fuel inventory
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fuel inventory — {station.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-2">
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="overview">Inventory & adjust</TabsTrigger>
            <TabsTrigger value="history">Audit history</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
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
                          <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">
                            No inventory rows yet. Submit an adjustment below to create one.
                          </td>
                        </tr>
                      ) : (
                        inventory.map((row) => (
                          <tr key={row.fuelTypeId} className="border-b last:border-0">
                            <td className="px-3 py-2 font-medium">
                              {row.fuelTypeName}
                              {!row.fuelTypeIsActive ? (
                                <span className="ml-2 text-[10px] text-amber-700">Inactive</span>
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

                <form onSubmit={handleAdjust} className="space-y-3 rounded-lg border p-4 bg-muted/20">
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
            {loading ? (
              <p className="text-sm text-muted-foreground py-6">Loading…</p>
            ) : adjustments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6">
                No adjustments recorded for this station yet.
              </p>
            ) : (
              <div className="rounded-lg border max-h-[min(420px,50vh)] overflow-y-auto">
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
                        <td className="px-2 py-2 text-right tabular-nums">{formatL(a.previousLiters)}</td>
                        <td className="px-2 py-2 text-right tabular-nums font-medium">
                          {formatL(a.updatedLiters)}
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums">
                          {formatL(a.deltaLiters)}
                        </td>
                        <td className="px-2 py-2">
                          {a.changedByFirstName} {a.changedByLastName}
                          <div className="text-muted-foreground truncate max-w-[8rem]" title={a.changedByEmail}>
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
      </DialogContent>
    </Dialog>
  );
}
