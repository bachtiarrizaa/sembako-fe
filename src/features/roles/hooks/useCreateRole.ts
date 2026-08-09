import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { CreateRoleRequest } from "../schemas/role.schema"
import { roleService } from "../services/role.service"
import { toast } from "@/components/ui/toast"

import { translateMessage } from "@/lib/translator"

export function useCreateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateRoleRequest) => roleService.create(payload),
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Role berhasil ditambahkan"), type: "success"})
      queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
    onError: (error) => handleApiError(error),
  })
}