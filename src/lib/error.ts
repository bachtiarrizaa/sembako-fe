import { toast } from "@/components/ui/toast"
import { AxiosError } from "axios"
import { translateMessage } from "./translator"

interface NormalizedError {
  message: string
  status: number
}

function isNormalizedError(error: unknown): error is NormalizedError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "status" in error
  )
}

export function handleApiError(error: unknown, defaultMessage = "Terjadi kesalahan yang tidak terduga"): void {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as { message?: string } | undefined;
    const serverMessage = responseData?.message;
    
    if (serverMessage) {
      toast.add({ title: translateMessage(serverMessage), type: "error" });
      return;
    }
  }

  if (isNormalizedError(error)) {
    toast.add({ title: translateMessage(error.message), type: "error" })
    return
  }

  if (error instanceof Error) {
    toast.add({ title: translateMessage(error.message), type: "error" })
    return
  }

  toast.add({ title: translateMessage(defaultMessage, defaultMessage), type: "error" })
}