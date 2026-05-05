"use client";

import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { useLanguage } from "@/lib/i18n/language-context";

export default function SignInPage() {
  const { t } = useLanguage();

  return (
    <AuthShell
      title={t("login_title_welcome")}
      description={t("login_desc")}
      footer={
        <>
          {t("login_help_text")}{" "}
          <Link href="/forgot-password" className="underline">
            {t("login_reset_link")}
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthShell>
  );
}
