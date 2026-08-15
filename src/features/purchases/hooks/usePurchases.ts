import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PurchaseSearch } from "../schemas/purchase.schema";
import { purchaseKeys } from "./purchase.keys";
import { purchaseService } from "../services/purchase.service";

export function usePurchases(filters: PurchaseSearch = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: purchaseKeys.list(filters),
    queryFn: () => purchaseService.getPurchases(filters),
    placeholderData: keepPreviousData
  })
}
