import { ApiResponse, Pagination } from "@/types/api-response";
import { apiClient } from "@/api/api-client";
import { buildListParams } from "@/lib/utils";
import { CategorySearch, CreateCategoryRequest, UpdateCategoryRequest } from "../schemas/category.schema";
import { CategoryResponse } from "../types/category";

export const categoryService = {
  getCategories: async (
    filters: CategorySearch = { page: 1, limit: 10 }
  ): Promise<{ items: CategoryResponse[]; pagination?: Pagination }> => {
    const res = await apiClient.get<ApiResponse<CategoryResponse[]>>("/categories", {
      params: buildListParams({ page: 1, limit: 10 }, filters),
    })
    return {
      items: res.data.data,
      pagination: res.data.pagination,
    }
  },

  create: async (payload: CreateCategoryRequest): Promise<ApiResponse<CategoryResponse>> => {
    const res = await apiClient.post<ApiResponse<CategoryResponse>>("/categories", payload)
    return res.data
  },

  update: async (id: string, payload: UpdateCategoryRequest): Promise<ApiResponse<CategoryResponse>> => {
    const res = await apiClient.put<ApiResponse<CategoryResponse>>(`/categories/${id}`, payload)
    return res.data
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/categories/${id}`)
    return res.data
  },
}