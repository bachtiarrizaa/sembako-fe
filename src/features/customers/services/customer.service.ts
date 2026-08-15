import { ApiResponse, Pagination } from "@/types/api-response";
import { CustomerResponse } from "../types/customer";
import { apiClient } from "@/api/api-client";
import { buildListParams } from "@/utils/list-params";
import { CreateCustomerRequest, CustomerSearch, UpdateCustomerRequest, UpdateCustomerStatusRequest } from "../schemas/customer.schema";

export const customerService = {
  getCustomers: async (
    filters: CustomerSearch = { page: 1, limit: 10 }
  ): Promise<{ items: CustomerResponse[]; pagination?: Pagination }> => {
    const res = await apiClient.get<ApiResponse<CustomerResponse[]>>("/customers", {
      params: buildListParams({ page: 1, limit: 10 }, filters)
    })
    return {
      items: res.data.data,
      pagination: res.data.pagination
    }
  },

  create: async (
    payload: CreateCustomerRequest
  ): Promise<ApiResponse<CustomerResponse>> => {
    const res = await apiClient.post<ApiResponse<CustomerResponse>>("/customers", payload)
    return res.data
  },

  update: async (
    id: string,
    payload: UpdateCustomerRequest
  ): Promise<ApiResponse<CustomerResponse>> => {
    const res = await apiClient.put<ApiResponse<CustomerResponse>>(`/customers/${id}`, payload)
    return res.data
  },

  updateStatus: async (
    id: string,
    payload: UpdateCustomerStatusRequest
  ): Promise<ApiResponse<CustomerResponse>> => {
    const res = await apiClient.patch<ApiResponse<CustomerResponse>>(`/customers/${id}/status`, payload)
    return res.data
  },

  delete: async (
    id: string
  ): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/customers/${id}`)
    return res.data
  },
}