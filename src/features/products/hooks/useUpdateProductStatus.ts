import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { UpdateProductStatusRequest } from "../schemas/product.schema"
import { productService } from "../services/product.service"
import { productKeys } from "./product.keys"

export function useUpdateProductStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductStatusRequest }) =>
      productService.updateStatus(id, payload),
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Status produk berhasil diubah"),
        type: "success",
      })
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}
