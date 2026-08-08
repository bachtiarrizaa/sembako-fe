"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useUserMe } from "@/features/users/hooks/useUserMe";
import { useAuthStore } from "@/stores/auth.store";

export default function CashierRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isError } = useUserMe();
  const session = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/cashier/login");
      return;
    }
    if (isLoading) return;
    if (isError || !user) {
      router.replace("/cashier/login");
      return;
    }
    if ((user.role?.name || "").toLowerCase() !== "cashier") {
      router.replace("/admin/dashboard");
    }
  }, [session, user, isLoading, isError, router]);

  if (!session || isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Spinner className="size-8 text-primary" />
        <span className="sr-only">Memuat...</span>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
