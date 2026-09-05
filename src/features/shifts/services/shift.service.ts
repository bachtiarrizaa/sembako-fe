import { ApiResponse, Pagination } from "@/types/api-response";
import { apiClient } from "@/api/api-client";
import { buildListParams } from "@/utils/list-params";
import { ShiftData, OpenShiftPayload, CloseShiftPayload, ForceCloseShiftPayload } from "../types/shift";
import { ShiftSearch } from "../schemas/shift.schema";

export const shiftService = {
  getShifts: async (
    filters: ShiftSearch = { page: 1, limit: 10 }
  ): Promise<{ items: ShiftData[]; pagination?: Pagination }> => {
    const res = await apiClient.get<ApiResponse<ShiftData[]>>("/shifts", {
      params: buildListParams({ page: 1, limit: 10 }, filters),
    });
    return {
      items: res.data.data,
      pagination: res.data.pagination,
    };
  },

  getShiftDetail: async (shiftId: string): Promise<ApiResponse<ShiftData>> => {
    const res = await apiClient.get<ApiResponse<ShiftData>>(`/shifts/${shiftId}`);
    return res.data;
  },

  getActiveShift: async (): Promise<ShiftData | null> => {
    try {
      const res = await apiClient.get<ApiResponse<ShiftData>>("/shifts/active");
      if (res.data && res.data.success && res.data.data) {
        return res.data.data;
      }
      return null;
    } catch {
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

  forceCloseShift: async (shiftId: string, payload: ForceCloseShiftPayload): Promise<ApiResponse<ShiftData>> => {
    const res = await apiClient.post<ApiResponse<ShiftData>>(`/shifts/${shiftId}/force-close`, payload);
    return res.data;
  },
};
