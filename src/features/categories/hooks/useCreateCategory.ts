import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"

import { translateMessage } from "@/lib/translator"
import { CreateCategoryRequest } from "../schemas/category.schema"
import { categoryService } from "../services/category.service"

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCategoryRequest) => categoryService.create(payload),
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Kategori berhasil ditambahkan"), type: "success"})
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (error) => handleApiError(error),
  })
}