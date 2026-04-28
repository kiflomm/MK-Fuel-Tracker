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
import { Eye, EyeOff } from "lucide-react";

export function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2.5">
        <Label htmlFor="email" className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-black">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          className="text-black h-12 rounded-xl bg-neutral-100/50 border-neutral-200 focus-visible:ring-1 focus-visible:ring-primary px-4 text-sm font-medium shadow-sm transition-all"
        />
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-black">Password</Label>
          <Link href="/forgot-password" title="Forgot Password" className="font-label-caps text-[10px] uppercase tracking-widest text-primary hover:text-surface-tint transition-colors font-bold">
            Forgot?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            required
            className="text-black h-12 rounded-xl bg-neutral-100/50 border-neutral-200 focus-visible:ring-1 focus-visible:ring-primary px-4 pr-12 text-sm font-medium shadow-sm transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <Button
        className="w-full bg-primary-container text-on-primary-container font-label-caps text-[11px] uppercase tracking-[0.2em] font-bold h-14 rounded-full hover:bg-surface-tint hover:text-white transition-all transform active:scale-[0.98] shadow-md mt-4"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Authenticating...
          </span>
        ) : (
          "Official Sign In"
        )}
      </Button>
    </form>
  );
}
