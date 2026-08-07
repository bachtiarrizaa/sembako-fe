import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { roleService } from "../services/role.service"
import { toast } from "@/components/ui/toast"

export function useDeleteRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: roleService.delete,
    onSuccess: (response) => {
      toast.add({ title: response.message, type: "success"})
      queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
    onError: (error) => handleApiError(error),
  })
}