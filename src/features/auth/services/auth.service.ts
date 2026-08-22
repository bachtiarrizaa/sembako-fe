import { apiClient } from "@/api/api-client";
import { ForgotPasswordRequest, LoginRequest, ResetPasswordRequest } from "../schemas/auth.schema";
import { ApiResponse } from "@/types/api-response";
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

  forgotPassword: async (payload: ForgotPasswordRequest): Promise<ApiResponse<null>> => {
    const res = await apiClient.post<ApiResponse<null>>("/auth/forgot-password", payload);
    return res.data
  },

  resetPassword: async (payload: ResetPasswordRequest): Promise<ApiResponse<null>> => {
    const res = await apiClient.post<ApiResponse<null>>("/auth/reset-password", payload);
    return res.data
  }
};