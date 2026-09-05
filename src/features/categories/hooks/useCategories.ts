import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CategorySearch } from "../schemas/category.schema";
import { categoryService } from "../services/category.service";

export function useCategories(filters: CategorySearch = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: ["categories", filters],
    queryFn: () => categoryService.getCategories(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10, // 10 menit cache
  })
}