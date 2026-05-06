"use client";

import { useAuth } from "@/lib/auth/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatStationWithId } from "@/lib/utils";

export function RoleDashboard() {
  const { user } = useAuth();

  return (
    <div className="w-full space-y-8">
      <div className="relative">
        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary-container"></div>
        <h1 className="font-display-lg text-4xl text-on-surface tracking-tight">
          Welcome, <span className="text-primary">{user?.firstName ?? "User"}</span>
        </h1>
        <p className="font-label-caps text-sm text-on-surface font-semibold tracking-[0.1em] mt-3 uppercase">
          Authorized Role: <span className="text-secondary font-bold">{user?.role}</span>
        </p>
      </div>
      <Card className="border-l-4 border-l-primary-container shadow-xl bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-title-sm text-xl text-primary">System Overview</CardTitle>
          <CardDescription className="font-medium text-on-surface-variant">
            This secure portal is synchronized with the regional fuel management database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-surface-container-low border border-outline/10 rounded-lg">
              <span className="font-label-caps text-xs text-on-surface-variant font-bold uppercase tracking-widest block mb-2">Administrative Email</span>
              <p className="text-base font-semibold text-on-surface">{user?.email}</p>
            </div>
            <div className="p-5 bg-surface-container-low border border-outline/10 rounded-lg">
              <span className="font-label-caps text-xs text-on-surface-variant font-bold uppercase tracking-widest block mb-2">Assigned Station</span>
              <p className="text-base font-semibold text-on-surface">
                {user?.stationId != null
                  ? formatStationWithId(user.stationId, user.stationName ?? null)
                  : "Not assigned"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
