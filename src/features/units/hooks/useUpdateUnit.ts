import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUnitRequest } from "../schemas/unit.schema";
import { unitService } from "../services/unit.service";
import { toast } from "@/components/ui/toast";
import { translateMessage } from "@/lib/translator";
import { unitKeys } from "./unit.keys";
import { handleApiError } from "@/lib/error";

export function useUpdateUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      { id, payload }: { id: string; payload: UpdateUnitRequest }
    ) => unitService.update(id, payload),
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Satun berhasil di perbarui"),
        type: "success"
      })
      queryClient.invalidateQueries({ queryKey: unitKeys.all })
    },
    onError: (error) => handleApiError(error)
  })
}