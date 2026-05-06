"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthApiError, changePassword } from "@/lib/auth/api";
import { useAuth } from "@/lib/auth/context";

function PasswordField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2.5">
      <Label
        htmlFor={id}
        className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-black"
      >
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          minLength={6}
          required
          className="text-black h-12 rounded-xl bg-neutral-100/50 border-neutral-200 focus-visible:ring-1 focus-visible:ring-primary px-4 pr-12 text-sm font-medium shadow-sm transition-all"
        />
        <button
          type="button"
          onClick={() => setVisible((previous) => !previous)}
          className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
        >
          {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

export function ChangePasswordForm() {
  const router = useRouter();
  const { accessToken, signOut } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationMessage = useMemo(() => {
    if (!newPassword || !confirmNewPassword) return null;
    if (newPassword.length < 6) return "New password must be at least 6 characters.";
    if (newPassword === currentPassword) {
      return "New password must be different from current password.";
    }
    if (newPassword !== confirmNewPassword) return "New password and confirmation do not match.";
    return null;
  }, [confirmNewPassword, currentPassword, newPassword]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessToken) {
      toast.error("Session expired. Please sign in again.");
      router.replace("/sign-in");
      return;
    }

    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword(accessToken, currentPassword, newPassword);
      toast.success("Password changed successfully. Please sign in again.");
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      const message =
        error instanceof AuthApiError ? error.message : "Unable to change password right now.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <PasswordField
        id="currentPassword"
        label="Current Password"
        value={currentPassword}
        onChange={setCurrentPassword}
      />
      <PasswordField
        id="newPassword"
        label="New Password"
        value={newPassword}
        onChange={setNewPassword}
      />
      <PasswordField
        id="confirmNewPassword"
        label="Confirm New Password"
        value={confirmNewPassword}
        onChange={setConfirmNewPassword}
      />

      {validationMessage ? <p className="text-xs text-destructive">{validationMessage}</p> : null}

      <Button
        className="w-full bg-primary-container text-on-primary-container font-label-caps text-[11px] uppercase tracking-[0.2em] font-bold h-12 rounded-full hover:bg-surface-tint hover:text-white transition-all transform active:scale-[0.98] shadow-md"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Updating Password..." : "Update Password"}
      </Button>
    </form>
  );
}
