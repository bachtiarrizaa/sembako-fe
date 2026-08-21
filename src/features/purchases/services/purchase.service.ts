import { ApiResponse, Pagination } from "@/types/api-response";
import { CreatePurchaseRequest, PurchaseSearch, UpdatePurchaseRequest } from "../schemas/purchase.schema";
import { Purchase, PurchaseDetail, PurchaseSummary } from "../types/purchase";
import { apiClient } from "@/api/api-client";
import { buildListParams } from "@/utils/list-params";

export const purchaseService = {
  getPurchases: async (
    filters: PurchaseSearch = { page: 1, limit: 10 }
  ): Promise<{ items: PurchaseSummary[]; pagination?: Pagination }> => {
    const res = await apiClient.get<ApiResponse<PurchaseSummary[]>>("/purchases", {
      params: buildListParams({ page: 1, limit: 10 }, filters)
    })
    return {
      items: res.data.data,
      pagination: res.data.pagination
    }
  },

  getById: async (
    id: string
  ): Promise<ApiResponse<PurchaseDetail>> => {
    const res = await apiClient.get<ApiResponse<PurchaseDetail>>(`/purchases/${id}`)
    return res.data
  },

  create: async (
    payload: CreatePurchaseRequest
  ): Promise<ApiResponse<PurchaseDetail>> => {
    const res = await apiClient.post<ApiResponse<PurchaseDetail>>("/purchases", payload)
    return res.data
  },

  updateItem: async (
    id: string,
    payload: UpdatePurchaseRequest
  ): Promise<ApiResponse<Purchase>> => {
    const res = await apiClient.put<ApiResponse<Purchase>>(`/purchases/items/${id}`, payload)
    return res.data
  },

  delete: async (
    id: string
  ): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/purchases/${id}`)
    return res.data
  },

  deleteItem: async (
    id: string
  ): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/purchases/items/${id}`)
    return res.data
  },
}