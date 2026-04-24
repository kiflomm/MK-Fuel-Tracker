"use client";

import type { ApiEnvelope, AuthTokensResponse, AuthUser } from "@/lib/auth/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

async function authRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiEnvelope<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    credentials: "include",
  });

  let payload: ApiEnvelope<T> | null = null;
  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    // Ignore parse errors and fall through to fallback error handling.
  }

  if (!response.ok || !payload?.success) {
    throw new AuthApiError(
      payload?.message ?? "Authentication request failed.",
      response.status,
    );
  }

  return payload;
}

export async function login(email: string, password: string) {
  return authRequest<AuthTokensResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function refresh() {
  return authRequest<AuthTokensResponse>("/auth/refresh", {
    method: "POST",
  });
}

export async function logout() {
  return authRequest<null>("/auth/logout", {
    method: "POST",
  });
}

export async function getProfile(accessToken: string) {
  return authRequest<AuthUser>("/auth/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function forgotPassword(email: string) {
  return authRequest<null>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyResetCode(code: string) {
  return authRequest<{ valid: boolean }>("/auth/verify-reset-code", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export async function resetPassword(code: string, password: string) {
  return authRequest<null>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ code, password }),
  });
}
