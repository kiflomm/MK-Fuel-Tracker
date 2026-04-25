"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { getStations, createStation, updateStation, Station } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stations</h1>
          <p className="text-muted-foreground">Manage fuel stations across the region.</p>
        </div>
        <CreateStationDialog 
          open={isCreateOpen} 
          onOpenChange={setIsCreateOpen} 
          onSuccess={fetchStations} 
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Fuel Status</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  Loading stations...
                </TableCell>
              </TableRow>
            ) : stations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No stations found.
                </TableCell>
              </TableRow>
            ) : (
              stations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell>{station.id}</TableCell>
                  <TableCell className="font-medium">{station.name}</TableCell>
                  <TableCell>{station.address || "N/A"}</TableCell>
                  <TableCell>{station.city || "N/A"}</TableCell>
                  <TableCell>{station.phone || "N/A"}</TableCell>
                  <TableCell>{station.fuelStatus || "AVAILABLE"}</TableCell>
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
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [fuelStatus, setFuelStatus] = useState("AVAILABLE");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    try {
      setIsSubmitting(true);
      await createStation(accessToken, { name, address, city, phone, fuelStatus });
      onSuccess();
      onOpenChange(false);
      setName("");
      setAddress("");
      setCity("");
      setPhone("");
      setFuelStatus("AVAILABLE");
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
        <Button>Add Station</Button>
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
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" required value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" required value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" required value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fuelStatus">Fuel Status</Label>
            <select id="fuelStatus" required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={fuelStatus} onChange={e => setFuelStatus(e.target.value)}>
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Unavailable</option>
              <option value="DEPLETED">Depleted</option>
            </select>
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
  const [address, setAddress] = useState(station.address || "");
  const [city, setCity] = useState(station.city || "");
  const [phone, setPhone] = useState(station.phone || "");
  const [fuelStatus, setFuelStatus] = useState(station.fuelStatus || "AVAILABLE");
  const [isActive, setIsActive] = useState(station.isActive);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    try {
      setIsSubmitting(true);
      await updateStation(accessToken, station.id, { name, address, city, phone, fuelStatus, isActive });
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
          <div className="space-y-2">
            <Label htmlFor="edit-address">Address</Label>
            <Input id="edit-address" required value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-city">City</Label>
            <Input id="edit-city" required value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input id="edit-phone" required value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-fuelStatus">Fuel Status</Label>
            <select id="edit-fuelStatus" required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={fuelStatus} onChange={e => setFuelStatus(e.target.value)}>
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Unavailable</option>
              <option value="DEPLETED">Depleted</option>
            </select>
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
