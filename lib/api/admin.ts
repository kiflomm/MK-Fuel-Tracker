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
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  isActive: boolean;
  queueIntakePaused?: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getStations(accessToken: string) {
  return adminRequest<Station[]>("/admin/stations", accessToken, { method: "GET" });
}

export async function getStation(accessToken: string, id: number) {
  return adminRequest<Station>(`/admin/stations/${id}`, accessToken, { method: "GET" });
}

export async function createStation(
  accessToken: string,
  data: { name: string; latitude?: number; longitude?: number; phone?: string },
) {
  return adminRequest<Station>("/admin/stations", accessToken, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStation(
  accessToken: string,
  id: number,
  data: {
    name?: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    isActive?: boolean;
    queueIntakePaused?: boolean;
  },
) {
  return adminRequest<Station>(`/admin/stations/${id}`, accessToken, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export interface StationFuelInventoryItem {
  fuelTypeId: number;
  fuelTypeCode: string;
  fuelTypeName: string;
  fuelTypeIsActive: boolean;
  remainingLiters: number;
  inventoryUpdatedAt: string | null;
}

export interface AdjustStationFuelInventoryResult {
  stationId: number;
  fuelTypeId: number;
  previousLiters: number;
  updatedLiters: number;
  deltaLiters: number;
  reason: string | null;
  note: string | null;
  adjustmentId: number;
}

export interface FuelInventoryAdjustmentEntry {
  id: number;
  stationId: number;
  fuelTypeId: number;
  fuelTypeCode: string;
  fuelTypeName: string;
  previousLiters: number;
  updatedLiters: number;
  deltaLiters: number;
  reason: string | null;
  note: string | null;
  changedByUserId: number;
  changedByEmail: string;
  changedByFirstName: string;
  changedByLastName: string;
  changedAt: string;
}

export async function getStationFuelInventory(accessToken: string, stationId: number) {
  return adminRequest<StationFuelInventoryItem[]>(
    `/admin/stations/${stationId}/fuel-inventory`,
    accessToken,
    { method: "GET" },
  );
}

export async function adjustStationFuelInventory(
  accessToken: string,
  stationId: number,
  data: { fuelTypeId: number; deltaLiters: number; reason?: string; note?: string },
) {
  return adminRequest<AdjustStationFuelInventoryResult>(
    `/admin/stations/${stationId}/fuel-inventory/adjust`,
    accessToken,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}

export async function getFuelInventoryAdjustments(
  accessToken: string,
  params?: {
    stationId?: number;
    fuelTypeId?: number;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
  },
) {
  const query = new URLSearchParams();
  if (params?.stationId !== undefined) query.set("stationId", String(params.stationId));
  if (params?.fuelTypeId !== undefined) query.set("fuelTypeId", String(params.fuelTypeId));
  if (params?.from) query.set("from", params.from);
  if (params?.to) query.set("to", params.to);
  if (params?.limit !== undefined) query.set("limit", String(params.limit));
  if (params?.offset !== undefined) query.set("offset", String(params.offset));

  const qs = query.toString() ? `?${query.toString()}` : "";
  return adminRequest<FuelInventoryAdjustmentEntry[]>(
    `/admin/fuel-inventory-adjustments${qs}`,
    accessToken,
    { method: "GET" },
  );
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
    vehicles?: Array<{
      plateNumber: string;
      categoryId: number;
      label?: string;
    }>;
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
  categoryId: number;
  categoryCode: string | null;
  categoryName: string | null;
  label: string | null;
  isActive: boolean;
  quotaRules: Array<{
    id: number;
    period: "DAILY" | "WEEKLY" | "MONTHLY";
    litersLimit: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
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
  vehicles: Array<{
    plateNumber: string;
    categoryId: number;
    label?: string;
  }>,
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

export interface FuelType {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  pricePerLiter: number | null;
  priceUpdatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getFuelTypes(
  accessToken: string,
  params?: { includeInactive?: boolean },
) {
  const query = new URLSearchParams();
  if (params?.includeInactive) query.set("includeInactive", "true");
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return adminRequest<FuelType[]>(`/admin/fuel-types${suffix}`, accessToken, { method: "GET" });
}

export async function createFuelTypeWithPrice(
  accessToken: string,
  data: { code: string; name: string; pricePerLiter: number; isActive?: boolean },
) {
  return adminRequest<FuelType>("/admin/fuel-types", accessToken, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateFuelType(
  accessToken: string,
  id: number,
  data: { code?: string; name?: string; isActive?: boolean },
) {
  return adminRequest<FuelType>(`/admin/fuel-types/${id}`, accessToken, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteFuelType(accessToken: string, id: number) {
  return adminRequest<{ id: number }>(`/admin/fuel-types/${id}`, accessToken, {
    method: "DELETE",
  });
}

export interface FuelPrice {
  id: number;
  fuelType: string;
  pricePerLiter: number;
  fuelTypeName?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getFuelPrices(accessToken: string) {
  return adminRequest<FuelPrice[]>("/admin/fuel-prices", accessToken, { method: "GET" });
}

export async function upsertFuelPrice(
  accessToken: string,
  data: { fuelTypeCode: string; pricePerLiter: number; isActive?: boolean },
) {
  return adminRequest<FuelPrice>("/admin/fuel-prices", accessToken, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ----------------------------------------------------------------------------
// Vehicle Categories
// ----------------------------------------------------------------------------

export interface VehicleCategory {
  id: number;
  code: string;
  name: string;
  description: string | null;
  fuelSubsidyPercentage: number | string;
  quotaRules: Array<{
    id: number;
    period: "DAILY" | "WEEKLY" | "MONTHLY";
    litersLimit: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getVehicleCategories(
  accessToken: string,
  params?: { includeInactive?: boolean },
) {
  const query = new URLSearchParams();
  if (params?.includeInactive) query.set("includeInactive", "true");
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return adminRequest<VehicleCategory[]>(`/admin/vehicle-categories${suffix}`, accessToken, { method: "GET" });
}

export async function createVehicleCategory(
  accessToken: string,
  data: {
    code: string;
    name: string;
    description?: string;
    fuelSubsidyPercentage?: number;
    isActive?: boolean;
    quotaRules: Array<{
      period: "DAILY" | "WEEKLY" | "MONTHLY";
      litersLimit: number;
      isActive?: boolean;
    }>;
  },
) {
  return adminRequest<VehicleCategory>("/admin/vehicle-categories", accessToken, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateVehicleCategory(
  accessToken: string,
  id: number,
  data: {
    code?: string;
    name?: string;
    description?: string;
    fuelSubsidyPercentage?: number;
    isActive?: boolean;
    quotaRules?: Array<{
      period: "DAILY" | "WEEKLY" | "MONTHLY";
      litersLimit: number;
      isActive?: boolean;
    }>;
  },
) {
  return adminRequest<VehicleCategory>(`/admin/vehicle-categories/${id}`, accessToken, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteVehicleCategory(accessToken: string, id: number) {
  return adminRequest<void>(`/admin/vehicle-categories/${id}`, accessToken, {
    method: "DELETE",
  });
}

export async function getVehicleQuotaRules(accessToken: string, id: number) {
  return adminRequest<
    Array<{
      id: number;
      period: "DAILY" | "WEEKLY" | "MONTHLY";
      litersLimit: number;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }>
  >(`/admin/vehicles/${id}/quota-rules`, accessToken, {
    method: "GET",
  });
}

export async function updateVehicleQuotaRules(
  accessToken: string,
  id: number,
  quotaRules: Array<{
    period: "DAILY" | "WEEKLY" | "MONTHLY";
    litersLimit: number;
    isActive?: boolean;
  }>,
) {
  return adminRequest<
    Array<{
      id: number;
      period: "DAILY" | "WEEKLY" | "MONTHLY";
      litersLimit: number;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }>
  >(`/admin/vehicles/${id}/quota-rules`, accessToken, {
    method: "PATCH",
    body: JSON.stringify({ quotaRules }),
  });
}

// ----------------------------------------------------------------------------
// Reports
// ----------------------------------------------------------------------------

export type RevenueGranularity = "DAILY" | "WEEKLY" | "MONTHLY";

export interface RevenueTimeseriesTotals {
  revenue: string;
  transactionCount: number;
  litersDispensed: string;
  uniqueVehicles: number;
}

export interface RevenueStationBreakdown extends RevenueTimeseriesTotals {
  stationId: number;
  stationName: string | null;
}

export interface RevenueTimeseriesBucket {
  periodStart: string;
  periodEnd: string;
  totals: RevenueTimeseriesTotals;
  byStation?: RevenueStationBreakdown[];
}

export interface RevenueTimeseriesData {
  granularity: RevenueGranularity;
  from: string;
  to: string;
  paymentStatusFilter: "SUCCESS";
  buckets: RevenueTimeseriesBucket[];
}

export async function getRevenueTimeseries(
  accessToken: string,
  params: {
    from: string;
    to: string;
    granularity: RevenueGranularity;
    stationId?: number;
  },
) {
  const query = new URLSearchParams();
  query.append("from", params.from);
  query.append("to", params.to);
  query.append("granularity", params.granularity);
  if (params.stationId != null) query.append("stationId", params.stationId.toString());
  return adminRequest<RevenueTimeseriesData>(
    `/admin/reports/revenue-timeseries?${query.toString()}`,
    accessToken,
    { method: "GET" },
  );
}

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

// ----------------------------------------------------------------------------
// Audit Logs
// ----------------------------------------------------------------------------

export interface AuditLog {
  id: number;
  userId: number;
  userFirstName: string;
  userLastName: string;
  userRole: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: any;
  createdAt: string;
}

export async function getAuditLogs(
  accessToken: string,
  params?: { limit?: number; offset?: number },
) {
  const query = new URLSearchParams();
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.offset) query.append("offset", params.offset.toString());

  const qs = query.toString() ? `?${query.toString()}` : "";
  return adminRequest<AuditLog[]>(`/admin/audit-logs${qs}`, accessToken, {
    method: "GET",
  });
}
