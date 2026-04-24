import Link from "next/link";
import { ProtectedAppGate } from "@/components/auth/protected-app-gate";
import { LogoutButton } from "@/components/auth/logout-button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedAppGate>
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/app" className="font-semibold tracking-tight">
              Mekelle Fuel Tracker
            </Link>
            <LogoutButton />
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
      </div>
    </ProtectedAppGate>
  );
}
