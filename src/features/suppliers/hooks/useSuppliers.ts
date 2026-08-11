import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SupplierSearch } from "../schemas/supplier.schemas";
import { supplierKeys } from "./supplier.keys";
import { supplierService } from "../services/supplier.service";

export function useSuppliers(filters: SupplierSearch = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: supplierKeys.list(filters),
    queryFn: () => supplierService.getSuppliers(filters),
    placeholderData: keepPreviousData
  })
}