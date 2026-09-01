import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";
import { CloseShiftPayload } from "../types/shift";
import { shiftKeys } from "./useActiveShift";

export function useCloseShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shiftId, payload }: { shiftId: string; payload: CloseShiftPayload }) =>
      shiftService.closeShift(shiftId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shiftKeys.active() });
    },
  });
}
