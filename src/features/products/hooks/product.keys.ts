import { ProductSearch } from "../schemas/product.schema"

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductSearch) => [...productKeys.lists(), filters] as const,
}
