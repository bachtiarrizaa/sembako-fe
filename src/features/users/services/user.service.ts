import { ApiResponse, Pagination } from "@/types/api-response";
import { apiClient } from "@/api/api-client";
import { UserResponse } from "../types/user";
import { CreateUserRequest, UpdateUserRequest, UpdateUserStatusRequest, UserSearch } from "../schemas/user.schema";
import { buildListParams } from "@/utils/list-params";

export const userService = {
  getMe: async (): Promise<ApiResponse<UserResponse>> => {
    const res = await apiClient.get<ApiResponse<UserResponse>>("/users/me");
    return res.data
  },

  getUsers: async (
    filters: UserSearch = { page: 1, limit: 10 }
  ): Promise<{ items: UserResponse[]; pagination?: Pagination }> => {
    const res = await apiClient.get<ApiResponse<UserResponse[]>>("/users", {
      params: buildListParams({ page: 1, limit: 10 }, filters),
    })
    return {
      items: res.data.data,
      pagination: res.data.pagination,
    }
  },

  create: async (payload: CreateUserRequest): Promise<ApiResponse<UserResponse>> => {
    const res = await apiClient.post<ApiResponse<UserResponse>>("/users", payload)
    return res.data
  },

  update: async (id: string, payload: UpdateUserRequest): Promise<ApiResponse<UserResponse>> => {
    const res = await apiClient.put<ApiResponse<UserResponse>>(`/users/${id}`, payload)
    return res.data
  },

  updateStatus: async (id: string, payload: UpdateUserStatusRequest): Promise<ApiResponse<UserResponse>> => {
    const res = await apiClient.patch<ApiResponse<UserResponse>>(`/users/${id}/status`, payload)
    return res.data
  },  

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/users/${id}`)
    return res.data
  },
}