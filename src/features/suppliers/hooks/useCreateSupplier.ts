import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"

import { translateMessage } from "@/lib/translator"
import { CreateSupplierRequest } from "../schemas/supplier.schema"
import { supplierService } from "../services/supplier.service"
import { supplierKeys } from "./supplier.keys"

export function useCreateSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateSupplierRequest) =>
      supplierService.create(payload),
    onSuccess: (response) => {
      toast.add({ title: translateMessage(response.message, "Supplier berhasil ditambahkan"), type: "success"})
      queryClient.invalidateQueries({ queryKey: supplierKeys.all })
    },
    onError: (error) => handleApiError(error),
  })
}