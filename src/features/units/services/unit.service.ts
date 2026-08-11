import { ApiResponse, Pagination } from "@/types/api-response";
import { CreateUnitRequest, UnitSearch, UpdateUnitRequest } from "../schemas/unit.schema";
import { UnitResponse } from "../types/unit";
import { apiClient } from "@/api/api-client";
import { buildListParams } from "@/lib/utils";

export const unitService = {
  getUnits: async (
    filters: UnitSearch = { page: 1, limit: 10 }
  ): Promise<{ items: UnitResponse[]; pagination?: Pagination }> => {
    const res = await apiClient.get<ApiResponse<UnitResponse[]>>("/units", {
      params: buildListParams({ page: 1, limit: 10 }, filters)
    })
    return {
      items: res.data.data,
      pagination: res.data.pagination
    }
  },

  create: async (
    payload: CreateUnitRequest
  ): Promise<ApiResponse<UnitResponse>> => {
    const res = await apiClient.post<ApiResponse<UnitResponse>>("/units", payload)
    return res.data
  },

  update: async (
    id: string,
    payload: UpdateUnitRequest
  ): Promise<ApiResponse<UnitResponse>> => {
    const res = await apiClient.put<ApiResponse<UnitResponse>>(`/units/${id}`, payload)
    return res.data
  },

  delete: async (
    id: string
  ): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/units/${id}`)
    return res.data
  },
}