import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { VoidTransactionRequest } from "../schemas/transaction.schema"
import { transactionService } from "../services/transaction.service"
import { transactionKeys } from "./transaction.keys"

export function useVoidTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VoidTransactionRequest }) =>
      transactionService.voidTransaction(id, payload),
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Transaksi berhasil dibatalkan"),
        type: "success",
      })
      queryClient.invalidateQueries({ queryKey: transactionKeys.all })
      queryClient.invalidateQueries({ queryKey: ["shifts"] })
      queryClient.invalidateQueries({ queryKey: ["cashier-dashboard"] })
    },
    onError: (error) => handleApiError(error),
  })
}
