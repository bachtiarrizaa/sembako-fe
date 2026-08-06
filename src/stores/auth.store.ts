import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../features/auth/types/auth";
import { clearAccessToken } from "@/lib/token-storage";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User | null) => set({ user }),
      clearAuth: () => {
        clearAccessToken();
        localStorage.removeItem("auth-storage");
        set({ user: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);