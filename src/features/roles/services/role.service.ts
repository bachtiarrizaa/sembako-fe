import { ApiResponse, Pagination } from "@/types/api-response";
import { Role, RoleResponse } from "../types/role";
import { apiClient } from "@/api/api-client";
import { RoleSearch } from "../schemas/role.schema";
import { buildListParams } from "@/lib/utils";

export const roleService = {
  getRoles: async (
      filters: RoleSearch = { page: 1, limit: 10 }
    ): Promise<{ items: Role[]; pagination?: Pagination }> => {
      const res = await apiClient.get<ApiResponse<RoleResponse[]>>("/roles", {
        params: buildListParams({ page: 1, limit: 10 }, filters),
      })
      return {
        items: res.data.data,
        pagination: res.data.pagination,
      }
    },
}