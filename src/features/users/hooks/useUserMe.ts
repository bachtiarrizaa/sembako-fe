import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user.service";

export function useUserMe() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["user", "me"],
    queryFn: () => userService.getMe().then((res) => res.data),
  });

  return { user: data, isLoading, isError, refetch };
}