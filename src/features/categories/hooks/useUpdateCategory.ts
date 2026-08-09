import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast";
import { translateMessage } from "@/lib/translator";
import { UpdateCategoryRequest } from "../schemas/category.schema";
import { categoryService } from "../services/category.service";

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryRequest }) =>
      categoryService.update(id, payload),
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Kategori berhasil diubah"), type: "success" })
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (error) => handleApiError(error),
  })
}