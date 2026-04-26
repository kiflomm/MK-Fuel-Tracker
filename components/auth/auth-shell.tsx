import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-12">
      <div className="absolute left-4 top-4">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
          <Link href="/">
            <Home className="size-4" />
            <span>Home</span>
          </Link>
        </Button>
      </div>
      <div className="space-y-2 text-center">
        <Link href="/" className="text-sm font-medium text-muted-foreground">
          Mekelle Fuel Tracker
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-xl border bg-card p-6">{children}</div>
      {footer ? <div className="text-center text-sm text-muted-foreground">{footer}</div> : null}
    </div>
  );
}
