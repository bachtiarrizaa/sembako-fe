import { apiClient } from "@/src/api/api-client";
import { LoginRequest } from "../schemas/auth.schema";
import { ApiResponse } from "@/src/types/api-response";
import { LoginResponse } from "../types/auth";

export const authService = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const res = await apiClient.post<ApiResponse<LoginResponse>>("/auth/login", credentials);
    return res.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const res = await apiClient.post<ApiResponse<null>>("/auth/logout");
    return res.data;
  },
};