import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { JwtPayload } from "../types/auth";
import { LoginRequest } from "../schemas/auth.schema";
import { authService } from "../services/auth.service";
import { handleApiError } from "@/src/lib/error";
import { useAuthStore } from "@/src/stores/auth.store";

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (response) => {
      const accessToken = response.accessToken;

      Cookies.set("accessToken", accessToken, { path: "/" });

      const payload = jwtDecode<JwtPayload>(accessToken);

      setSession({
        id: payload.user_id,
        name: response.user.name,
        email: response.user.email,
        username: response.user.username,
        role: {
          id: response.user.role.id,
          name: response.user.role.name,
        },
        isActive: response.user.isActive,
        createdAt: response.user.createdAt,
        updatedAt: response.user.updatedAt,
      });

      const roleName = response.user.role.name.toLowerCase();
      if (roleName === "admin") {
        router.push("/admin");
      } else {
        router.push("/cashier");
      }

      toast.success("Login successful!");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to sign in. Please check your credentials.");
    },
  });
}