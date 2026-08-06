import { toast } from "@/components/ui/toast"
import { AxiosError } from "axios"

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

export function handleApiError(error: unknown, defaultMessage = "An unexpected error occurred"): void {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as { message?: string } | undefined;
    const serverMessage = responseData?.message;
    
    if (serverMessage) {
      toast.add({ title: serverMessage, type: "error" });
      return;
    }
  }

  if (isNormalizedError(error)) {
    toast.add({ title: error.message, type: "error" })
    return
  }

  if (error instanceof Error) {
    toast.add({ title: error.message, type: "error" })
    return
  }

  toast.add({ title: defaultMessage, type: "error" })
}