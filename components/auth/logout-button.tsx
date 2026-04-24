"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/context";

export function LogoutButton() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);
    try {
      await signOut();
      toast.success("Signed out.");
      router.replace("/sign-in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isSubmitting}>
      {isSubmitting ? "Signing out..." : "Sign out"}
    </Button>
  );
}
