import { DiscountSearch } from "../schemas/discount.schema";
import { DiscountResponse } from "../types/discount";
import { apiClient } from "@/api/api-client";
import { ApiResponse, Pagination } from "@/types/api-response";
import { buildListParams } from "@/lib/utils";

export const discountService = {
  getDiscounts: async (
    filters: DiscountSearch = { page: 1, limit: 10 }
  ): Promise<{ items: DiscountResponse[]; pagination?: Pagination }> => {
    const res = await apiClient.get<ApiResponse<DiscountResponse[]>>("/discounts", {
      params: buildListParams({ page: 1, limit: 10 }, filters)
    })
    return {
      items: res.data.data,
      pagination: res.data.pagination
    }
  }
}