import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { purchaseService } from "../services/purchase.service"
import { purchaseKeys } from "./purchase.keys"

export function useDeletePurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: purchaseService.delete,
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Pembelian berhasil dihapus"), type: "success" })
      queryClient.invalidateQueries({ queryKey: purchaseKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}
