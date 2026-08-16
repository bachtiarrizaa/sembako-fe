import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { CreateOpnameRequest } from "../schemas/inventory.schema"
import { inventoryService } from "../services/inventory.service"
import { inventoryKeys } from "./inventory.keys"

export function useCreateOpname() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateOpnameRequest) => inventoryService.createOpname(payload),
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Pengajuan opname berhasil disimpan"),
        type: "success",
      })
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: inventoryKeys.summaries() })
      queryClient.invalidateQueries({ queryKey: inventoryKeys.mutationsAll() })
      queryClient.invalidateQueries({ queryKey: inventoryKeys.opnamesAll() })
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
    onError: (error) => handleApiError(error),
  })
}
