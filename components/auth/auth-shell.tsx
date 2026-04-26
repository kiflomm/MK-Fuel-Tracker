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
    <div className="relative mx-auto flex w-full max-w-md flex-col gap-8 px-6">
      <div className="absolute -left-12 top-0">
        <Button variant="ghost" size="sm" asChild className="text-on-surface hover:text-primary font-label-caps text-xs tracking-widest uppercase gap-2 transition-all hover:translate-x-1 font-bold">
          <Link href="/">
            <Home className="size-4" />
            <span>Portal Home</span>
          </Link>
        </Button>
      </div>
      <div className="space-y-3 text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="material-symbols-outlined text-yellow-600 text-4xl mb-2">
            energy_savings_leaf
          </span>
          <span className="font-label-caps text-xs text-on-surface font-bold tracking-[0.2em] uppercase">
            Mekelle Fuel Tracker
          </span>
        </div>
        <h1 className="font-display-lg text-4xl text-on-surface tracking-tight">{title}</h1>
        <p className="font-semibold text-sm text-on-surface/70 max-w-[320px] mx-auto leading-relaxed">{description}</p>
      </div>
      <div className="bg-white/90 backdrop-blur-md rounded-none border-l-4 border-l-primary-container p-10 shadow-2xl border-y border-r border-outline/20">
        {children}
      </div>
      {footer ? <div className="text-center font-label-caps text-xs text-on-surface font-bold tracking-widest uppercase">{footer}</div> : null}
    </div>
  );
}
