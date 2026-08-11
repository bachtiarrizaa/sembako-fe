import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import { userKeys } from "./user.keys";

export function useUserMe() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => userService.getMe(),
    placeholderData: keepPreviousData
  })
}