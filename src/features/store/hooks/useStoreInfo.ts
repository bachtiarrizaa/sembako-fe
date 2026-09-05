import { useQuery } from "@tanstack/react-query";
import { storeService } from "../services/store.service";

export function useStoreInfo() {
  return useQuery({
    queryKey: ["store-info"],
    queryFn: storeService.getStoreInfo,
    staleTime: 1000 * 60 * 15,
  });
}
