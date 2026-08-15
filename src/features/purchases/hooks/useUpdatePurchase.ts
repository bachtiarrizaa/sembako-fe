import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { UpdatePurchaseRequest } from "../schemas/purchase.schema"
import { purchaseService } from "../services/purchase.service"
import { purchaseKeys } from "./purchase.keys"

interface UpdateMutationParams {
  id: string
  payload: UpdatePurchaseRequest
}

export function useUpdatePurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateMutationParams) =>
      purchaseService.update(id, payload),
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Pembelian berhasil diperbarui"), type: "success"})
      queryClient.invalidateQueries({ queryKey: purchaseKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}
