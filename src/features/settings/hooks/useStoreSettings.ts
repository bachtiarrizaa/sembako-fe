import { useQuery } from "@tanstack/react-query";
import { settingService } from "../services/setting.service";
import { settingKeys } from "./setting.keys";

export function useStoreSettings() {
  return useQuery({
    queryKey: settingKeys.store(),
    queryFn: settingService.getStoreSettings,
  });
}
