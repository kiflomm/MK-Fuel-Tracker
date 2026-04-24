import type { UserRole } from "@/lib/auth/types";

export function getRoleHomePath(role: UserRole) {
  switch (role) {
    case "GOVERNMENT_ADMIN":
      return "/app/admin";
    case "STATION_MANAGER":
      return "/app/station-manager";
    case "STATION_WORKER":
      return "/app/station-worker";
    case "VEHICLE_OWNER":
      return "/app/owner";
    default:
      return "/app";
  }
}
