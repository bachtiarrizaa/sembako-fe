import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleApiError } from "@/lib/error"
import { toast } from "@/components/ui/toast"
import { translateMessage } from "@/lib/translator"
import { ApproveOpnameRequest } from "../schemas/inventory.schema"
import { OPNAME_STATUSES } from "../constants/inventory.constant"
import { inventoryService } from "../services/inventory.service"
import { inventoryKeys } from "./inventory.keys"

export function useApproveOpname() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApproveOpnameRequest }) =>
      inventoryService.approveOpname(id, payload),
    onSuccess: (response) => {
      const isApproved = response.data.status === OPNAME_STATUSES.APPROVED
      const statusText = isApproved ? "disetujui" : "ditolak"
      toast.add({
        title: translateMessage(
          response.message,
          `Pengajuan opname berhasil ${statusText}`
        ),
        type: "success",
      })
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: inventoryKeys.opnamesAll() })
      queryClient.invalidateQueries({ queryKey: inventoryKeys.summaries() })
      queryClient.invalidateQueries({ queryKey: inventoryKeys.mutationsAll() })
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
    onError: (error) => handleApiError(error),
  })
}
