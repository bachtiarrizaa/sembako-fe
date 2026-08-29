import { ApiResponse, Pagination } from "@/types/api-response";
import { TransactionSearch } from "../schemas/transaction.schema";
import { TransactionResponse } from "../types/transaction";
import { apiClient } from "@/api/api-client";
import { buildListParams } from "@/utils/list-params";

export const transactionService = {
  getTransactions: async (
    filters: TransactionSearch = { page: 1, limit: 10 }
  ): Promise<{ items: TransactionResponse[]; pagination?: Pagination}> => {
    const res = await apiClient.get<ApiResponse<TransactionResponse[]>>("/transactions", {
      params: buildListParams({ page: 1, limit: 10 }, filters)
    })
    return {
      items: res.data.data,
      pagination: res.data.pagination
    }
  },
}