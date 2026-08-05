import { toast } from "sonner"
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
      toast.error(serverMessage);
      return;
    }
  }

  if (isNormalizedError(error)) {
    toast.error(error.message)
    return
  }

  if (error instanceof Error) {
    toast.error(error.message)
    return
  }

  toast.error(defaultMessage)
}