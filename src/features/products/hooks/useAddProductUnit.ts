import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { AddProductUnitRequest } from "../schemas/product.schema"
import { productService } from "../services/product.service"
import { productKeys } from "./product.keys"

export function useAddProductUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddProductUnitRequest }) =>
      productService.addProductUnit(id, payload),
    onSuccess: (response, variables) => {
      toast.add({
        title: translateMessage(response.message, "Satuan unit produk berhasil ditambahkan"),
        type: "success",
      })
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) })
    },
    onError: (error) => handleApiError(error),
  })
}
