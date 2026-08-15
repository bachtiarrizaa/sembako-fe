import { ApiResponse, Pagination } from "@/types/api-response";
import { CreatePurchaseRequest, PurchaseSearch, UpdatePurchaseRequest } from "../schemas/purchase.schema";
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

  getById: async (
    id: string
  ): Promise<ApiResponse<PurchaseResponse>> => {
    const res = await apiClient.get<ApiResponse<PurchaseResponse>>(`/purchases/${id}`)
    return res.data
  },

  create: async (
    payload: CreatePurchaseRequest
  ): Promise<ApiResponse<PurchaseResponse[]>> => {
    const res = await apiClient.post<ApiResponse<PurchaseResponse[]>>("/purchases", payload)
    return res.data
  },

  update: async (
    id: string,
    payload: UpdatePurchaseRequest
  ): Promise<ApiResponse<PurchaseResponse>> => {
    const res = await apiClient.put<ApiResponse<PurchaseResponse>>(`/purchases/${id}`, payload)
    return res.data
  },

  delete: async (
    id: string
  ): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/purchases/${id}`)
    return res.data
  },
}
