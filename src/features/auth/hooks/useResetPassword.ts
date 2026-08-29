import { useMutation } from "@tanstack/react-query"
import { ResetPasswordRequest } from "../schemas/auth.schema"
import { authService } from "../services/auth.service"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { handleApiError } from "@/lib/error"
import { useRouter } from "next/navigation"

export function useResetPassword() {
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) => authService.resetPassword(payload),
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Kata sandi berhasil diubah. Silakan masuk."),
        type: "success",
      })
      const searchParams = new URLSearchParams(window.location.search)
      const portal = searchParams.get("portal")
      const loginPath = portal === "cashier" ? "/cashier/login" : "/admin/login"
      router.push(loginPath)
    },
    onError: (error) => {
      handleApiError(error, "Gagal mengubah kata sandi. Silakan coba lagi.")
    },
  })
}
