import { useQuery } from "@tanstack/react-query"
import { productKeys } from "./product.keys"
import { productService } from "../services/product.service"

export function useProductDetails(id: string | null | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id || ""),
    queryFn: () => productService.getProduct(id || ""),
    enabled: Boolean(id),
  })
}
