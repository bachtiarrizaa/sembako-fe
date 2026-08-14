import { ApiResponse, Pagination } from "@/types/api-response";
import { Role, RoleResponse } from "../types/role";
import { apiClient } from "@/api/api-client";
import { CreateRoleRequest, RoleSearch, UpdateRoleRequest } from "../schemas/role.schema";
import { buildListParams } from "@/utils/list-params";

export const roleService = {
  getRoles: async (
    filters: RoleSearch = { page: 1, limit: 10 }
  ): Promise<{ items: Role[]; pagination?: Pagination }> => {
    const res = await apiClient.get<ApiResponse<RoleResponse[]>>("/roles", {
      params: buildListParams({ page: 1, limit: 10 }, filters),
    })
    return {
      items: res.data.data,
      pagination: res.data.pagination,
    }
  },

  create: async (payload: CreateRoleRequest): Promise<ApiResponse<RoleResponse>> => {
    const res = await apiClient.post<ApiResponse<RoleResponse>>("/roles", payload)
    return res.data
  },

  update: async (id: string, payload: UpdateRoleRequest): Promise<ApiResponse<RoleResponse>> => {
    const res = await apiClient.put<ApiResponse<RoleResponse>>(`/roles/${id}`, payload)
    return res.data
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/roles/${id}`)
    return res.data
  },
}