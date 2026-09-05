import { useQuery } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";
import { shiftKeys } from "./shift.keys";

export function useActiveShift() {
  return useQuery({
    queryKey: shiftKeys.active(),
    queryFn: () => shiftService.getActiveShift(),
    staleTime: 1000 * 60 * 5,
  });
}
