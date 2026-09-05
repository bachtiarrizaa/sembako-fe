import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { translateMessage } from "@/lib/translator";
import { handleApiError } from "@/lib/error";
import { LoyaltySettingFormValues } from "../schemas/loyalty.schema";
import { loyaltyService } from "../services/loyalty.service";
import { loyaltyKeys } from "./loyalty.keys";

export function useUpdateLoyaltySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoyaltySettingFormValues) =>
      loyaltyService.updateSettings(payload),
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Pengaturan poin berhasil diperbarui"),
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: loyaltyKeys.all });
    },
    onError: (error) => handleApiError(error),
  });
}
