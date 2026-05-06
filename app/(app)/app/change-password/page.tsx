"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { useAuth } from "@/lib/auth/context";
import { getRoleHomePath } from "@/lib/auth/roles";

const ALLOWED_ROLES = new Set(["GOVERNMENT_ADMIN", "STATION_MANAGER"]);

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.role) return;
    if (!ALLOWED_ROLES.has(user.role)) {
      router.replace(getRoleHomePath(user.role));
    }
  }, [router, user?.role]);

  if (!user?.role || !ALLOWED_ROLES.has(user.role)) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-2xl border border-outline/20 bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur">
        <p className="text-xs font-black tracking-[0.2em] uppercase text-yellow-700">Account Security</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-black">Change Password</h1>
        <p className="mt-2 text-sm text-black/60">
          Update your current account password. You will be signed out after success.
        </p>

        <div className="mt-6">
          <ChangePasswordForm />
        </div>

        <div className="mt-4">
          <Link
            href={getRoleHomePath(user.role)}
            className="text-xs font-semibold uppercase tracking-widest text-primary hover:text-surface-tint transition-colors"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
