"use client";

import { AlertTriangle, Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatFullDate, formatTimeOnly } from "@/utils/format";
import { Spinner } from "@/components/ui/spinner";

interface CashierBannerProps {
  userName?: string;
  cashierName?: string;
  shiftOpen: boolean;
  isShiftLoading: boolean;
  now: Date | null;
  shiftId: string;
  openedAt: string;
  initialModal: number;
  onOpenShift: () => void;
  onCloseShift: () => void;
}

export function CashierBanner({
  userName,
  cashierName,
  shiftOpen,
  isShiftLoading,
  now,
  shiftId,
  openedAt,
  initialModal,
  onOpenShift,
  onCloseShift,
}: CashierBannerProps) {
  return (
    <Card className="border-slate-200 shadow-sm bg-slate-900 text-white rounded-2xl">
      <CardContent className="p-4 sm:p-6 space-y-3.5">
        {/* Header Banner: Date & Time (Left stacked) vs Status Toko Badge (Right) */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex flex-col font-mono">
            <span className="text-xs sm:text-sm font-semibold text-slate-200">
              {formatFullDate(now)}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              {formatTimeOnly(now)}
            </span>
          </div>

          {isShiftLoading ? (
            <Spinner data-icon="inline-start" className="size-4" />
          ) : shiftOpen ? (
            <button
              type="button"
              onClick={onCloseShift}
              title="Tutup toko & rekap shift"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide border transition-all cursor-pointer shrink-0 bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
            >
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TOKO BUKA</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide border shrink-0 bg-amber-500/20 text-amber-300 border-amber-500/40">
              <span className="size-2 rounded-full bg-amber-400" />
              <span>TOKO TUTUP</span>
            </div>
          )}
        </div>

        {/* Greeting Utama Kasir */}
        <div>
          {(() => {
            const hour = (now ?? new Date()).getHours();
            const greeting =
              hour >= 3 && hour < 11
                ? "Selamat Pagi"
                : hour >= 11 && hour < 15
                ? "Selamat Siang"
                : hour >= 15 && hour < 19
                ? "Selamat Sore"
                : "Selamat Malam";
            const displayName = userName || cashierName || "Kasir";
            return (
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white leading-snug">
                {greeting}, {displayName}!
              </h1>
            );
          })()}
        </div>

        {/* Operational Data Pills */}
        {isShiftLoading ? (
          <div className="pt-2.5 border-t border-slate-800 flex items-center gap-2.5 text-xs text-slate-400 font-mono">
            <div className="size-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
            <span>Memuat informasi shift kasir...</span>
          </div>
        ) : shiftOpen ? (
          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block">Shift ID</span>
              <span className="font-semibold text-slate-100">{shiftId}</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block">Waktu Buka Shift</span>
              <span className="font-semibold text-slate-100">{openedAt}</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block">Modal Kas Awal</span>
              <span className="font-semibold text-slate-100">
                {formatCurrency(initialModal)}
              </span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[10px] block">Printer Struk</span>
                <span className="font-semibold text-emerald-400">Terhubung</span>
              </div>
              <Printer className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        ) : (
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-300 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20 w-full sm:w-auto">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                Shift Kasir Belum Aktif. Buka toko dan isi modal kas awal sebelum memulai transaksi.
              </span>
            </div>
            <Button
              onClick={onOpenShift}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-9 px-4 text-xs rounded-xl shrink-0 cursor-pointer w-full sm:w-auto shadow-md shadow-primary/20"
            >
              Buka Toko Sekarang
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
