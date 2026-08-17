import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { productService } from "../services/product.service"
import { productKeys } from "./product.keys"

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      productService.updateProduct(id, formData),
    onSuccess: (response, variables) => {
      toast.add({
        title: translateMessage(response.message, "Produk berhasil diperbarui"),
        type: "success",
      })
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) })
    },
    onError: (error) => handleApiError(error),
  })
}
