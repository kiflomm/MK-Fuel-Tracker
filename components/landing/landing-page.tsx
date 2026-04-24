import Link from "next/link";
import { ArrowRight, Fuel, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const featureCards = [
  {
    title: "Transparent Quotas",
    description: "Vehicle owners can track available quota and fuel price updates in one place.",
    icon: Fuel,
  },
  {
    title: "Safe Access Control",
    description: "Role-based access keeps admin, station, and owner workflows separated and secure.",
    icon: ShieldCheck,
  },
  {
    title: "Operational Visibility",
    description: "Station teams can manage queue activity with clear assignment and status views.",
    icon: UserCheck,
  },
];

export function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <p className="font-semibold tracking-tight">Mekelle Fuel Tracker</p>
          <Button asChild size="sm">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-6">
            <p className="text-sm font-medium text-muted-foreground">Fuel distribution platform</p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Manage fuel queues and payments with clarity.
            </h1>
            <p className="max-w-xl text-muted-foreground">
              A unified platform for government administrators, station teams, and vehicle owners to
              handle quotas, payment verification, and queue operations.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/sign-in">
                  Get started
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/forgot-password">Recover account</Link>
              </Button>
            </div>
          </div>
          <Card className="self-start">
            <CardHeader>
              <CardTitle>How it works</CardTitle>
              <CardDescription>
                Distribution and service flow designed for accountability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>1. Admin configures quota rules and station operations.</p>
              <p>2. Vehicle owner initiates payment and joins queue.</p>
              <p>3. Station team serves verified users and updates progress.</p>
            </CardContent>
          </Card>
        </section>

      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 text-sm text-muted-foreground">
          <p>Built for reliable fuel service operations.</p>
          <p>Role-aware access and queue transparency.</p>
        </div>
      </footer>
    </div>
  );
}
