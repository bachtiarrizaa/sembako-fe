import { CreateDiscountRequest, DiscountSearch, UpdateDiscountRequest, UpdateDiscountStatusRequest } from "../schemas/discount.schema";
import { DiscountResponse } from "../types/discount";
import { apiClient } from "@/api/api-client";
import { ApiResponse, Pagination } from "@/types/api-response";
import { buildListParams } from "@/utils/list-params";

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
  },

  getDiscount: async (id: string): Promise<ApiResponse<DiscountResponse>> => {
    const res = await apiClient.get<ApiResponse<DiscountResponse>>(`/discounts/${id}`)
    return res.data
  },

  create: async (
    payload: CreateDiscountRequest
  ): Promise<ApiResponse<DiscountResponse>> => {
    const res = await apiClient.post<ApiResponse<DiscountResponse>>("/discounts", payload)
    return res.data
  },

  update: async (
    id: string,
    payload: UpdateDiscountRequest
  ): Promise<ApiResponse<DiscountResponse>> => {
    const res = await apiClient.put<ApiResponse<DiscountResponse>>(`/discounts/${id}`, payload)
    return res.data
  },

  updateStatus: async (
    id: string,
    payload: UpdateDiscountStatusRequest
  ): Promise<ApiResponse<DiscountResponse>> => {
    const res = await apiClient.patch<ApiResponse<DiscountResponse>>(`/discounts/${id}/status`, payload)
    return res.data
  },

  delete: async (
    id: string
  ): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/discounts/${id}`)
    return res.data
  },
}