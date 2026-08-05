import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { User } from "../features/auth/types/auth";

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
        Cookies.remove("accessToken");
        set({ user: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);