import { useQuery } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";
import { shiftKeys } from "./shift.keys";

export function useShiftDetail(shiftId?: string | null) {
  return useQuery({
    queryKey: shiftKeys.detail(shiftId ?? ""),
    queryFn: () => shiftService.getShiftDetail(shiftId!),
    enabled: !!shiftId,
  });
}
