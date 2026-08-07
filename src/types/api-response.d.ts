export interface Pagination {
  page: number
  limit: number
  totalData: number
  totalPages: number
  hasNext?: boolean
  hasPrev?: boolean
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination
}