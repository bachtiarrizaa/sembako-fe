import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Permission } from "../features/auth/types/auth";
import { clearAccessToken } from "@/lib/token-storage";

const flattenPermissionNames = (permissions: Permission[]): string[] => {
  const names: string[] = [];
  const recurse = (list: Permission[]) => {
    for (const item of list) {
      names.push(item.name);
      if (item.children && item.children.length > 0) {
        recurse(item.children);
      }
    }
  };
  recurse(permissions);
  return names;
};

interface AuthState {
  user: User | null;
  permissions: Permission[] | null;
  permissionNames: string[];
  setAuth: (user: User | null, permissions: Permission[] | null) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      permissions: null,
      permissionNames: [],
      setAuth: (user, permissions) => {
        const permissionNames = permissions ? flattenPermissionNames(permissions) : [];
        set({ user, permissions, permissionNames });
      },
      setUser: (user) => set({ user }),
      clearAuth: () => {
        clearAccessToken();
        localStorage.removeItem("auth-storage");
        set({ user: null, permissions: null, permissionNames: [] });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);