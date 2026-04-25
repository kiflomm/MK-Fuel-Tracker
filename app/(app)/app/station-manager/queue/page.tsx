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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Queue</h1>
          <p className="text-muted-foreground">Monitor and manage your station's active vehicle queue.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchQueue} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button 
            variant={queue?.isIntakePaused ? "default" : "secondary"} 
            size="sm" 
            onClick={handleToggleIntake}
            disabled={updating || !queue}
          >
            {queue?.isIntakePaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
            {queue?.isIntakePaused ? "Resume Intake" : "Pause Intake"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Intake Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={queue?.isIntakePaused ? "destructive" : "default"}>
              {queue?.isIntakePaused ? "Paused" : "Active"}
            </Badge>
          </CardContent>
        </Card>
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Queue Length</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queue?.queueLength ?? 0}</div>
          </CardContent>
        </Card>
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
