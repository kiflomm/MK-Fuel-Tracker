"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { 
  getLiveQueue, 
  pauseQueueIntake, 
  resumeQueueIntake, 
  LiveQueue 
} from "@/lib/api/station-manager";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RefreshCw } from "lucide-react";

export default function QueuePage() {
  const { accessToken } = useAuth();
  const [queue, setQueue] = useState<LiveQueue | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (accessToken) {
      fetchQueue();
    }
  }, [accessToken]);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      if (!accessToken) return;
      const res = await getLiveQueue(accessToken);
      if (res.data) setQueue(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleIntake = async () => {
    if (!accessToken || !queue) return;
    setUpdating(true);
    try {
      if (queue.isIntakePaused) {
        await resumeQueueIntake(accessToken);
      } else {
        await pauseQueueIntake(accessToken);
      }
      fetchQueue();
    } catch (error) {
      console.error(error);
      alert("Failed to update intake status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-sky-950 to-neutral-900 px-6 py-7 shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-sky-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>format_list_numbered</span>
              <span className="text-[10px] font-black tracking-[0.25em] text-sky-400 uppercase">Live Queue Monitoring</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Live Queue</h1>
            <p className="text-sm text-neutral-400 font-medium">Monitor and manage your station's active vehicle queue.</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white/10 hover:bg-white/20 text-white border-0 transition-all shadow-sm font-label-caps text-[10px] uppercase tracking-widest px-4 h-9 rounded-full" onClick={fetchQueue} disabled={loading}>
              <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button 
              className={`${queue?.isIntakePaused ? "bg-white text-black hover:bg-neutral-200" : "bg-red-500 hover:bg-red-600 text-white"} transition-all shadow-sm font-label-caps text-[10px] uppercase tracking-widest px-4 h-9 rounded-full`}
              onClick={handleToggleIntake}
              disabled={updating || !queue}
            >
              {queue?.isIntakePaused ? <Play className="mr-2 h-3.5 w-3.5" /> : <Pause className="mr-2 h-3.5 w-3.5" />}
              {queue?.isIntakePaused ? "Resume Intake" : "Pause Intake"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-1 rounded-2xl border border-outline/10 bg-neutral-50 p-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-3">Intake Status</h3>
          <Badge variant={queue?.isIntakePaused ? "destructive" : "default"}>
            {queue?.isIntakePaused ? "Paused" : "Active"}
          </Badge>
        </div>
        <div className="md:col-span-1 rounded-2xl border border-outline/10 bg-neutral-50 p-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2">Queue Length</h3>
          <div className="text-3xl font-black text-black leading-none">{queue?.queueLength ?? 0}</div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plate Number</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Joined At</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  Loading queue data...
                </TableCell>
              </TableRow>
            ) : !queue || !queue.items || queue.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  The queue is currently empty.
                </TableCell>
              </TableRow>
            ) : (
              queue.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.plateNumber}</TableCell>
                  <TableCell>{item.vehicleCategory}</TableCell>
                  <TableCell>{new Date(item.joinedAt).toLocaleTimeString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
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
