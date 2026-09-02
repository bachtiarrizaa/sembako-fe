import { apiClient } from "@/api/api-client";
import { ApiResponse } from "@/types/api-response";

export interface LoyaltySettingsResponse {
  redemptionRate: number;
  minimumRedeem: number;
}

export const loyaltyService = {
  getSettings: async (): Promise<LoyaltySettingsResponse> => {
    const res = await apiClient.get<ApiResponse<LoyaltySettingsResponse>>("/loyalty-settings");
    return res.data.data;
  },
};
