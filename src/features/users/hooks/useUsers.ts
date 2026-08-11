import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { UserSearch } from "../schemas/user.schema";
import { userService } from "../services/user.service";
import { userKeys } from "./user.keys";

export function useUsers(filters: UserSearch = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => userService.getUsers(filters),
    placeholderData: keepPreviousData,
  })
}