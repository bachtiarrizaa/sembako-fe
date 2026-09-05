import { apiClient } from "@/api/api-client";
import { ApiResponse } from "@/types/api-response";

export interface StoreInfoResponse {
  storeName: string;
}

export const storeService = {
  getStoreInfo: async (): Promise<StoreInfoResponse> => {
    const res = await apiClient.get<ApiResponse<StoreInfoResponse>>("/store-info");
    return res.data.data;
  },
};
