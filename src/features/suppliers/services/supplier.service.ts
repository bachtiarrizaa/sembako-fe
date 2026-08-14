import { ApiResponse, Pagination } from "@/types/api-response";
import { CreateSupplierRequest, SupplierSearch, UpdateSupplierRequest, UpdateSupplierStatusRequest } from "../schemas/supplier.schema";
import { SupplierResponse } from "../types/supplier";
import { apiClient } from "@/api/api-client";
import { buildListParams } from "@/utils/list-params";

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
  },

  create: async (
    payload: CreateSupplierRequest
  ): Promise<ApiResponse<SupplierResponse>> => {
    const res = await apiClient.post<ApiResponse<SupplierResponse>>("/suppliers", payload)
    return res.data
  },

  update: async (
    id: string,
    payload: UpdateSupplierRequest
  ): Promise<ApiResponse<SupplierResponse>> => {
    const res = await apiClient.put<ApiResponse<SupplierResponse>>(`/suppliers/${id}`, payload)
    return res.data
  },

  updateStatus: async (
    id: string,
    payload: UpdateSupplierStatusRequest
  ): Promise<ApiResponse<SupplierResponse>> => {
    const res = await apiClient.patch<ApiResponse<SupplierResponse>>(`/suppliers/${id}/status`, payload)
    return res.data
  },  

  delete: async (
    id: string
  ): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/suppliers/${id}`)
    return res.data
  },
}