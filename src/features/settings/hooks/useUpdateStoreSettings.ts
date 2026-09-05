import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { translateMessage } from "@/lib/translator";
import { handleApiError } from "@/lib/error";
import { StoreSettingFormValues } from "../schemas/setting.schema";
import { settingService } from "../services/setting.service";
import { settingKeys } from "./setting.keys";

export function useUpdateStoreSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StoreSettingFormValues) =>
      settingService.updateStoreSettings(payload),
    onSuccess: (response) => {
      toast.add({
        title: translateMessage(response.message, "Pengaturan toko berhasil diperbarui"),
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: settingKeys.all });
      queryClient.invalidateQueries({ queryKey: ["store-info"] });
    },
    onError: (error) => handleApiError(error),
  });
}
