import { ApiResponse, Pagination } from "@/types/api-response";
import { PurchaseSearch } from "../schemas/purchase.schema";
import { PurchaseResponse } from "../types/purchase";
import { apiClient } from "@/api/api-client";
import { buildListParams } from "@/utils/list-params";

export const purchaseService = {
  getPurchases: async (
    filters: PurchaseSearch = { page: 1, limit: 10 }
  ): Promise<{ items: PurchaseResponse[]; pagination?: Pagination }> => {
    const res = await apiClient.get<ApiResponse<PurchaseResponse[]>>("/purchases", {
      params: buildListParams({ page: 1, limit: 10 }, filters)
    })
    return {
      items: res.data.data,
      pagination: res.data.pagination
    }
  },
}
