import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ShiftSearch } from "../schemas/shift.schema";
import { shiftKeys } from "./shift.keys";
import { shiftService } from "../services/shift.service";

export function useShifts(filters: ShiftSearch = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: shiftKeys.list(filters),
    queryFn: () => shiftService.getShifts(filters),
    placeholderData: keepPreviousData,
  });
}
