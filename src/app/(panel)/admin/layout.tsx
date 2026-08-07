"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useUserMe } from "@/features/users/hooks/useUserMe";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isError } = useUserMe();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (isError || !user) {
      router.replace("/admin/login");
      return;
    }
    if ((user.role?.name || "").toLowerCase() !== "admin") {
      router.replace("/cashier/dashboard");
    }
  }, [user, isLoading, isError, router]);

  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Memuat...</p>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
