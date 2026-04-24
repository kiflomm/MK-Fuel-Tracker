"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProfile, login as loginRequest, logout as logoutRequest, refresh } from "@/lib/auth/api";
import type { AuthUser } from "@/lib/auth/types";

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    setAccessToken(null);
  }, []);

  const refreshSession = useCallback(async () => {
    const refreshed = await refresh();
    const token = refreshed.data?.accessToken ?? null;
    if (!token) {
      throw new Error("No access token returned from refresh.");
    }
    setAccessToken(token);

    const profile = await getProfile(token);
    if (!profile.data) {
      throw new Error("No profile returned after refresh.");
    }
    setUser(profile.data);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await loginRequest(email, password);
    const token = response.data?.accessToken ?? null;
    const signedInUser = response.data?.user ?? null;
    if (!token || !signedInUser) {
      throw new Error("Login response is missing required auth data.");
    }
    setAccessToken(token);
    setUser(signedInUser);
    return signedInUser;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await refreshSession();
      } catch {
        if (active) {
          clearSession();
        }
      } finally {
        if (active) {
          setIsBootstrapping(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [clearSession, refreshSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user && accessToken),
      isBootstrapping,
      signIn,
      signOut,
      refreshSession,
    }),
    [accessToken, isBootstrapping, refreshSession, signIn, signOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
