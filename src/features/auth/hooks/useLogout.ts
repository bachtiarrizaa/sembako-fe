import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/features/auth/services/auth.service";
import { handleApiError } from "@/lib/error";
import { clearTokenRefresh } from "@/api/api-client";

export function useLogout() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearAuth);

  const logout = async () => {
    try {
      const response = await authService.logout();
      toast.add({ title: response.message, type: "success" });
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