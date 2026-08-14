import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { discountService } from "../services/discount.service"
import { discountKeys } from "./discount.keys"

export function useDeleteDiscount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: discountService.delete,
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Diskon berhasil dihapus"),
        type: "success"
      })
      queryClient.invalidateQueries({ queryKey: discountKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}
