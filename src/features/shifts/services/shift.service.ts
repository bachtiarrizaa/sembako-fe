import { ApiResponse } from "@/types/api-response";
import { apiClient } from "@/api/api-client";
import { ShiftData, OpenShiftPayload, CloseShiftPayload } from "../types/shift";

export const shiftService = {
  getActiveShift: async (): Promise<ShiftData | null> => {
    try {
      const res = await apiClient.get<ApiResponse<ShiftData>>("/shifts/active");
      if (res.data && res.data.success && res.data.data) {
        return res.data.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  openShift: async (payload: OpenShiftPayload): Promise<ApiResponse<ShiftData>> => {
    const res = await apiClient.post<ApiResponse<ShiftData>>("/shifts/open", payload);
    return res.data;
  },

  closeShift: async (shiftId: string, payload: CloseShiftPayload): Promise<ApiResponse<ShiftData>> => {
    const res = await apiClient.post<ApiResponse<ShiftData>>(`/shifts/${shiftId}/close`, payload);
    return res.data;
  },
};
