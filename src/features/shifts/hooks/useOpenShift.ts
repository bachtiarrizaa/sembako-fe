import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";
import { OpenShiftPayload } from "../types/shift";
import { shiftKeys } from "./useActiveShift";
import { toast } from "@/components/ui/toast";
import { handleApiError } from "@/lib/error";
import { translateMessage } from "@/lib/translator";

export function useOpenShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OpenShiftPayload) => shiftService.openShift(payload),
    onSuccess: (res) => {
      toast.add({
        title: translateMessage(res?.message, "Toko & shift kasir berhasil dibuka"),
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: shiftKeys.all });
    },
    onError: (err) => {
      handleApiError(err, "Gagal membuka toko & shift baru");
    },
  });
}
