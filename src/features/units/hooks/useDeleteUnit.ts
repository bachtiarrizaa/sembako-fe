import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unitService } from "../services/unit.service";
import { toast } from "@/components/ui/toast";
import { translateMessage } from "@/lib/translator";
import { unitKeys } from "./unit.keys";
import { handleApiError } from "@/lib/error";

export function useDeleteUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unitService.delete,
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Satuan berhasil dihapus"),
        type: "success"
      })
      queryClient.invalidateQueries({ queryKey: unitKeys.all })
    },
    onError: (error) => handleApiError(error)
  })
}