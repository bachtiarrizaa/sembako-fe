import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { UpdateDiscountStatusRequest } from "../schemas/discount.schema"
import { discountService } from "../services/discount.service"
import { discountKeys } from "./discount.keys"

export function useUpdateDiscountStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDiscountStatusRequest }) =>
      discountService.updateStatus(id, payload),
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Status diskon berhasil diubah"),
        type: "success"
      })
      queryClient.invalidateQueries({ queryKey: discountKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}
