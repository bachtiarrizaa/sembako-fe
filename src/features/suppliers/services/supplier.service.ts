import { ApiResponse, Pagination } from "@/types/api-response";
import { SupplierSearch } from "../schemas/supplier.schemas";
import { SupplierResponse } from "../types/supplier";
import { apiClient } from "@/api/api-client";
import { buildListParams } from "@/lib/utils";

export const supplierService = {
  getSuppliers: async (
    filters: SupplierSearch = { page: 1, limit: 10 }
  ): Promise<{ items: SupplierResponse[]; pagination?: Pagination }> => {
    const res = await apiClient.get<ApiResponse<SupplierResponse[]>>("/suppliers", {
      params: buildListParams({ page: 1, limit: 10 }, filters)
    })
    return {
      items: res.data.data,
      pagination: res.data.pagination
    }
  }
}