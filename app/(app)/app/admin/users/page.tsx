"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import {
  createStationManager,
  createVehicleOwner,
  getStations,
  getUsers,
  getVehicleCategories,
  Station,
  User,
  VehicleCategory,
  updateUserStatus,
} from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { cn, formatStationWithId } from "@/lib/utils";

type VehiclePayload = {
  plateNumber: string;
  categoryId: number;
};

export default function UsersPage() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    void fetchUsers();
    void fetchCategories();
  }, [accessToken]);

  const fetchUsers = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await getUsers(accessToken);
      setUsers(res.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (!accessToken) return;
    const res = await getVehicleCategories(accessToken);
    setCategories(res.data ?? []);
  };

  const handleStatusChange = async (userId: number, currentStatus: boolean) => {
    if (!accessToken) return;
    await updateUserStatus(accessToken, userId, !currentStatus);
    await fetchUsers();
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-950 to-neutral-900 px-6 py-7 shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-indigo-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>manage_accounts</span>
              <span className="text-[10px] font-black tracking-[0.25em] text-indigo-400 uppercase">Access & Identity</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Users</h1>
            <p className="text-sm text-neutral-400 font-medium">Manage platform access, roles, and vehicle ownership identities.</p>
          </div>
          <div className="flex items-center gap-3">
            <CreateManagerDialog onSuccess={fetchUsers} />
            <CreateOwnerDialog onSuccess={fetchUsers} categories={categories} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-outline/10 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Station</TableHead>
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
            ) :
              users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">#{user.id}</TableCell>
                <TableCell className="font-bold text-neutral-800">{user.firstName} {user.lastName}</TableCell>
                <TableCell className="text-neutral-600 font-medium">{user.email}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                    {user.role.replace(/_/g, " ")}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-neutral-700">
                  {user.stationId != null
                    ? formatStationWithId(user.stationId, user.stationName ?? null)
                    : "—"}
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset",
                    user.isActive 
                      ? "bg-green-50 text-green-700 ring-green-600/20" 
                      : "bg-red-50 text-red-700 ring-red-600/20"
                  )}>
                    {user.isActive ? "Active" : "Suspended"}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {user.role === "VEHICLE_OWNER" ? (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/app/admin/users/${user.id}/vehicles`}>Vehicles</Link>
                    </Button>
                  ) : null}
                  <Button size="sm" variant="outline" onClick={() => void handleStatusChange(user.id, user.isActive)}>
                    {user.isActive ? "Suspend" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function CreateManagerDialog({ onSuccess }: { onSuccess: () => Promise<void> | void }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", stationId: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !accessToken) return;
    setError(null);
    setFormData({ firstName: "", lastName: "", email: "", password: "", stationId: "" });
    void getStations(accessToken).then((res) => setStations(res.data ?? []));
  }, [open, accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    if (!formData.stationId) {
      setError("Please select a station.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await createStationManager(accessToken, {
        ...formData,
        stationId: Number(formData.stationId),
      });
      await onSuccess();
      setOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create station manager.";
      setError(msg);
    } finally {
      setSubmitting(false);
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
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <Input placeholder="First name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
          <Input placeholder="Last name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
          <Input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <InputGroup>
            <InputGroupInput 
              type={showPassword ? "text" : "password"} 
              placeholder="Password (min 6 characters)"
              required
              minLength={6}
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton 
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground"
              >
                <span className="material-symbols-outlined text-sm">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <Select value={formData.stationId} onValueChange={(v) => setFormData({ ...formData, stationId: v })}>
            <SelectTrigger><SelectValue placeholder="Select station" /></SelectTrigger>
            <SelectContent>
              {stations.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name} (ID {s.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter><Button type="submit" disabled={submitting}>{submitting ? "Creating…" : "Create"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CreateOwnerDialog({ onSuccess, categories }: { onSuccess: () => Promise<void> | void; categories: VehicleCategory[] }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [owner, setOwner] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [vehicles, setVehicles] = useState<VehiclePayload[]>([]);
  const [draft, setDraft] = useState<{ plateNumber: string; categoryId: string }>({
    plateNumber: "",
    categoryId: "",
  });

  const addVehicle = () => {
    if (!draft.plateNumber.trim() || !draft.categoryId) return;
    setVehicles((prev) => [...prev, {
      plateNumber: draft.plateNumber.trim(),
      categoryId: Number(draft.categoryId),
    }]);
    setDraft({ ...draft, plateNumber: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    await createVehicleOwner(accessToken, { ...owner, vehicles: vehicles.length ? vehicles : undefined });
    await onSuccess();
    setOpen(false);
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
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="First name" value={owner.firstName} onChange={(e) => setOwner({ ...owner, firstName: e.target.value })} required />
          <Input placeholder="Last name" value={owner.lastName} onChange={(e) => setOwner({ ...owner, lastName: e.target.value })} required />
          <Input type="email" placeholder="Email" value={owner.email} onChange={(e) => setOwner({ ...owner, email: e.target.value })} required />
          <InputGroup>
            <InputGroupInput 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={owner.password} 
              onChange={(e) => setOwner({ ...owner, password: e.target.value })} 
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton 
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground"
              >
                <span className="material-symbols-outlined text-sm">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <div className="rounded border p-3 space-y-2">
            <Label>Add vehicle with quota</Label>
            <Input placeholder="Plate number" value={draft.plateNumber} onChange={(e) => setDraft({ ...draft, plateNumber: e.target.value })} />
            <Select value={draft.categoryId} onValueChange={(v) => setDraft({ ...draft, categoryId: v })}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name} ({c.code})</SelectItem>)}</SelectContent>
            </Select>
            <Button type="button" variant="outline" onClick={addVehicle}>Add Vehicle</Button>
            {vehicles.map((v, idx) => <div key={`${v.plateNumber}-${idx}`} className="text-sm">{v.plateNumber}</div>)}
          </div>
          <DialogFooter><Button type="submit">Create</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
