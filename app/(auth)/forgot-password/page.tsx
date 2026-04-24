import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      description="Enter your account email and we will send you a verification code."
      footer={
        <>
          Remembered your password? <Link href="/sign-in" className="underline">Go back to sign in</Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
