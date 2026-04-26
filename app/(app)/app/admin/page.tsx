"use client";

import { useAuth } from "@/lib/auth/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="w-full space-y-8">
      <div className="relative">
        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary-container"></div>
        <h1 className="font-display-lg text-4xl text-on-surface tracking-tight">Admin Overview</h1>
        <p className="font-label-caps text-sm text-on-surface font-semibold tracking-[0.1em] mt-3 uppercase">
          Welcome back, <span className="text-primary font-bold">{user?.firstName ?? "Admin"}</span> • Strategic System Control
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white border-outline/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-black">Platform Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-title-sm text-black">Stations & Users</div>
            <p className="text-sm text-black/80 mt-2 font-medium">
              Add new stations and assign managers.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-outline/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-black">Pricing & Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-title-sm text-black">Economics</div>
            <p className="text-sm text-black/80 mt-2 font-medium">
              Configure global fuel pricing and strict quotas.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-outline/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-black">Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-title-sm text-black">Reports</div>
            <p className="text-sm text-black/80 mt-2 font-medium">
              View daily totals and distribution metrics.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
