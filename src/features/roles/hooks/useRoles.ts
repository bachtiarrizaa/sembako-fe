import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { RoleSearch } from "../schemas/role.schema"
import { roleService } from "../services/role.service"

export function useRoles(filters: RoleSearch = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: ["roles", filters],
    queryFn: () => roleService.getRoles(filters),
    placeholderData: keepPreviousData,
  })
}