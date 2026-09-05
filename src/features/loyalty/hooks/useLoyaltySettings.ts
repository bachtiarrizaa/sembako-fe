import { useQuery } from "@tanstack/react-query";
import { loyaltyService } from "../services/loyalty.service";
import { loyaltyKeys } from "./loyalty.keys";

export function useLoyaltySettings() {
  return useQuery({
    queryKey: loyaltyKeys.all,
    queryFn: () => loyaltyService.getSettings(),
    staleTime: 1000 * 60 * 10,
  });
}
