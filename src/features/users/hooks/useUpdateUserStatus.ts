import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { UpdateUserStatusRequest } from "../schemas/user.schema"
import { userService } from "../services/user.service"
import { userKeys } from "./user.keys"

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserStatusRequest }) =>
      userService.updateStatus(id, payload),
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Status pegawai berhasil diubah"), type: "success" })
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}