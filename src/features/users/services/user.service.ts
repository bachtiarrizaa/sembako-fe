import { ApiResponse } from "@/types/api-response";
import { apiClient } from "@/api/api-client";
import { UserResponse } from "../types/user";

export const userService = {
  getMe: async (): Promise<ApiResponse<UserResponse>> => {
    const res = await apiClient.get<ApiResponse<UserResponse>>("/users/me");
    return res.data
  }
}