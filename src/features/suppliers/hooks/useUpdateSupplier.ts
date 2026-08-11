import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { translateMessage } from "@/lib/translator";
import { handleApiError } from "@/lib/error";
import { UpdateSupplierRequest } from "../schemas/supplier.schema";
import { supplierService } from "../services/supplier.service";
import { supplierKeys } from "./supplier.keys";

export function useUpdateSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      { id, payload }: { id: string; payload: UpdateSupplierRequest }
    ) => supplierService.update(id, payload),
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Supplier berhasil diperbarui"),
        type: "success"
      })
      queryClient.invalidateQueries({ queryKey: supplierKeys.all })
    },
    onError: (error) => handleApiError(error)
  })
}