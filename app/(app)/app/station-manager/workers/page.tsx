"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { 
  getStationWorkers, 
  createStationWorker, 
  updateStationWorker, 
  updateStationWorkerStatus,
  StationWorker 
} from "@/lib/api/station-manager";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function WorkersPage() {
  const { accessToken } = useAuth();
  const [workers, setWorkers] = useState<StationWorker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      fetchWorkers();
    }
  }, [accessToken]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      if (!accessToken) return;
      const res = await getStationWorkers(accessToken);
      if (res.data) setWorkers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-950 to-neutral-900 px-6 py-7 shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-emerald-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
              <span className="text-[10px] font-black tracking-[0.25em] text-emerald-400 uppercase">Personnel Management</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Station Workers</h1>
            <p className="text-sm text-neutral-400 font-medium">Manage the workers assigned to your station.</p>
          </div>
          <CreateWorkerDialog onSuccess={fetchWorkers} />
        </div>
      </div>

      <div className="rounded-xl border border-outline/10 overflow-hidden shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/50 hover:bg-neutral-50/50 h-11">
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4">Worker Name</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4">Email Address</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-black/60 px-4">Account Status</TableHead>
              <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-black/60 px-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  <span className="material-symbols-outlined text-3xl text-black/5 animate-spin block mb-2">refresh</span>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-40">Loading workers...</span>
                </TableCell>
              </TableRow>
            ) : workers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  <span className="material-symbols-outlined text-3xl text-black/5 block mb-2">group_off</span>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-40">No workers assigned to this station.</span>
                </TableCell>
              </TableRow>
            ) : (
              workers.map((worker) => (
                <TableRow key={worker.id} className="group hover:bg-neutral-50/50 transition-colors border-b border-outline/5 last:border-0">
                  <TableCell className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-neutral-800">{worker.firstName} {worker.lastName}</span>
                      <span className="font-mono text-[10px] font-bold text-black/30 tracking-tight">ID: #{worker.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <span className="text-[13px] font-medium text-neutral-600">{worker.email}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <span className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset uppercase tracking-wider",
                      worker.isActive 
                        ? "bg-green-50 text-green-700 ring-green-600/20" 
                        : "bg-red-50 text-red-700 ring-red-600/20"
                    )}>
                      {worker.isActive ? "Active" : "Suspended"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right px-4 py-3.5 space-x-2">
                    <EditWorkerDialog worker={worker} onSuccess={fetchWorkers} />
                    <Button 
                      variant="outline"
                      size="sm"
                      className={cn(
                        "font-bold text-[10px] uppercase tracking-widest h-8 rounded-lg transition-all",
                        worker.isActive 
                          ? "text-red-600 hover:bg-red-50 border-red-100" 
                          : "text-green-600 hover:bg-green-50 border-green-100"
                      )}
                      onClick={async () => {
                        if (!accessToken) return;
                        try {
                          await updateStationWorkerStatus(accessToken, worker.id, !worker.isActive);
                          fetchWorkers();
                        } catch (error) {
                          alert("Failed to update status");
                        }
                      }}
                    >
                      {worker.isActive ? "Suspend" : "Activate"}
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

function CreateWorkerDialog({ onSuccess }: { onSuccess: () => void }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    try {
      setIsSubmitting(true);
      await createStationWorker(accessToken, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      onSuccess();
      setOpen(false);
      setFormData({ firstName: "", lastName: "", email: "", password: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to create worker");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-400 text-black hover:bg-yellow-500 transition-all shadow-sm font-label-caps text-[10px] uppercase tracking-widest px-4 h-9 rounded-full">
          <Plus className="mr-2 h-3.5 w-3.5" /> Add Worker
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Station Worker</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="First name" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <Input placeholder="Last name" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
          <Input type="email" placeholder="Email address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
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
                className="text-muted-foreground mr-1"
              >
                <span className="material-symbols-outlined text-sm">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          <DialogFooter className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating..." : "Create Worker"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditWorkerDialog({ worker, onSuccess }: { worker: StationWorker, onSuccess: () => void }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: worker.firstName, 
    lastName: worker.lastName, 
    email: worker.email,
    password: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    try {
      setIsSubmitting(true);
      const data: any = { ...formData };
      if (!data.password) delete data.password;
      await updateStationWorker(accessToken, worker.id, data);
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update worker");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="font-bold text-[10px] uppercase tracking-widest h-8 rounded-lg">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Station Worker</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="First name" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <Input placeholder="Last name" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
          <Input type="email" placeholder="Email address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <InputGroup>
            <InputGroupInput 
              type={showPassword ? "text" : "password"} 
              placeholder="Reset Password (leave empty to keep current)"
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton 
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground mr-1"
              >
                <span className="material-symbols-outlined text-sm">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          <DialogFooter className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
