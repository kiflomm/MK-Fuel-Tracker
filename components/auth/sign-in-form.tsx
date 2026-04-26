"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth/context";
import { getRoleHomePath } from "@/lib/auth/roles";
import { AuthApiError } from "@/lib/auth/api";

export function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const user = await signIn(email, password);
      toast.success("Signed in successfully.");
      router.push(getRoleHomePath(user.role));
    } catch (error) {
      const message =
        error instanceof AuthApiError ? error.message : "Unable to sign in. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email" className="font-label-caps text-xs uppercase tracking-widest text-on-surface font-bold">Administrative Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="font-label-caps text-xs uppercase tracking-widest text-on-surface font-bold">Identification Key</Label>
          <Link href="/forgot-password" title="Forgot Password" className="font-label-caps text-xs uppercase tracking-widest text-primary hover:text-surface-tint transition-colors font-bold">
            Forgot?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>
      <Button 
        className="w-full bg-primary-container text-on-primary-container font-label-caps text-xs uppercase tracking-[0.2em] py-6 rounded-none hover:bg-surface-tint hover:text-white transition-all transform active:scale-[0.98] shadow-lg mt-4" 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
            Authenticating...
          </span>
        ) : (
          "Official Sign In"
        )}
      </Button>
    </form>
  );
}
