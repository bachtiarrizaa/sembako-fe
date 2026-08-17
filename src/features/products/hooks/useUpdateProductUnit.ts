import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { UpdateProductUnitRequest } from "../schemas/product.schema"
import { productService } from "../services/product.service"
import { productKeys } from "./product.keys"

export function useUpdateProductUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, unitId, payload }: { id: string; unitId: string; payload: UpdateProductUnitRequest }) =>
      productService.updateProductUnit(id, unitId, payload),
    onSuccess: (response, variables) => {
      toast.add({
        title: translateMessage(response.message, "Satuan unit produk berhasil diperbarui"),
        type: "success",
      })
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) })
    },
    onError: (error) => handleApiError(error),
  })
}
