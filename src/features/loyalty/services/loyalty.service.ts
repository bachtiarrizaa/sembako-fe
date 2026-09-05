import { apiClient } from "@/api/api-client";
import { ApiResponse } from "@/types/api-response";
import { LoyaltySettingResponse } from "../types/loyalty";
import { LoyaltySettingFormValues } from "../schemas/loyalty.schema";

export const loyaltyService = {
  getSettings: async (): Promise<LoyaltySettingResponse> => {
    const res = await apiClient.get<ApiResponse<LoyaltySettingResponse>>("/loyalty-settings");
    return res.data.data;
  },

  updateSettings: async (
    payload: LoyaltySettingFormValues
  ): Promise<ApiResponse<LoyaltySettingResponse>> => {
    const res = await apiClient.put<ApiResponse<LoyaltySettingResponse>>("/loyalty-settings", payload);
    return res.data;
  },
};
