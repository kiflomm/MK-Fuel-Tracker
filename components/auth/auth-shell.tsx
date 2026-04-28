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
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      <div className="space-y-4 mb-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center justify-center p-3.5 bg-neutral-200/50 rounded-2xl mb-2 text-neutral-800 shadow-sm border border-black/5">
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-neutral-900 leading-none">{title}</h1>
        <p className="text-neutral-500 font-semibold text-sm leading-relaxed">{description}</p>
      </div>
      
      <div className="space-y-6">
        {children}
      </div>
      
      {footer && (
        <div className="mt-10 pt-6 border-t border-neutral-200 text-center text-[10px] text-neutral-400 font-bold tracking-widest uppercase">
          {footer}
        </div>
      )}
    </div>
  );
}
