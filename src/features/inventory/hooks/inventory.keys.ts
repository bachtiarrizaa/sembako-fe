import { StockMutationSearch, OpnameSearch } from "../schemas/inventory.schema"

export const inventoryKeys = {
  all: ["inventory"] as const,
  summaries: () => [...inventoryKeys.all, "summary"] as const,
  summary: (productId: string) => [...inventoryKeys.summaries(), productId] as const,
  mutationsAll: () => [...inventoryKeys.all, "mutations"] as const,
  mutations: (productId: string, filters: StockMutationSearch) =>
    [...inventoryKeys.mutationsAll(), productId, filters] as const,
  opnamesAll: () => [...inventoryKeys.all, "opnames"] as const,
  opnames: (filters: OpnameSearch) => [...inventoryKeys.opnamesAll(), filters] as const,
}
