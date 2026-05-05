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
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

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

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-outline/10 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className={cn(
              "material-symbols-outlined text-lg",
              queue?.isIntakePaused ? "text-red-600" : "text-green-600"
            )} style={{ fontVariationSettings: "'FILL' 1" }}>
              {queue?.isIntakePaused ? "pause_circle" : "check_circle"}
            </span>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40">Intake Status</h3>
          </div>
          <div className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ring-1 ring-inset",
            queue?.isIntakePaused 
              ? "bg-red-50 text-red-700 ring-red-700/10" 
              : "bg-green-50 text-green-700 ring-green-700/10"
          )}>
            {loading ? "Checking..." : queue?.isIntakePaused ? "Intake Paused" : "Active & Accepting"}
          </div>
        </div>
        
        <div className="rounded-2xl border border-outline/10 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sky-600 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>directions_car</span>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40">Queue Length</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-black leading-none">{queue?.queueLength ?? 0}</div>
            <span className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Vehicles</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-outline/10 overflow-hidden shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/50 hover:bg-neutral-50/50">
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-black/45 px-6">Identified Plate</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-black/45 px-6">Vehicle Category</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-black/45 px-6">Join Time</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-black/45 px-6">Current Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  <span className="material-symbols-outlined text-3xl text-black/5 animate-spin block mb-2">refresh</span>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-40">Loading queue data...</span>
                </TableCell>
              </TableRow>
            ) : !queue || !queue.items || queue.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  <span className="material-symbols-outlined text-3xl text-black/5 block mb-2">lane</span>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-40">The queue is currently empty.</span>
                </TableCell>
              </TableRow>
            ) : (
              queue.items.map((item) => (
                <TableRow key={item.id} className="group hover:bg-neutral-50/30 transition-colors">
                  <TableCell className="px-6 py-4">
                    <span className="font-black text-neutral-800 tracking-tight">{item.plateNumber}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-sky-700 ring-1 ring-inset ring-sky-700/10">
                      {item.vehicleCategory}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-neutral-600">
                        {new Date(item.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span className="text-[9px] font-black text-black/20 uppercase tracking-tighter">
                        {new Date(item.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold text-neutral-600 ring-1 ring-inset ring-neutral-200">
                      {item.status}
                    </span>
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
