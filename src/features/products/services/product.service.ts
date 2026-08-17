import { ApiResponse, Pagination } from "@/types/api-response"
import { apiClient } from "@/api/api-client"
import { buildListParams } from "@/utils/list-params"
import {
  ProductSearch,
  UpdateProductStatusRequest,
  AddProductUnitRequest,
  UpdateProductUnitRequest,
} from "../schemas/product.schema"
import { ProductResponse, ProductUnit } from "../types/product"

export const productService = {
  getProducts: async (
    filters: ProductSearch = { page: 1, limit: 10 }
  ): Promise<{ items: ProductResponse[]; pagination?: Pagination }> => {
    const res = await apiClient.get<ApiResponse<ProductResponse[]>>("/products", {
      params: buildListParams({ page: 1, limit: 10 }, filters),
    })
    return {
      items: res.data.data,
      pagination: res.data.pagination,
    }
  },

  getProduct: async (id: string): Promise<ApiResponse<ProductResponse>> => {
    const res = await apiClient.get<ApiResponse<ProductResponse>>(`/products/${id}`)
    return res.data
  },

  createProduct: async (formData: FormData): Promise<ApiResponse<ProductResponse>> => {
    const res = await apiClient.post<ApiResponse<ProductResponse>>("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return res.data
  },

  updateProduct: async (id: string, formData: FormData): Promise<ApiResponse<ProductResponse>> => {
    const res = await apiClient.put<ApiResponse<ProductResponse>>(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return res.data
  },

  updateStatus: async (
    id: string,
    payload: UpdateProductStatusRequest
  ): Promise<ApiResponse<ProductResponse>> => {
    const res = await apiClient.patch<ApiResponse<ProductResponse>>(`/products/${id}/status`, payload)
    return res.data
  },

  deleteProduct: async (id: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/products/${id}`)
    return res.data
  },

  // Product Units Management
  addProductUnit: async (id: string, payload: AddProductUnitRequest): Promise<ApiResponse<ProductUnit>> => {
    const res = await apiClient.post<ApiResponse<ProductUnit>>(`/products/${id}/units`, payload)
    return res.data
  },

  updateProductUnit: async (
    id: string,
    unitId: string,
    payload: UpdateProductUnitRequest
  ): Promise<ApiResponse<ProductUnit>> => {
    const res = await apiClient.put<ApiResponse<ProductUnit>>(`/products/${id}/units/${unitId}`, payload)
    return res.data
  },

  toggleProductUnitStatus: async (id: string, unitId: string): Promise<ApiResponse<ProductUnit>> => {
    const res = await apiClient.patch<ApiResponse<ProductUnit>>(`/products/${id}/units/${unitId}/status`)
    return res.data
  },

  deleteProductUnit: async (id: string, unitId: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/products/${id}/units/${unitId}`)
    return res.data
  },
}
