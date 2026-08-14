import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { CreateDiscountRequest } from "../schemas/discount.schema"
import { discountService } from "../services/discount.service"
import { discountKeys } from "./discount.keys"

export function useCreateDiscount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateDiscountRequest) =>
      discountService.create(payload),
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Diskon berhasil ditambahkan"),
        type: "success"
      })
      queryClient.invalidateQueries({ queryKey: discountKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}
