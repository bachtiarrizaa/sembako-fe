import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { UpdateRoleRequest } from "../schemas/role.schema";
import { roleService } from "../services/role.service";
import { toast } from "@/components/ui/toast";

export function useUpdateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRoleRequest }) =>
      roleService.update(id, payload),
    onSuccess: (response) => {
      toast.add({ title: response.message, type: "success"})
      queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
    onError: (error) => handleApiError(error),
  })
}