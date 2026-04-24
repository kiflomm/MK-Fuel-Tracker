"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { getRoleHomePath } from "@/lib/auth/roles";

export function ProtectedAppGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isBootstrapping, user } = useAuth();

  useEffect(() => {
    if (isBootstrapping) {
      return;
    }
    if (!isAuthenticated) {
      router.replace("/sign-in");
      return;
    }
    if (pathname === "/app" && user?.role) {
      router.replace(getRoleHomePath(user.role));
    }
  }, [isAuthenticated, isBootstrapping, pathname, router, user?.role]);

  if (isBootstrapping) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Restoring your session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
