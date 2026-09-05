"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { formatCurrency, formatTransactionDate } from "@/utils/format";
import { ShiftStatus, SHIFT_STATUS_LABELS } from "../constants/shift.constant";
import { useShiftDetail } from "../hooks/useShiftDetail";

interface ShiftDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shiftId?: string | null;
}

export function ShiftDetailDialog({ open, onOpenChange, shiftId }: ShiftDetailDialogProps) {
  const { data: detailResponse, isLoading, isError } = useShiftDetail(shiftId);
  const shift = detailResponse?.data;

  const isOpen = shift?.status === ShiftStatus.OPEN;
  const forceClosedBy =
    typeof shift?.forceClosedByUser === "object"
      ? shift.forceClosedByUser?.name
      : shift?.forceClosedByUser;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-2xl sm:rounded-xl transition-all max-h-[90vh] flex flex-col overflow-hidden">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4 shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            Detail Shift Kasir
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 no-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Spinner className="size-8 text-primary" />
              <span className="text-xs text-muted-foreground">
                Memuat detail shift...
              </span>
            </div>
          ) : isError || !shift ? (
            <div className="text-center py-12 text-sm text-destructive font-medium">
              Data shift tidak ditemukan atau gagal dimuat.
            </div>
          ) : (
            <>
              {/* Top Metadata Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                {/* Left Column */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-28 shrink-0 font-medium">
                      Nama Kasir
                    </span>
                    <span className="text-muted-foreground font-medium">:</span>
                    <span className="font-semibold text-foreground">
                      {shift.cashier?.name || "-"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-28 shrink-0 font-medium">
                      Status Shift
                    </span>
                    <span className="text-muted-foreground font-medium">:</span>
                    <span>
                      {isOpen ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          {SHIFT_STATUS_LABELS[ShiftStatus.OPEN]}
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-50 text-rose-700 border-rose-200">
                          {SHIFT_STATUS_LABELS[ShiftStatus.CLOSED]}
                        </Badge>
                      )}
                    </span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-28 shrink-0 font-medium">
                      Waktu Buka Toko
                    </span>
                    <span className="text-muted-foreground font-medium">:</span>
                    <span className="font-medium text-foreground">
                      {formatTransactionDate(shift.openedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-28 shrink-0 font-medium">
                      Waktu Tutup Toko
                    </span>
                    <span className="text-muted-foreground font-medium">:</span>
                    <span className="font-medium text-foreground">
                      {shift.closedAt ? formatTransactionDate(shift.closedAt) : "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Separator line */}
              <hr className="border-border" />

              {/* Ringkasan Kas Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-1">
                {/* Left Card: Saldo Kas */}
                <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-bold text-foreground">Informasi Saldo Kas</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Modal Kas Awal</span>
                      <span className="font-semibold text-foreground">
                        {formatCurrency(shift.openingBalance)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Kas Fisik Akhir</span>
                      <span className="font-semibold text-foreground">
                        {shift.closingBalance !== null ? formatCurrency(shift.closingBalance) : "-"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Saldo Kas Sistem</span>
                      <span className="font-semibold text-foreground">
                        {shift.systemBalance !== null ? formatCurrency(shift.systemBalance) : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Card: Selisih & Catatan */}
                <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-bold text-foreground">Kalkulasi Selisih Kas</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Selisih Kas</span>
                      <span
                        className={`font-bold ${
                          (shift.discrepancy ?? 0) !== 0 ? "text-rose-600" : "text-foreground"
                        }`}
                      >
                        {shift.discrepancy !== null ? formatCurrency(shift.discrepancy) : "-"}
                      </span>
                    </div>

                    {shift.discrepancyNote && (
                      <div className="pt-2 border-t border-border space-y-1">
                        <span className="text-muted-foreground block font-medium">Catatan Selisih:</span>
                        <p className="text-foreground font-normal leading-relaxed">
                          {shift.discrepancyNote}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Force Close Info (if force closed) */}
              {(shift.forceCloseReason || forceClosedBy) && (
                <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4 space-y-3 text-xs text-rose-950">
                  <div className="flex items-center justify-between border-b border-rose-200/80 pb-2">
                    <span className="font-bold text-rose-800">
                      Informasi Penutupan Paksa
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {forceClosedBy && (
                      <div className="flex items-center gap-2">
                        <span className="text-rose-700 w-28 shrink-0 font-medium">Dipaksa Oleh</span>
                        <span className="text-rose-700 font-medium">:</span>
                        <span className="font-semibold text-rose-900">{forceClosedBy}</span>
                      </div>
                    )}
                    {shift.forceCloseReason && (
                      <div className="flex items-start gap-2">
                        <span className="text-rose-700 w-28 shrink-0 font-medium">Alasan</span>
                        <span className="text-rose-700 font-medium">:</span>
                        <span className="font-medium text-rose-900 leading-relaxed">
                          {shift.forceCloseReason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="border-t border-border px-6 py-4 shrink-0">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer font-medium px-4 py-2"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
