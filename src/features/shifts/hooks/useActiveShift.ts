import { useQuery } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";

export const shiftKeys = {
  all: ["shifts"] as const,
  active: () => [...shiftKeys.all, "active"] as const,
};

export function useActiveShift() {
  return useQuery({
    queryKey: shiftKeys.active(),
    queryFn: () => shiftService.getActiveShift(),
    staleTime: 1000 * 60 * 5, // 5 minutes stale time (re-invalidated on open/close shift mutation)
  });
}
