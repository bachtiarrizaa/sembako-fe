import { useMutation } from "@tanstack/react-query"
import { ForgotPasswordRequest } from "../schemas/auth.schema"
import { authService } from "../services/auth.service"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { handleApiError } from "@/lib/error"

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) => authService.forgotPassword(payload),
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Tautan reset kata sandi telah dikirim ke email Anda"),
        type: "success",
      });
    },
    onError: (error) => {
      handleApiError(error, "Gagal mengirim tautan reset kata sandi. Silakan coba lagi.");
    }
  })
}