import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { supplierService } from "../services/supplier.service"
import { supplierKeys } from "./supplier.keys"

export function useDeleteSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: supplierService.delete,
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Supplier berhasil dihapus"), type: "success" })
      queryClient.invalidateQueries({ queryKey: supplierKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}
