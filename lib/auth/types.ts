"use client";

export type UserRole =
  | "GOVERNMENT_ADMIN"
  | "STATION_MANAGER"
  | "STATION_WORKER"
  | "VEHICLE_OWNER";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  stationId: number | null;
  /** Present when stationId is set; loaded from stations table. */
  stationName?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export interface AuthTokensResponse {
  accessToken: string;
  user: AuthUser;
}
