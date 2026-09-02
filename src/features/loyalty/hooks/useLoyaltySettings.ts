import { useQuery } from "@tanstack/react-query";
import { loyaltyService } from "../services/loyalty.service";

export function useLoyaltySettings() {
  return useQuery({
    queryKey: ["loyalty-settings"],
    queryFn: () => loyaltyService.getSettings(),
    staleTime: 1000 * 60 * 10, // 10 menit
  });
}
