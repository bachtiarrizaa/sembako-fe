import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { UnitSearch } from "../schemas/unit.schema";
import { unitService } from "../services/unit.service";
import { unitKeys } from "./unit.keys";

export function useUnits(filters: UnitSearch = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: unitKeys.list(filters),
    queryFn: () => unitService.getUnits(filters),
    placeholderData: keepPreviousData,
  })
}