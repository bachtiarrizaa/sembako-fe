import { CustomerSearch } from "../schemas/customer.schema";

export const customerKeys = {
  all: ["customer"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (filters: CustomerSearch) => [...customerKeys.lists(), filters] as const
}