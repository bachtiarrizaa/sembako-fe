import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { handleApiError } from "@/lib/error";
import { transactionService } from "../services/transaction.service";
import { transactionKeys } from "./transaction.keys";
import { CreateTransactionRequest } from "../schemas/transaction.schema";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransactionRequest) =>
      transactionService.createTransaction(payload),
    onSuccess: (response) => {
      toast.add({
        title: response.message || "Transaksi berhasil diproses!",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({ queryKey: ["cashier-dashboard"] });
    },
    onError: (error) => handleApiError(error),
  });
}
