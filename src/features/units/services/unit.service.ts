import { ApiResponse, Pagination } from "@/types/api-response";
import { UnitSearch } from "../schemas/unit.schema";
import { UnitResponse } from "../types/unit";
import { apiClient } from "@/api/api-client";
import { buildListParams } from "@/lib/utils";

export const unitService = {
  getUnits: async (
    filters: UnitSearch = { page: 1, limit: 10 }
  ): Promise<{ items: UnitResponse[]; pagination?: Pagination }> => {
    const res = await apiClient.get<ApiResponse<UnitResponse[]>>("/units", {
      params: buildListParams({ page: 1, limit: 10 }, filters)
    })
    return {
      items: res.data.data,
      pagination: res.data.pagination
    }
  }
}