"use client";

import type { ApiEnvelope } from "@/lib/auth/types";
import type { RevenueGranularity, RevenueTimeseriesData } from "@/lib/api/admin";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export class StationWorkerApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "StationWorkerApiError";
  }
}

async function workerRequest<T>(
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
    throw new StationWorkerApiError(
      payload?.message ?? "Station worker request failed.",
      response.status,
    );
  }

  return payload;
}

export async function getWorkerRevenueTimeseries(
  accessToken: string,
  params: { from: string; to: string; granularity: RevenueGranularity },
) {
  const query = new URLSearchParams();
  query.append("from", params.from);
  query.append("to", params.to);
  query.append("granularity", params.granularity);
  return workerRequest<RevenueTimeseriesData>(
    `/queue/worker/revenue-timeseries?${query.toString()}`,
    accessToken,
    { method: "GET" },
  );
}
