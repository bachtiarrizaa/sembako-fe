import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { customerService } from "../services/customer.service"
import { customerKeys } from "./customer.keys"

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: customerService.delete,
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Customer berhasil dihapus"), type: "success" })
      queryClient.invalidateQueries({ queryKey: customerKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}
