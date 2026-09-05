import { apiClient } from "@/api/api-client";
import type { ApiResponse } from "@/types/api-response";
import type { CashierDashboardData } from "../types/dashboard";

export const dashboardService = {
  getCashierDashboard: async (): Promise<CashierDashboardData> => {
    const res = await apiClient.get<ApiResponse<CashierDashboardData>>("/dashboard");
    return res.data.data;
  },
};
