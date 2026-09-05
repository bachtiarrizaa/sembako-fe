"use client";

import { useLoyaltySettings } from "../hooks/useLoyaltySettings";
import { LoyaltySettingsForm } from "./LoyaltySettingsForm";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoyaltySettingsPage() {
  const { data: loyaltySetting, isLoading, isError, refetch } = useLoyaltySettings();

  return (
    <div className="space-y-5 w-full pb-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Pengaturan Poin
        </h1>
        <p className="text-sm text-muted-foreground">
          Kelola aturan perolehan, penukaran, serta masa kadaluarsa poin pelanggan member
        </p>
      </div>

      {/* State 1: Loading Skeleton */}
      {isLoading && (
        <div className="border border-border/80 rounded-2xl p-6 space-y-4 bg-white shadow-xs">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
          <div className="space-y-3 pt-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      )}

      {/* State 2: Error State */}
      {isError && (
        <div className="p-6 bg-destructive/10 border border-destructive/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-destructive">
          <div className="flex items-center gap-3">
            <AlertCircle className="size-6 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Gagal Memuat Pengaturan Poin</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Terjadi kesalahan saat mengambil data dari server. Silakan coba beberapa saat lagi.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer"
          >
            <RefreshCw className="size-4" />
            Coba Lagi
          </Button>
        </div>
      )}

      {/* State 3: Success State */}
      {!isLoading && !isError && loyaltySetting && (
        <LoyaltySettingsForm initialData={loyaltySetting} />
      )}
    </div>
  );
}
