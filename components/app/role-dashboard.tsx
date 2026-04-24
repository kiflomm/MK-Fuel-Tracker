"use client";

import { useAuth } from "@/lib/auth/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RoleDashboard() {
  const { user } = useAuth();

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome, {user?.firstName ?? "User"}</h1>
        <p className="text-muted-foreground">
          You are signed in as <span className="font-medium">{user?.role}</span>.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard placeholder</CardTitle>
          <CardDescription>
            This route is protected and ready for role-specific modules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Email: {user?.email}</p>
          <p>Station ID: {user?.stationId ?? "N/A"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
