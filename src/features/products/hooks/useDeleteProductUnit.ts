import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { productService } from "../services/product.service"
import { productKeys } from "./product.keys"

export function useDeleteProductUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, unitId }: { id: string; unitId: string }) =>
      productService.deleteProductUnit(id, unitId),
    onSuccess: (response, variables) => {
      toast.add({
        title: translateMessage(response.message, "Satuan unit produk berhasil dihapus"),
        type: "success",
      })
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) })
    },
    onError: (error) => handleApiError(error),
  })
}
