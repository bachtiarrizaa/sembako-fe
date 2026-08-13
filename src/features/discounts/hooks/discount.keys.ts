import { DiscountSearch } from "../schemas/discount.schema";

export const discountKeys = {
  all: ["discounts"] as const,
  lists: () => [...discountKeys.all, "list"] as const,
  list: (filters: DiscountSearch) => [...discountKeys.lists(), filters] as const,
  details: () => [...discountKeys.all, "detail"] as const,
  detail: (id: string) => [...discountKeys.details(), id] as const,
};
