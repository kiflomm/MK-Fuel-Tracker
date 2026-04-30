"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { addVehiclesToOwner, getUserById, getUsers, createStationManager, createVehicleOwner, updateUserStatus, User, getStations, Station, OwnerVehicle } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UsersPage() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken) fetchUsers();
  }, [accessToken]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (!accessToken) return;
      const res = await getUsers(accessToken);
      if (res.data) setUsers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: number, currentStatus: boolean) => {
    if (!accessToken) return;
    try {
      await updateUserStatus(accessToken, userId, !currentStatus);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-950 to-neutral-900 px-6 py-7 shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-indigo-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>manage_accounts</span>
              <span className="text-[10px] font-black tracking-[0.25em] text-indigo-400 uppercase">User Management</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Users</h1>
            <p className="text-sm text-neutral-400 font-medium">Manage station managers and vehicle owners.</p>
          </div>
          <div className="flex gap-2">
            <CreateManagerDialog onSuccess={fetchUsers} />
            <CreateOwnerDialog onSuccess={fetchUsers} />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Station ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.stationId || "-"}</TableCell>
                  <TableCell>{user.isActive ? "Active" : "Suspended"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.role === "VEHICLE_OWNER" ? (
                        <ManageVehiclesDialog ownerUserId={user.id} />
                      ) : null}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(user.id, user.isActive)}
                      >
                        {user.isActive ? "Suspend" : "Activate"}
                      </Button>
                    </div>
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

function ManageVehiclesDialog({ ownerUserId }: { ownerUserId: number }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState<OwnerVehicle[]>([]);
  const [draft, setDraft] = useState<{ plateNumber: string; category: string }>({
    plateNumber: "",
    category: "PRIVATE_CAR",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      const res = await getUserById(accessToken, ownerUserId);
      setVehicles(res.data?.vehicles ?? []);
    } catch (e) {
      console.error(e);
      alert("Failed to load owner vehicles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    const plate = draft.plateNumber.trim();
    if (!plate) return;

    try {
      setIsSubmitting(true);
      const res = await addVehiclesToOwner(accessToken, ownerUserId, [
        { plateNumber: plate, category: draft.category },
      ]);
      setVehicles(res.data ?? []);
      setDraft({ plateNumber: "", category: draft.category });
    } catch (err) {
      console.error(err);
      alert("Failed to add vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Vehicles</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Vehicles</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading vehicles...</div>
          ) : vehicles.length ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Plate</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell>{v.id}</TableCell>
                      <TableCell className="font-medium">{v.plateNumber}</TableCell>
                      <TableCell>{v.category}</TableCell>
                      <TableCell>{v.isActive ? "Active" : "Inactive"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No vehicles registered yet.</div>
          )}

          <div className="pt-2 border-t">
            <div className="font-medium text-sm mb-2">Add vehicle</div>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2 col-span-2">
                  <Label>Plate Number</Label>
                  <Input
                    required
                    value={draft.plateNumber}
                    onChange={(e) => setDraft({ ...draft, plateNumber: e.target.value })}
                    placeholder="3-12345-AA"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={draft.category}
                    onValueChange={(val) => setDraft({ ...draft, category: val })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-full bg-transparent">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="PRIVATE_CAR">Private Car</SelectItem>
                      <SelectItem value="TAXI">Taxi</SelectItem>
                      <SelectItem value="BUS">Bus</SelectItem>
                      <SelectItem value="TRUCK">Truck</SelectItem>
                      <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add vehicle"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreateManagerDialog({ onSuccess }: { onSuccess: () => void }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", stationId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    if (open && accessToken) {
      getStations(accessToken).then(res => res.data && setStations(res.data));
    }
  }, [open, accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    try {
      setIsSubmitting(true);
      await createStationManager(accessToken, {
        ...formData,
        stationId: parseInt(formData.stationId, 10),
      });
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create manager");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-container text-on-primary-container hover:bg-surface-tint hover:text-white transition-all shadow-sm font-label-caps text-[10px] uppercase tracking-widest px-4 h-9 rounded-full">
          Add Station Manager
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Station Manager</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>First Name</Label><Input required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} /></div>
            <div className="space-y-2"><Label>Last Name</Label><Input required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
          <div className="space-y-2"><Label>Password (optional)</Label><Input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} /></div>
          <div className="space-y-2">
            <Label>Station</Label>
            <Select value={formData.stationId} onValueChange={val => setFormData({ ...formData, stationId: val })}>
              <SelectTrigger className="w-full bg-transparent">
                <SelectValue placeholder="Select a station" />
              </SelectTrigger>
              <SelectContent position="popper">
                {stations.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CreateOwnerDialog({ onSuccess }: { onSuccess: () => void }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [includeVehicles, setIncludeVehicles] = useState(false);
  const [vehicles, setVehicles] = useState<Array<{ plateNumber: string; category: string }>>([]);
  const [vehicleDraft, setVehicleDraft] = useState<{ plateNumber: string; category: string }>({
    plateNumber: "",
    category: "PRIVATE_CAR",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    try {
      setIsSubmitting(true);
      const payloadVehicles = includeVehicles ? vehicles : [];
      await createVehicleOwner(accessToken, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        vehicles: payloadVehicles.length ? payloadVehicles : undefined,
      });
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create owner");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-container text-on-primary-container hover:bg-surface-tint hover:text-white transition-all shadow-sm font-label-caps text-[10px] uppercase tracking-widest px-4 h-9 rounded-full">
          Add Vehicle Owner
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Vehicle Owner</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>First Name</Label><Input required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} /></div>
            <div className="space-y-2"><Label>Last Name</Label><Input required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
          <div className="space-y-2"><Label>Password (optional)</Label><Input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} /></div>
          <div className="pt-4 pb-2 border-b">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium text-sm">Vehicles (optional)</h3>
              <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                <input
                  type="checkbox"
                  checked={includeVehicles}
                  onChange={(e) => setIncludeVehicles(e.target.checked)}
                />
                Add vehicles now
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              You can create the owner without vehicles and register vehicles later.
            </p>
          </div>

          {includeVehicles ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2 col-span-2">
                  <Label>Plate Number</Label>
                  <Input
                    value={vehicleDraft.plateNumber}
                    onChange={(e) => setVehicleDraft({ ...vehicleDraft, plateNumber: e.target.value })}
                    placeholder="3-12345-AA"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={vehicleDraft.category} onValueChange={(val) => setVehicleDraft({ ...vehicleDraft, category: val })}>
                    <SelectTrigger className="w-full bg-transparent">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="PRIVATE_CAR">Private Car</SelectItem>
                      <SelectItem value="TAXI">Taxi</SelectItem>
                      <SelectItem value="BUS">Bus</SelectItem>
                      <SelectItem value="TRUCK">Truck</SelectItem>
                      <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const plate = vehicleDraft.plateNumber.trim();
                    if (!plate) return;
                    setVehicles((prev) => [...prev, { plateNumber: plate, category: vehicleDraft.category }]);
                    setVehicleDraft({ plateNumber: "", category: vehicleDraft.category });
                  }}
                >
                  Add vehicle
                </Button>
              </div>

              {vehicles.length ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plate</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vehicles.map((v, idx) => (
                        <TableRow key={`${v.plateNumber}-${idx}`}>
                          <TableCell className="font-medium">{v.plateNumber}</TableCell>
                          <TableCell>{v.category}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setVehicles((prev) => prev.filter((_, i) => i !== idx))}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No vehicles added yet.</p>
              )}
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
