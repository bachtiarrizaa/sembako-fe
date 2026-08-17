import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { productService } from "../services/product.service"
import { productKeys } from "./product.keys"

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: (response, id) => {
      toast.add({
        title: translateMessage(response.message, "Produk berhasil dihapus"),
        type: "success",
      })
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      queryClient.removeQueries({ queryKey: productKeys.detail(id) })
    },
    onError: (error) => handleApiError(error),
  })
}
