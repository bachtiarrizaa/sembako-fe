"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useUserMe } from "@/features/users/hooks/useUserMe";
import { useAuthStore } from "@/stores/auth.store";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isFetching, isError } = useUserMe();
  const session = useAuthStore((state) => state.user);
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (isLoading || isFetching) return;

    if (isError || !user) {
      router.replace("/admin/login");
      return;
    }

    if ((user.role?.name || "").toLowerCase() !== "admin") {
      router.replace("/cashier/dashboard");
    }
  }, [isMounted, session, user, isLoading, isFetching, isError, router]);

  if (!isMounted || isLoading || isFetching || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-background/20 backdrop-blur-xs">
        <Spinner className="size-6 text-primary" />
        <span className="sr-only">Memuat...</span>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}