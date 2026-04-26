"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { getQuotaRules, createQuotaRule, updateQuotaRule, deleteQuotaRule, QuotaRule } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function QuotaRulesPage() {
  const { accessToken } = useAuth();
  const [rules, setRules] = useState<QuotaRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken) fetchRules();
  }, [accessToken]);

  const fetchRules = async () => {
    setLoading(true);
    try {
      if (!accessToken) return;
      const res = await getQuotaRules(accessToken);
      if (res.data) setRules(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    if (!confirm("Are you sure you want to delete this quota rule?")) return;
    try {
      await deleteQuotaRule(accessToken, id);
      fetchRules();
    } catch (error) {
      console.error(error);
      alert("Failed to delete quota rule");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quota Rules</h1>
          <p className="text-muted-foreground">Manage maximum fuel quotas per vehicle category.</p>
        </div>
        <CreateRuleDialog onSuccess={fetchRules} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
               <TableHead>Category</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Liters Limit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Loading quota rules...
                </TableCell>
              </TableRow>
            ) : rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No quota rules found.
                </TableCell>
              </TableRow>
            ) : (
              rules.map((rule) => (
                <TableRow key={rule.id}>
                   <TableCell className="font-medium">{rule.vehicleCategory}</TableCell>
                  <TableCell>{rule.period}</TableCell>
                  <TableCell>{rule.litersLimit}</TableCell>
                  <TableCell>{rule.isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <EditRuleDialog rule={rule} onSuccess={fetchRules} />
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(rule.id)}>Delete</Button>
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

function CreateRuleDialog({ onSuccess }: { onSuccess: () => void }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ vehicleCategory: "PRIVATE_CAR", period: "DAILY", litersLimit: "", isActive: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    try {
      setIsSubmitting(true);
      await createQuotaRule(accessToken, {
        vehicleCategory: formData.vehicleCategory,
        period: formData.period as any,
        litersLimit: parseFloat(formData.litersLimit),
        isActive: formData.isActive
      });
      onSuccess();
      setOpen(false);
      setFormData({ vehicleCategory: "PRIVATE_CAR", period: "DAILY", litersLimit: "", isActive: true });
    } catch (error) {
      console.error(error);
      alert("Failed to create quota rule");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-container text-on-primary-container hover:bg-surface-tint hover:text-white transition-all shadow-sm font-label-caps text-[10px] uppercase tracking-widest px-4 h-9 rounded-full">
          Add Rule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Quota Rule</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Vehicle Category</Label>
            <Select value={formData.vehicleCategory} onValueChange={val => setFormData({...formData, vehicleCategory: val})}>
              <SelectTrigger className="w-full bg-transparent">
                <SelectValue placeholder="Category" />
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
          <div className="space-y-2">
            <Label>Period</Label>
            <Select value={formData.period} onValueChange={val => setFormData({...formData, period: val})}>
              <SelectTrigger className="w-full bg-transparent">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Liters Limit</Label>
            <Input type="number" step="0.1" required value={formData.litersLimit} onChange={e => setFormData({...formData, litersLimit: e.target.value})} />
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

function EditRuleDialog({ rule, onSuccess }: { rule: QuotaRule, onSuccess: () => void }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    litersLimit: rule.litersLimit.toString(), 
    isActive: rule.isActive
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    try {
      setIsSubmitting(true);
       await updateQuotaRule(accessToken, rule.id, {
        litersLimit: parseFloat(formData.litersLimit),
        isActive: formData.isActive
      });
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update quota rule");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline" size="sm">Edit</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Quota Rule</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs uppercase">Vehicle Category & Period</Label>
            <div className="text-sm font-medium">{rule.vehicleCategory} ({rule.period})</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`edit-liters-${rule.id}`}>Liters Limit</Label>
            <Input id={`edit-liters-${rule.id}`} type="number" step="0.1" required value={formData.litersLimit} onChange={e => setFormData({...formData, litersLimit: e.target.value})} />
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <input type="checkbox" id={`active-${rule.id}`} checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="h-4 w-4 rounded border-gray-300" />
            <Label htmlFor={`active-${rule.id}`}>Active Status</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
