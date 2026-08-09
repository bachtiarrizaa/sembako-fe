import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { UserSearch } from "../schemas/user.schema";
import { userService } from "../services/user.service";

export function useUsers(filters: UserSearch = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers(filters),
    placeholderData: keepPreviousData,
  })
}