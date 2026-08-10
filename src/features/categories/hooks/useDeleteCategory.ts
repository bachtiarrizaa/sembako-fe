import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { categoryService } from "../services/category.service"

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: categoryService.delete,
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Kategori berhasil dihapus"), type: "success" })
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (error) => handleApiError(error),
  })
}