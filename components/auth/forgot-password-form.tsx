"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { forgotPassword, AuthApiError } from "@/lib/auth/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      toast.success("If your account exists, a reset code has been sent to your email.");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      const message =
        error instanceof AuthApiError
          ? error.message
          : "Could not start password reset. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Account email</Label>
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
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending code..." : "Send reset code"}
      </Button>
    </form>
  );
}
