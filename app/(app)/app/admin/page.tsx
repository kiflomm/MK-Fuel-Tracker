"use client";

import { useAuth } from "@/lib/auth/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.firstName ?? "Admin"}. Use the sidebar to manage the system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Stations & Users</div>
            <p className="text-xs text-muted-foreground mt-1">
              Add new stations and assign managers.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pricing & Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Economics</div>
            <p className="text-xs text-muted-foreground mt-1">
              Configure global fuel pricing and strict quotas.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Reports</div>
            <p className="text-xs text-muted-foreground mt-1">
              View daily totals and distribution metrics.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
