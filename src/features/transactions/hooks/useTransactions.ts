import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TransactionSearch } from "../schemas/transaction.schema";
import { transactionKeys } from "./transaction.keys";
import { transactionService } from "../services/transaction.service";

export function useTransactions(filters: TransactionSearch = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionService.getTransactions(filters),
    placeholderData: keepPreviousData
  })
}