"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { CashierLayout } from "@/components/layouts/CashierLayout";
import { useUserMe } from "@/features/users/hooks/useUserMe";
import { useAuthStore } from "@/stores/auth.store";

export default function CashierRoute({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError } = useUserMe();
  const user = data?.data;
  
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
    const userRole = (user.role?.name || "").toLowerCase();
    if (userRole === "admin") {
      router.replace("/admin/dashboard");
    } else if (userRole !== "cashier") {
      router.replace("/cashier/login");
    }
  }, [session, user, isLoading, isError, router]);

  if (!session || isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50/80 backdrop-blur-xs">
        <Spinner className="size-6 text-primary" />
        <span className="sr-only">Memuat...</span>
      </div>
    );
  }

  return <CashierLayout>{children}</CashierLayout>;
}
