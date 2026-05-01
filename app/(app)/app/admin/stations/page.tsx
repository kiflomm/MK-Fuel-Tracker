"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { getStations, createStation, updateStation, Station } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
              <TableHead>Remaining Fuel (L)</TableHead>
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
                  <TableCell className="text-right">
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
            <Label htmlFor="edit-remainingFuel">Remaining Fuel (Liters)</Label>
            <Input id="edit-remainingFuel" type="number" step="any" value={remainingFuel} onChange={e => setRemainingFuel(e.target.value)} />
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
