import { ApiResponse, Pagination } from "@/types/api-response";
import { apiClient } from "@/api/api-client";
import { UserResponse } from "../types/user";
import { UserSearch } from "../schemas/user.schema";
import { buildListParams } from "@/lib/utils";

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
  }
}