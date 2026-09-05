import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";
import { CloseShiftPayload } from "../types/shift";
import { shiftKeys } from "./useActiveShift";
import { toast } from "@/components/ui/toast";
import { handleApiError } from "@/lib/error";
import { translateMessage } from "@/lib/translator";

export function useCloseShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shiftId, payload }: { shiftId: string; payload: CloseShiftPayload }) =>
      shiftService.closeShift(shiftId, payload),
    onSuccess: (res) => {
      toast.add({
        title: translateMessage(res?.message, "Toko & shift kasir berhasil ditutup"),
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: shiftKeys.all });
      queryClient.invalidateQueries({ queryKey: ["cashier-dashboard"] });
    },
    onError: (err) => {
      handleApiError(err, "Gagal menutup toko & shift");
    },
  });
}
