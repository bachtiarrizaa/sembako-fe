import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"

import { translateMessage } from "@/lib/translator"
import { CreateCustomerRequest } from "../schemas/customer.schema"
import { customerService } from "../services/customer.service"
import { customerKeys } from "./customer.keys"
export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCustomerRequest) =>
      customerService.create(payload),
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Customer berhasil ditambahkan"), type: "success"})
      queryClient.invalidateQueries({ queryKey: customerKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}