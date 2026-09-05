import { ShiftSearch } from "../schemas/shift.schema";

export const shiftKeys = {
  all: ["shifts"] as const,
  lists: () => [...shiftKeys.all, "list"] as const,
  list: (filters: ShiftSearch) => [...shiftKeys.lists(), filters] as const,
  active: () => [...shiftKeys.all, "active"] as const,
  details: () => [...shiftKeys.all, "detail"] as const,
  detail: (id: string) => [...shiftKeys.details(), id] as const,
};
