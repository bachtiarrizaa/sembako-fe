import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { purchaseKeys } from "./purchase.keys"
import { purchaseService } from "../services/purchase.service"

export function usePurchaseDetail(id: string | null) {
  return useQuery({
    queryKey: purchaseKeys.detail(id ?? ""),
    queryFn: () => purchaseService.getById(id!),
    enabled: !!id,
    placeholderData: keepPreviousData,
  })
}