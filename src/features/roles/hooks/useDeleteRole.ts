import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { roleService } from "../services/role.service"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"

export function useDeleteRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: roleService.delete,
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Role berhasil dihapus"), type: "success" })
      queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
    onError: (error) => handleApiError(error),
  })
}