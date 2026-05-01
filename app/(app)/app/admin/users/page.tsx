"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import {
  addVehiclesToOwner,
  createStationManager,
  createVehicleOwner,
  getVehicleQuotaRules,
  getStations,
  getUserById,
  getUsers,
  getVehicleCategories,
  OwnerVehicle,
  Station,
  User,
  VehicleCategory,
  updateVehicleQuotaRules,
  updateUserStatus,
} from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex gap-2">
          <CreateManagerDialog onSuccess={fetchUsers} />
          <CreateOwnerDialog onSuccess={fetchUsers} categories={categories} />
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
            ) : users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.isActive ? "Active" : "Suspended"}</TableCell>
                <TableCell className="text-right space-x-2">
                  {user.role === "VEHICLE_OWNER" ? (
                    <ManageVehiclesDialog ownerUserId={user.id} categories={categories} />
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
  const [stations, setStations] = useState<Station[]>([]);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", stationId: "" });

  useEffect(() => {
    if (!open || !accessToken) return;
    void getStations(accessToken).then((res) => setStations(res.data ?? []));
  }, [open, accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    await createStationManager(accessToken, {
      ...formData,
      stationId: Number(formData.stationId),
    });
    await onSuccess();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button>Add Station Manager</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Station Manager</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="First name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
          <Input placeholder="Last name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
          <Input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <Input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <Select value={formData.stationId} onValueChange={(v) => setFormData({ ...formData, stationId: v })}>
            <SelectTrigger><SelectValue placeholder="Select station" /></SelectTrigger>
            <SelectContent>{stations.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
          </Select>
          <DialogFooter><Button type="submit">Create</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CreateOwnerDialog({ onSuccess, categories }: { onSuccess: () => Promise<void> | void; categories: VehicleCategory[] }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
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
      <DialogTrigger asChild><Button>Add Vehicle Owner</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Vehicle Owner</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="First name" value={owner.firstName} onChange={(e) => setOwner({ ...owner, firstName: e.target.value })} required />
          <Input placeholder="Last name" value={owner.lastName} onChange={(e) => setOwner({ ...owner, lastName: e.target.value })} required />
          <Input type="email" placeholder="Email" value={owner.email} onChange={(e) => setOwner({ ...owner, email: e.target.value })} required />
          <Input type="password" placeholder="Password" value={owner.password} onChange={(e) => setOwner({ ...owner, password: e.target.value })} />
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

function ManageVehiclesDialog({ ownerUserId, categories }: { ownerUserId: number; categories: VehicleCategory[] }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [vehicles, setVehicles] = useState<OwnerVehicle[]>([]);
  const [draft, setDraft] = useState<{ plateNumber: string; categoryId: string }>({
    plateNumber: "",
    categoryId: "",
  });
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [quotaDraft, setQuotaDraft] = useState<{ DAILY: string; WEEKLY: string; MONTHLY: string }>({
    DAILY: "",
    WEEKLY: "",
    MONTHLY: "",
  });

  useEffect(() => {
    if (!open || !accessToken) return;
    void getUserById(accessToken, ownerUserId).then((res) => setVehicles(res.data?.vehicles ?? []));
  }, [open, accessToken, ownerUserId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    if (!draft.plateNumber.trim() || !draft.categoryId) return;
    const res = await addVehiclesToOwner(accessToken, ownerUserId, [{
      plateNumber: draft.plateNumber.trim(),
      categoryId: Number(draft.categoryId),
    }]);
    setVehicles(res.data ?? []);
    setDraft({ ...draft, plateNumber: "" });
  };

  const selectVehicleForQuota = async (vehicleId: number) => {
    if (!accessToken) return;
    setSelectedVehicleId(vehicleId);
    const res = await getVehicleQuotaRules(accessToken, vehicleId);
    const next = { DAILY: "", WEEKLY: "", MONTHLY: "" };
    for (const rule of res.data ?? []) {
      next[rule.period] = String(rule.litersLimit);
    }
    setQuotaDraft(next);
  };

  const saveVehicleQuota = async () => {
    if (!accessToken || !selectedVehicleId) return;
    const quotaRules: Array<{ period: "DAILY" | "WEEKLY" | "MONTHLY"; litersLimit: number }> = [];
    (["DAILY", "WEEKLY", "MONTHLY"] as const).forEach((period) => {
      const litersLimit = Number(quotaDraft[period]);
      if (Number.isFinite(litersLimit) && litersLimit > 0) {
        quotaRules.push({ period, litersLimit });
      }
    });
    if (quotaRules.length === 0) return;
    await updateVehicleQuotaRules(accessToken, selectedVehicleId, quotaRules);
    const userRes = await getUserById(accessToken, ownerUserId);
    setVehicles(userRes.data?.vehicles ?? []);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="outline">Vehicles</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Manage Vehicles</DialogTitle></DialogHeader>
        <div className="space-y-2">
          {vehicles.map((v) => (
            <div key={v.id} className="flex items-center justify-between text-sm">
              <span>{v.plateNumber} - {v.categoryName ?? v.categoryCode ?? v.categoryId}</span>
              <Button type="button" size="sm" variant="outline" onClick={() => void selectVehicleForQuota(v.id)}>
                Edit Quota
              </Button>
            </div>
          ))}
        </div>
        <form onSubmit={handleAdd} className="space-y-2">
          <Input placeholder="Plate number" value={draft.plateNumber} onChange={(e) => setDraft({ ...draft, plateNumber: e.target.value })} required />
          <Select value={draft.categoryId} onValueChange={(v) => setDraft({ ...draft, categoryId: v })}>
            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name} ({c.code})</SelectItem>)}</SelectContent>
          </Select>
          <DialogFooter><Button type="submit">Add vehicle</Button></DialogFooter>
        </form>
        {selectedVehicleId ? (
          <div className="rounded border p-3 space-y-2">
            <div className="font-medium">Manual quota for vehicle #{selectedVehicleId}</div>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                placeholder="Daily liters"
                value={quotaDraft.DAILY}
                onChange={(e) => setQuotaDraft({ ...quotaDraft, DAILY: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Weekly liters"
                value={quotaDraft.WEEKLY}
                onChange={(e) => setQuotaDraft({ ...quotaDraft, WEEKLY: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Monthly liters"
                value={quotaDraft.MONTHLY}
                onChange={(e) => setQuotaDraft({ ...quotaDraft, MONTHLY: e.target.value })}
              />
            </div>
            <Button type="button" onClick={() => void saveVehicleQuota()}>
              Save Vehicle Quota
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
