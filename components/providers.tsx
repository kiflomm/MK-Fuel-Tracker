"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth/context";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/lib/i18n/language-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
