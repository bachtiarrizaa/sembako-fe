import { apiClient } from "@/src/api/api-client";
import { LoginRequest } from "../schemas/auth.schema";
import { LoginResponse } from "../types/auth";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await apiClient.post<{
      success: boolean
      message: string
      data: LoginResponse
    }>("/auth/login", data)
    return res.data.data
  },

  logout: async () => {
    const res = await apiClient.post<{
      success: boolean
      message: string
    }>("/auth/logout")
    return res.data
  }
}