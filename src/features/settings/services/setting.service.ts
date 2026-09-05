import { apiClient } from "@/api/api-client";
import { ApiResponse } from "@/types/api-response";
import { StoreSettingResponse } from "../types/setting";
import { StoreSettingFormValues } from "../schemas/setting.schema";

export const settingService = {
  getStoreSettings: async (): Promise<StoreSettingResponse> => {
    const res = await apiClient.get<ApiResponse<StoreSettingResponse>>("/settings");
    return res.data.data;
  },

  updateStoreSettings: async (
    payload: StoreSettingFormValues
  ): Promise<ApiResponse<StoreSettingResponse>> => {
    const res = await apiClient.put<ApiResponse<StoreSettingResponse>>("/settings", payload);
    return res.data;
  },
};
