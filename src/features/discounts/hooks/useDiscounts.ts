import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DiscountSearch } from "../schemas/discount.schema";
import { discountKeys } from "./discount.keys";
import { discountService } from "../services/discount.service";

export function useDiscounts(filters: DiscountSearch = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: discountKeys.list(filters),
    queryFn: () => discountService.getDiscounts(filters),
    placeholderData: keepPreviousData
  })
}