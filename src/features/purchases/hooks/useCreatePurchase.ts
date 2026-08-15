import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { CreatePurchaseRequest } from "../schemas/purchase.schema"
import { purchaseService } from "../services/purchase.service"
import { purchaseKeys } from "./purchase.keys"

export function useCreatePurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePurchaseRequest) =>
      purchaseService.create(payload),
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Pembelian berhasil dicatat"), type: "success"})
      queryClient.invalidateQueries({ queryKey: purchaseKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}
