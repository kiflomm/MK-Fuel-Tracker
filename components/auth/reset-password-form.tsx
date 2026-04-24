"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthApiError, resetPassword, verifyResetCode } from "@/lib/auth/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const emailHint = searchParams.get("email");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCheckingCode(true);
    try {
      const response = await verifyResetCode(code);
      if (response.data?.valid) {
        setIsCodeValid(true);
        toast.success("Code verified. You can now set a new password.");
      } else {
        toast.error("Code could not be verified.");
      }
    } catch (error) {
      const message =
        error instanceof AuthApiError ? error.message : "Invalid or expired reset code.";
      toast.error(message);
    } finally {
      setIsCheckingCode(false);
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsResetting(true);
    try {
      await resetPassword(code, password);
      toast.success("Password reset successful. Please sign in.");
      window.location.assign("/sign-in");
    } catch (error) {
      const message =
        error instanceof AuthApiError ? error.message : "Could not reset password.";
      toast.error(message);
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <div className="space-y-6">
      {emailHint ? (
        <p className="text-xs text-muted-foreground">
          Verification code requested for <span className="font-medium">{emailHint}</span>
        </p>
      ) : null}

      <form className="space-y-3" onSubmit={handleVerifyCode}>
        <div className="space-y-2">
          <Label htmlFor="code">Reset code</Label>
          <Input
            id="code"
            type="text"
            placeholder="6-digit code"
            value={code}
            onChange={(event) => setCode(event.target.value.trim())}
            required
          />
        </div>
        <Button type="submit" variant="outline" className="w-full" disabled={isCheckingCode}>
          {isCheckingCode ? "Verifying..." : "Verify code"}
        </Button>
      </form>

      <form className="space-y-3" onSubmit={handleResetPassword}>
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            disabled={!isCodeValid}
            required
          />
        </div>
        <Button className="w-full" type="submit" disabled={!isCodeValid || isResetting}>
          {isResetting ? "Resetting..." : "Reset password"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Didn&apos;t get the code? <Link href="/forgot-password" className="underline">Request again</Link>
      </p>
    </div>
  );
}
