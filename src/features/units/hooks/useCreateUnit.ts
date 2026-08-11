import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateUnitRequest } from "../schemas/unit.schema";
import { unitService } from "../services/unit.service";
import { toast } from "@/components/ui/toast";
import { translateMessage } from "@/lib/translator";
import { unitKeys } from "./unit.keys";
import { handleApiError } from "@/lib/error";

export function useCreateUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUnitRequest) => unitService.create(payload),
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Pegawai berhasil ditambahkan"),
        type: "success"
      })
      queryClient.invalidateQueries({ queryKey: unitKeys.all })
    },
    onError: (error) => handleApiError(error)
  })
}