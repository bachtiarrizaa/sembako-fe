import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CustomerSearch } from "../schemas/customer.schema";
import { customerKeys } from "./customer.keys";
import { customerService } from "../services/customer.service";

export function useCustomers(filters: CustomerSearch = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: () => customerService.getCustomers(filters),
    placeholderData: keepPreviousData
  })
}