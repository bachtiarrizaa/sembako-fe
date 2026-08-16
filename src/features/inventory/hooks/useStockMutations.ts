import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { StockMutationSearch } from "../schemas/inventory.schema"
import { inventoryKeys } from "./inventory.keys"
import { inventoryService } from "../services/inventory.service"

export function useStockMutations(productId: string, filters: StockMutationSearch = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: inventoryKeys.mutations(productId, filters),
    queryFn: () => inventoryService.getStockMutations(productId, filters),
    placeholderData: keepPreviousData,
    enabled: Boolean(productId),
  })
}
