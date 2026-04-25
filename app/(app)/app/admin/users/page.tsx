"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { getUsers, createStationManager, createVehicleOwner, updateUserStatus, User, getStations, Station } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage managers and vehicle owners.</p>
        </div>
        <div className="flex gap-2">
          <CreateManagerDialog onSuccess={fetchUsers} />
          <CreateOwnerDialog onSuccess={fetchUsers} />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
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
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.stationId || "-"}</TableCell>
                  <TableCell>{user.isActive ? "Active" : "Suspended"}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(user.id, user.isActive)}
                    >
                      {user.isActive ? "Suspend" : "Activate"}
                    </Button>
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
      <DialogTrigger asChild><Button variant="outline">Add Manager</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Station Manager</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>First Name</Label><Input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} /></div>
            <div className="space-y-2"><Label>Last Name</Label><Input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} /></div>
          </div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
          <div className="space-y-2"><Label>Password (optional)</Label><Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
          <div className="space-y-2">
            <Label>Station</Label>
            <select required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={formData.stationId} onChange={e => setFormData({...formData, stationId: e.target.value})}>
              <option value="" disabled>Select a station</option>
              {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
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
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", plateNumber: "", category: "PRIVATE_CAR" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    try {
      setIsSubmitting(true);
      await createVehicleOwner(accessToken, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        vehicles: [{ plateNumber: formData.plateNumber, category: formData.category }]
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
      <DialogTrigger asChild><Button>Add Owner</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Vehicle Owner</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>First Name</Label><Input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} /></div>
            <div className="space-y-2"><Label>Last Name</Label><Input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} /></div>
          </div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
          <div className="space-y-2"><Label>Password (optional)</Label><Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
          <div className="pt-4 pb-2 border-b"><h3 className="font-medium text-sm">Initial Vehicle</h3></div>
          <div className="space-y-2"><Label>Plate Number</Label><Input required value={formData.plateNumber} onChange={e => setFormData({...formData, plateNumber: e.target.value})} /></div>
          <div className="space-y-2">
            <Label>Category</Label>
            <select required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="PRIVATE_CAR">Private Car</option>
              <option value="TAXI">Taxi</option>
              <option value="BUS">Bus</option>
              <option value="TRUCK">Truck</option>
              <option value="MOTORCYCLE">Motorcycle</option>
              <option value="OTHER">Other</option>
            </select>
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
