"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLiveQueue, updateFuelStatus, FuelStatus, LiveQueue } from "@/lib/api/station-manager";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StationManagerPage() {
  const { user, accessToken } = useAuth();
  const [queue, setQueue] = useState<LiveQueue | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  const fetchData = async () => {
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

  const handleUpdateFuel = async (status: FuelStatus) => {
    if (!accessToken) return;
    setUpdating(true);
    try {
      await updateFuelStatus(accessToken, status);
      // In a real app we'd refresh the whole station object or let a parent handle it
      alert("Fuel status updated successfully");
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Failed to update fuel status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Station Overview</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.firstName}. Managing station ID: {user?.stationId ?? "Unknown"}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchData()}>Refresh</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : `${queue?.queueLength ?? 0} Vehicles`}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {queue?.isIntakePaused ? "Intake is currently paused." : "Accepting new vehicles."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Fuel Control</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                disabled={updating}
                onClick={() => handleUpdateFuel('AVAILABLE')}
              >
                Available
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
                disabled={updating}
                onClick={() => handleUpdateFuel('UNAVAILABLE')}
              >
                Unavailable
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                disabled={updating}
                onClick={() => handleUpdateFuel('DEPLETED')}
              >
                Depleted
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button variant="secondary" size="sm" asChild>
                <a href="/app/station-manager/workers">Manage Workers</a>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <a href="/app/station-manager/queue">View Full Queue</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
