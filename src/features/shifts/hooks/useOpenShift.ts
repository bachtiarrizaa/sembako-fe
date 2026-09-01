import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";
import { OpenShiftPayload } from "../types/shift";
import { shiftKeys } from "./useActiveShift";

export function useOpenShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OpenShiftPayload) => shiftService.openShift(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shiftKeys.active() });
    },
  });
}
