import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { productService } from "../services/product.service"
import { productKeys } from "./product.keys"

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => productService.createProduct(formData),
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Produk berhasil ditambahkan"),
        type: "success",
      })
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}
