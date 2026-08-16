import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { OpnameSearch } from "../schemas/inventory.schema"
import { inventoryKeys } from "./inventory.keys"
import { inventoryService } from "../services/inventory.service"

export function useOpnameSubmissions(filters: OpnameSearch = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: inventoryKeys.opnames(filters),
    queryFn: () => inventoryService.getOpnameSubmissions(filters),
    placeholderData: keepPreviousData,
  })
}
