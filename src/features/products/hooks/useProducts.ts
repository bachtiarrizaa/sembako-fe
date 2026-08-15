import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { ProductSearch } from "../schemas/product.schema"
import { productKeys } from "./product.keys"
import { productService } from "../services/product.service"

export function useProducts(filters: ProductSearch = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getProducts(filters),
    placeholderData: keepPreviousData,
  })
}
