import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { UpdateCustomerStatusRequest } from "../schemas/customer.schema"
import { customerService } from "../services/customer.service"
import { customerKeys } from "./customer.keys"

export function useUpdateCustomerStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCustomerStatusRequest }) =>
      customerService.updateStatus(id, payload),
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Status customer berhasil diubah"), type: "success" })
      queryClient.invalidateQueries({ queryKey: customerKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}