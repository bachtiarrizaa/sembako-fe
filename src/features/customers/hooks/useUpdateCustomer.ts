import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { translateMessage } from "@/lib/translator";
import { handleApiError } from "@/lib/error";
import { UpdateCustomerRequest } from "../schemas/customer.schema";
import { customerService } from "../services/customer.service";
import { customerKeys } from "./customer.keys";

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      { id, payload }: { id: string; payload: UpdateCustomerRequest }
    ) => customerService.update(id, payload),
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Customer berhasil diperbarui"),
        type: "success"
      })
      queryClient.invalidateQueries({ queryKey: customerKeys.all })
    },
    onError: (error) => handleApiError(error)
  })
}