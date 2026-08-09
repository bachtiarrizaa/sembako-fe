import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"

import { translateMessage } from "@/lib/translator"
import { CreateUserRequest } from "../schemas/user.schema"
import { userService } from "../services/user.service"

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUserRequest) =>
      userService.create(payload),
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Pegawai berhasil ditambahkan"), type: "success"})
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (error) => handleApiError(error),
  })
}