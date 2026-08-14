import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { handleApiError } from "@/lib/error"
import { UpdateDiscountRequest } from "../schemas/discount.schema"
import { discountService } from "../services/discount.service"
import { discountKeys } from "./discount.keys"

export function useUpdateDiscount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      { id, payload }: { id: string; payload: UpdateDiscountRequest }
    ) => discountService.update(id, payload),
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Diskon berhasil diperbarui"),
        type: "success"
      })
      queryClient.invalidateQueries({ queryKey: discountKeys.all })
    },
    onError: (error) => handleApiError(error)
  })
}
