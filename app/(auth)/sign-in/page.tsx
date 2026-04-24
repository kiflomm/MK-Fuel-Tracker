import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue to your role-specific dashboard."
      footer={
        <>
          Need help? <Link href="/forgot-password" className="underline">Reset password</Link>
        </>
      }
    >
      <SignInForm />
    </AuthShell>
  );
}
