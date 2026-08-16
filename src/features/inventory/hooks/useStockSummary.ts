import { useQuery } from "@tanstack/react-query"
import { inventoryKeys } from "./inventory.keys"
import { inventoryService } from "../services/inventory.service"

export function useStockSummary(productId: string) {
  return useQuery({
    queryKey: inventoryKeys.summary(productId),
    queryFn: () => inventoryService.getStockSummary(productId),
    enabled: Boolean(productId),
  })
}
