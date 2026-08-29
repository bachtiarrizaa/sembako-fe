import { useQuery } from "@tanstack/react-query"
import { transactionKeys } from "./transaction.keys"
import { transactionService } from "../services/transaction.service"

export function useTransactionDetails(id?: string | null) {
  return useQuery({
    queryKey: transactionKeys.detail(id ?? ""),
    queryFn: () => transactionService.getTransactionById(id ?? ""),
    enabled: Boolean(id),
  })
}
