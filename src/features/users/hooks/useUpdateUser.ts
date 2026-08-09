import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast";
import { translateMessage } from "@/lib/translator";
import { UpdateUserRequest, UserFormValues } from "../schemas/user.schema";
import { userService } from "../services/user.service";

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserFormValues }) => {
      const { password, ...updatePayload } = payload
      return userService.update(id, updatePayload as UpdateUserRequest)
    },
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "User berhasil diubah"), type: "success" })
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (error) => handleApiError(error),
  })
}