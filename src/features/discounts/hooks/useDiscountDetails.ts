import { useQuery } from "@tanstack/react-query"
import { discountKeys } from "./discount.keys"
import { discountService } from "../services/discount.service"

export function useDiscountDetails(id?: string | null) {
  return useQuery({
    queryKey: discountKeys.detail(id ?? ""),
    queryFn: () => discountService.getDiscount(id ?? ""),
    enabled: Boolean(id),
  })
}
