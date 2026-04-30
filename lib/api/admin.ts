"use client";

import type { ApiEnvelope } from "@/lib/auth/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export class AdminApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}

async function adminRequest<T>(
  path: string,
  accessToken: string,
  options: RequestInit = {},
): Promise<ApiEnvelope<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers ?? {}),
    },
  });

  let payload: ApiEnvelope<T> | null = null;
  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    // ignore
  }

  if (!response.ok || !payload?.success) {
    throw new AdminApiError(
      payload?.message ?? "Admin request failed.",
      response.status,
    );
  }

  return payload;
}

// ----------------------------------------------------------------------------
// Stations
// ----------------------------------------------------------------------------

export interface Station {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  fuelStatus: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getStations(accessToken: string) {
  return adminRequest<Station[]>("/admin/stations", accessToken, { method: "GET" });
}

export async function createStation(
  accessToken: string,
  data: { name: string; address: string; city: string; phone: string; fuelStatus: string; },
) {
  return adminRequest<Station>("/admin/stations", accessToken, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStation(
  accessToken: string,
  id: number,
  data: { name?: string; address?: string; city?: string; phone?: string; fuelStatus?: string; isActive?: boolean },
) {
  return adminRequest<Station>(`/admin/stations/${id}`, accessToken, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ----------------------------------------------------------------------------
// Users
// ----------------------------------------------------------------------------

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  isActive: boolean;
  stationId?: number;
  createdAt: string;
  updatedAt: string;
}

export async function getUsers(accessToken: string) {
  return adminRequest<User[]>("/admin/users", accessToken, { method: "GET" });
}

export async function createStationManager(
  accessToken: string,
  data: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    stationId: number;
  },
) {
  return adminRequest<User>("/admin/users/station-managers", accessToken, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createVehicleOwner(
  accessToken: string,
  data: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    vehicles?: Array<{ plateNumber: string; category: string; label?: string }>;
  },
) {
  return adminRequest<User>("/admin/users/vehicle-owners", accessToken, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface OwnerVehicle {
  id: number;
  plateNumber: string;
  category: string;
  label: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithVehicles extends User {
  vehicles?: OwnerVehicle[];
}

export async function getUserById(accessToken: string, id: number) {
  return adminRequest<UserWithVehicles>("/admin/users/" + id, accessToken, {
    method: "GET",
  });
}

export async function addVehiclesToOwner(
  accessToken: string,
  ownerUserId: number,
  vehicles: Array<{ plateNumber: string; category: string; label?: string }>,
) {
  return adminRequest<OwnerVehicle[]>(
    `/admin/users/vehicle-owners/${ownerUserId}/vehicles`,
    accessToken,
    {
      method: "POST",
      body: JSON.stringify({ vehicles }),
    },
  );
}

export async function updateUserStatus(
  accessToken: string,
  id: number,
  isActive: boolean,
) {
  return adminRequest<{ id: number; isActive: boolean }>("/admin/users/" + id, accessToken, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}

// ----------------------------------------------------------------------------
// Fuel Prices
// ----------------------------------------------------------------------------

export interface FuelPrice {
  id: number;
  fuelType: string;
  pricePerLiter: number;
  createdAt: string;
  updatedAt: string;
}

export async function getFuelPrices(accessToken: string) {
  return adminRequest<FuelPrice[]>("/admin/fuel-prices", accessToken, { method: "GET" });
}

export async function upsertFuelPrice(
  accessToken: string,
  data: { fuelType: string; pricePerLiter: number },
) {
  return adminRequest<FuelPrice>("/admin/fuel-prices", accessToken, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ----------------------------------------------------------------------------
// Quota Rules
// ----------------------------------------------------------------------------

export interface QuotaRule {
  id: number;
  vehicleCategory: string;
  period: "DAILY" | "WEEKLY" | "MONTHLY";
  litersLimit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getQuotaRules(accessToken: string) {
  return adminRequest<QuotaRule[]>("/admin/quota-rules", accessToken, { method: "GET" });
}

export async function createQuotaRule(
  accessToken: string,
  data: {
    vehicleCategory: string;
    period: "DAILY" | "WEEKLY" | "MONTHLY";
    litersLimit: number;
    isActive?: boolean;
  },
) {
  return adminRequest<QuotaRule>("/admin/quota-rules", accessToken, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateQuotaRule(
  accessToken: string,
  id: number,
  data: {
    litersLimit?: number;
    isActive?: boolean;
  },
) {
  return adminRequest<QuotaRule>(`/admin/quota-rules/${id}`, accessToken, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteQuotaRule(accessToken: string, id: number) {
  return adminRequest<void>(`/admin/quota-rules/${id}`, accessToken, {
    method: "DELETE",
  });
}

// ----------------------------------------------------------------------------
// Reports
// ----------------------------------------------------------------------------

export interface DailyTotals {
  date: string;
  totalLiters: number;
  totalRevenue: number;
  vehicleCount: number;
}

export async function getDailyTotals(
  accessToken: string,
  params?: { startDate?: string; endDate?: string; stationId?: number },
) {
  const query = new URLSearchParams();
  if (params?.startDate) query.append("startDate", params.startDate);
  if (params?.endDate) query.append("endDate", params.endDate);
  if (params?.stationId) query.append("stationId", params.stationId.toString());

  const qs = query.toString() ? `?${query.toString()}` : "";
  return adminRequest<DailyTotals[]>(`/admin/reports/daily-totals${qs}`, accessToken, {
    method: "GET",
  });
}

export async function getServiceActivity(
  accessToken: string,
  params?: { startDate?: string; endDate?: string; stationId?: number },
) {
  const query = new URLSearchParams();
  if (params?.startDate) query.append("startDate", params.startDate);
  if (params?.endDate) query.append("endDate", params.endDate);
  if (params?.stationId) query.append("stationId", params.stationId.toString());

  const qs = query.toString() ? `?${query.toString()}` : "";
  return adminRequest<any>(`/admin/reports/service-activity${qs}`, accessToken, {
    method: "GET",
  });
}

export async function getDistributionReport(
  accessToken: string,
  params?: {
    startDate?: string;
    endDate?: string;
    stationId?: number;
    vehicleCategory?: string;
    fuelType?: string;
  },
) {
  const query = new URLSearchParams();
  if (params?.startDate) query.append("startDate", params.startDate);
  if (params?.endDate) query.append("endDate", params.endDate);
  if (params?.stationId) query.append("stationId", params.stationId.toString());
  if (params?.vehicleCategory) query.append("vehicleCategory", params.vehicleCategory);
  if (params?.fuelType) query.append("fuelType", params.fuelType);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return adminRequest<any>(`/admin/reports/distribution${qs}`, accessToken, {
    method: "GET",
  });
}
