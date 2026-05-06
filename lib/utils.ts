import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Human-readable station label: always includes ID; adds name when known. */
export function formatStationWithId(
  stationId: number | null | undefined,
  stationName?: string | null,
): string {
  if (stationId == null || !Number.isFinite(stationId)) return "—";
  const name = stationName?.trim();
  if (name) return `${name} (ID ${stationId})`;
  return `ID ${stationId}`;
}
