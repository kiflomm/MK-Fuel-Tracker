"use client";

import type { ApiEnvelope } from "@/lib/auth/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export class StationManagerApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "StationManagerApiError";
  }
}

async function smRequest<T>(
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
    throw new StationManagerApiError(
      payload?.message ?? "Station Manager request failed.",
      response.status,
    );
  }

  return payload;
}

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface StationWorker {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  isActive: boolean;
  stationId: number;
  createdAt: string;
  updatedAt: string;
}

export interface QueueItem {
  id: number;
  plateNumber: string;
  vehicleCategory: string;
  status: string;
  joinedAt: string;
}

export interface LiveQueue {
  stationId: number;
  stationName: string;
  isIntakePaused: boolean;
  queueLength: number;
  items: QueueItem[];
}

/** Per fuel type remaining liters at this station */
export interface StationFuelInventoryRow {
  fuelTypeId: number;
  fuelTypeCode: string;
  fuelTypeName: string;
  fuelTypeIsActive: boolean;
  remainingLiters: number;
  inventoryUpdatedAt: string | null;
}

export interface StationTransaction {
  id: number;
  plateNumber: string;
  liters: number;
  totalPrice: number;
  fuelType: string;
  timestamp: string;
  workerName: string;
}

// ----------------------------------------------------------------------------
// Worker Management
// ----------------------------------------------------------------------------

export async function getStationWorkers(accessToken: string) {
  return smRequest<StationWorker[]>("/station-manager/users/station-workers", accessToken, {
    method: "GET",
  });
}

export async function createStationWorker(
  accessToken: string,
  data: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
  },
) {
  return smRequest<StationWorker>("/station-manager/users/station-workers", accessToken, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStationWorker(
  accessToken: string,
  id: number,
  data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
  },
) {
  return smRequest<StationWorker>(`/station-manager/users/station-workers/${id}`, accessToken, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function updateStationWorkerStatus(
  accessToken: string,
  id: number,
  isActive: boolean,
) {
  return smRequest<StationWorker>(`/station-manager/users/station-workers/${id}/status`, accessToken, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}

// ----------------------------------------------------------------------------
// Queue Control
// ----------------------------------------------------------------------------

export async function getLiveQueue(accessToken: string) {
  return smRequest<LiveQueue>("/station-manager/queue/live", accessToken, {
    method: "GET",
  });
}

export async function getStationFuelInventory(accessToken: string) {
  return smRequest<StationFuelInventoryRow[]>("/station-manager/fuel-inventory", accessToken, {
    method: "GET",
  });
}

export async function pauseQueueIntake(accessToken: string) {
  return smRequest<any>("/station-manager/queue/intake/pause", accessToken, {
    method: "PATCH",
  });
}

export async function resumeQueueIntake(accessToken: string) {
  return smRequest<any>("/station-manager/queue/intake/resume", accessToken, {
    method: "PATCH",
  });
}

// ----------------------------------------------------------------------------
// Reporting
// ----------------------------------------------------------------------------

export interface StationDailyTotal {
  date: string;
  totalLitersDispensed: string;
  totalGrossAmount: string;
  completedTransactionCount: number;
  uniqueVehiclesServedCount: number;
}

export async function getStationTransactions(
  accessToken: string,
  params?: { from?: string; to?: string; plateNumber?: string },
) {
  const query = new URLSearchParams();
  if (params?.from) query.append("from", params.from);
  if (params?.to) query.append("to", params.to);
  if (params?.plateNumber) query.append("plateNumber", params.plateNumber);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return smRequest<StationTransaction[]>(`/station-manager/transactions${qs}`, accessToken, {
    method: "GET",
  });
}

export async function getStationDailyTotals(
  accessToken: string,
  params?: { from?: string; to?: string },
) {
  const query = new URLSearchParams();
  if (params?.from) query.append("from", params.from);
  if (params?.to) query.append("to", params.to);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return smRequest<StationDailyTotal[]>(`/station-manager/reports/daily-totals${qs}`, accessToken, {
    method: "GET",
  });
}

export async function getStationServiceActivity(
  accessToken: string,
  params?: { from?: string; to?: string },
) {
  const query = new URLSearchParams();
  if (params?.from) query.append("from", params.from);
  if (params?.to) query.append("to", params.to);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return smRequest<any[]>(`/station-manager/reports/service-activity${qs}`, accessToken, {
    method: "GET",
  });
}
