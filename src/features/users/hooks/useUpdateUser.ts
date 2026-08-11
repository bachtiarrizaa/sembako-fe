import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast";
import { translateMessage } from "@/lib/translator";
import { UpdateUserRequest, UserFormValues } from "../schemas/user.schema";
import { userService } from "../services/user.service";
import { userKeys } from "./user.keys";

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserFormValues }) => {
      const updatePayload: UpdateUserRequest = {
        name: payload.name,
        email: payload.email,
        username: payload.username,
        roleId: payload.roleId,
      }
      return userService.update(id, updatePayload)
    },
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Pegawai berhasil diubah"), type: "success" })
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}