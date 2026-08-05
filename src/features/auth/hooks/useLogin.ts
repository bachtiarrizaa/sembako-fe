import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { JwtPayload } from "../types/auth";
import { LoginRequest } from "../schemas/auth.schema";
import { authService } from "../services/auth.service";
import { handleApiError } from "@/src/lib/error";
import { useAuthStore } from "@/src/stores/auth.store";
import { scheduleTokenRefresh } from "@/src/api/api-client";
import { setAccessToken } from "@/src/lib/token-storage";

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (response) => {
      const { accessToken, user } = response.data;

      setAccessToken(accessToken);
      scheduleTokenRefresh(accessToken);

      const payload = jwtDecode<JwtPayload>(accessToken);

      setSession({
        id: payload.user_id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: {
          id: user.role.id,
          name: user.role.name,
        },
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      const roleName = user.role.name.toLowerCase();
      if (roleName === "admin") {
        router.push("/admin");
      } else {
        router.push("/cashier");
      }

      toast.success(response.message);
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to sign in. Please check your credentials.");
    },
  });
}