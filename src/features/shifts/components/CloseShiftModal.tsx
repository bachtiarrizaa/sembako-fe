"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShiftData } from "../types/shift";
import { useCloseShift } from "../hooks/useCloseShift";
import { Spinner } from "@/components/ui/spinner";
import { formatCurrency } from "@/utils/format";

interface CloseShiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shiftData: ShiftData | null;
  onSuccess?: () => void;
}

export function CloseShiftModal({
  open,
  onOpenChange,
  shiftData,
  onSuccess,
}: CloseShiftModalProps) {
  const [closingBalance, setClosingBalance] = useState<number>(0);
  const [discrepancyNote, setDiscrepancyNote] = useState<string>("");

  const { mutate: closeShift, isPending } = useCloseShift();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftData?.id) return;

    closeShift(
      {
        shiftId: shiftData.id,
        payload: {
          closingBalance,
          discrepancyNote: discrepancyNote.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md rounded-2xl overflow-hidden">
        <DialogHeader className="border-b border-border px-6 py-4 text-left">
          <DialogTitle className="text-lg font-bold text-slate-900">
            Tutup Toko & Rekap Kas
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-5">
            <p className="text-xs text-slate-500 leading-relaxed">
              Hitung total fisik uang kas di laci dan masukkan untuk mengakhiri shift operasional kasir.
            </p>

            {/* Shift Details Summary Box */}
            {shiftData && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Modal Kas Awal</span>
                  <span className="font-bold text-slate-800">
                    {formatCurrency(shiftData.openingBalance)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Nama Kasir</span>
                  <span className="font-semibold text-slate-800">
                    {shiftData.cashier?.name || "Kasir"}
                  </span>
                </div>
              </div>
            )}

            {/* Closing Balance Input */}
            <div className="space-y-2">
              <Label htmlFor="closing-balance" className="text-xs font-bold text-slate-700">
                Total Fisik Uang Kas Akhir di Laci
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  Rp
                </span>
                <Input
                  id="closing-balance"
                  type="number"
                  value={closingBalance || ""}
                  onChange={(e) => setClosingBalance(Number(e.target.value))}
                  placeholder="1400000"
                  className="pl-10 font-bold text-slate-900 text-base rounded-xl h-11 border-slate-200"
                  required
                  min={0}
                />
              </div>
            </div>

            {/* Discrepancy Note Input */}
            <div className="space-y-1.5">
              <Label htmlFor="discrepancy-note" className="text-xs font-bold text-slate-700">
                Catatan Selisih Uang Kas (Opsional)
              </Label>
              <Textarea
                id="discrepancy-note"
                value={discrepancyNote}
                onChange={(e) => setDiscrepancyNote(e.target.value)}
                placeholder="Contoh: Ada selisih Rp 5.000 karena tercecer pecahan receh kembalian"
                className="text-xs rounded-xl border-slate-200 resize-none h-20"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-border px-6 py-4">
            <Button
              type="submit"
              disabled={isPending || closingBalance < 0}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11 shadow-sm cursor-pointer text-sm"
            >
              {isPending ? (
                <Spinner data-icon="inline-start" className="size-4" />
              ) : (
                <span>Tutup Toko & Rekap Shift</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
