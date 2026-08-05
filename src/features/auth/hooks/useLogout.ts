import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/src/stores/auth.store";
import { authService } from "@/src/features/auth/services/auth.service";
import { handleApiError } from "@/src/lib/error";
import { clearTokenRefresh } from "@/src/api/api-client";

export function useLogout() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearAuth);

  const logout = async () => {
    try {
      const response = await authService.logout();
      toast.success(response.message);
    } catch (error) {
      handleApiError(error, "Failed to log out on server. Proceeding to login.");
    } finally {
      clearTokenRefresh();
      clearSession();
      router.push("/login");
    }
  };

  return { logout };
}