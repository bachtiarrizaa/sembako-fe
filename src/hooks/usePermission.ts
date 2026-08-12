import { useAuthStore } from "@/stores/auth.store";

export function usePermission() {
  const permissionNames = useAuthStore((state) => state.permissionNames);

  // Pengecekan presisi satu permission name
  const hasPermission = (permissionName: string): boolean => {
    return permissionNames.includes(permissionName);
  };

  // Pengecekan minimal salah satu permission terpenuhi (OR)
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((perm) => permissionNames.includes(perm));
  };

  // Pengecekan seluruh permission wajib terpenuhi (AND)
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((perm) => permissionNames.includes(perm));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissionNames,
  };
}
