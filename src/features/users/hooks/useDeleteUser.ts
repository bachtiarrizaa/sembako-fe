import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { userService } from "../services/user.service"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.delete,
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Pegawai berhasil dihapus"), type: "success" })
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (error) => handleApiError(error),
  })
}
