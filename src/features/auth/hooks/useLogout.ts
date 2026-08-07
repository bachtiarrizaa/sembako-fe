import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/features/auth/services/auth.service";
import { handleApiError } from "@/lib/error";
import { clearTokenRefresh } from "@/api/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: (response) => {
      toast.add({ title: response.message, type: "success" });
    },
    onError: (error) => {
      handleApiError(error, "Failed to log out on server. Proceeding to login.");
    },
    onSettled: () => {
      clearTokenRefresh();
      clearSession();
      queryClient.clear();
      router.push("/login");
    },
  });
}