import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";
import { ForceCloseShiftPayload } from "../types/shift";
import { shiftKeys } from "./shift.keys";
import { toast } from "@/components/ui/toast";
import { handleApiError } from "@/lib/error";
import { translateMessage } from "@/lib/translator";

export function useForceCloseShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shiftId, payload }: { shiftId: string; payload: ForceCloseShiftPayload }) =>
      shiftService.forceCloseShift(shiftId, payload),
    onSuccess: (res) => {
      toast.add({
        title: translateMessage(res?.message, "Shift kasir berhasil ditutup paksa oleh admin"),
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: shiftKeys.all });
      queryClient.invalidateQueries({ queryKey: ["cashier-dashboard"] });
    },
    onError: (err) => {
      handleApiError(err, "Gagal menutup paksa shift kasir");
    },
  });
}
