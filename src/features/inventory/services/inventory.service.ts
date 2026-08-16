import { ApiResponse, Pagination } from "@/types/api-response"
import { apiClient } from "@/api/api-client"
import { buildListParams } from "@/utils/list-params"
import { StockSummary, StockMutation, OpnameSubmission } from "../types/inventory"
import {
  StockMutationSearch,
  OpnameSearch,
  CreateOpnameRequest,
  ApproveOpnameRequest,
} from "../schemas/inventory.schema"

export const inventoryService = {
  getStockSummary: async (productId: string): Promise<ApiResponse<StockSummary>> => {
    const res = await apiClient.get<ApiResponse<StockSummary>>(`/stocks/${productId}`)
    return res.data
  },

  getStockMutations: async (
    productId: string,
    filters: StockMutationSearch = { page: 1, limit: 10 }
  ): Promise<{ items: StockMutation[]; pagination?: Pagination }> => {
    const res = await apiClient.get<ApiResponse<StockMutation[]>>(`/stocks/${productId}/mutations`, {
      params: buildListParams({ page: 1, limit: 10 }, filters),
    })
    return {
      items: res.data.data,
      pagination: res.data.pagination,
    }
  },

  getOpnameSubmissions: async (
    filters: OpnameSearch = { page: 1, limit: 10 }
  ): Promise<{ items: OpnameSubmission[]; pagination?: Pagination }> => {
    const res = await apiClient.get<ApiResponse<OpnameSubmission[]>>("/stocks/opname", {
      params: buildListParams({ page: 1, limit: 10 }, filters),
    })
    return {
      items: res.data.data,
      pagination: res.data.pagination,
    }
  },

  createOpname: async (payload: CreateOpnameRequest): Promise<ApiResponse<OpnameSubmission>> => {
    const res = await apiClient.post<ApiResponse<OpnameSubmission>>("/stocks/opname", payload)
    return res.data
  },

  approveOpname: async (id: string, payload: ApproveOpnameRequest): Promise<ApiResponse<OpnameSubmission>> => {
    const res = await apiClient.post<ApiResponse<OpnameSubmission>>(`/stocks/opname/${id}/approve`, payload)
    return res.data
  },
}
