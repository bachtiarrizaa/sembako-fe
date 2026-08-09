import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { userService } from "../services/user.service";

export function useUserMe() {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: () => userService.getMe(),
    placeholderData: keepPreviousData
  })
}