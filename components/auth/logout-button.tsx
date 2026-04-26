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
    <Button 
      variant="default" 
      onClick={handleLogout} 
      disabled={isSubmitting}
      className="bg-primary-container text-on-primary-container font-label-caps text-[10px] uppercase tracking-widest px-6 h-9 rounded-none hover:bg-surface-tint hover:text-white transition-all transform active:scale-95 shadow-md border border-primary/10"
    >
      {isSubmitting ? (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
          Signing out...
        </span>
      ) : (
        "Sign out"
      )}
    </Button>
  );
}
