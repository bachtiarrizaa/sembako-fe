import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { UpdateSupplierStatusRequest } from "../schemas/supplier.schema"
import { supplierService } from "../services/supplier.service"
import { supplierKeys } from "./supplier.keys"

export function useUpdateSupplierStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSupplierStatusRequest }) =>
      supplierService.updateStatus(id, payload),
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Status supplier berhasil diubah"), type: "success" })
      queryClient.invalidateQueries({ queryKey: supplierKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}