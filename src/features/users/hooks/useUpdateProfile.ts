import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { userService } from "../services/user.service"
import { userKeys } from "./user.keys"

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => {
      return userService.updateMe(formData)
    },
    onSuccess: (response) => {
      toast.add({ 
        title: translateMessage(response.message, "Profil berhasil diperbarui"), 
        type: "success" 
      })
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}
