import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { UpdateRoleRequest } from "../schemas/role.schema";
import { roleService } from "../services/role.service";
import { toast } from "@/components/ui/toast";
import { translateMessage } from "@/lib/translator";

export function useUpdateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRoleRequest }) =>
      roleService.update(id, payload),
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Role berhasil diubah"), type: "success" })
      queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
    onError: (error) => handleApiError(error),
  })
}