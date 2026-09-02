"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/format";
import { useOpenShift } from "@/features/shifts/hooks/useOpenShift";

interface OpenShiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (initialModal: number) => void;
}

export function OpenShiftModal({ open, onOpenChange, onSuccess }: OpenShiftModalProps) {
  const [modalAmount, setModalAmount] = useState<number>(500000);
  const [notes, setNotes] = useState<string>("");

  const { mutate: openShift, isPending: isSubmitting } = useOpenShift();

  const quickAmounts = [200000, 300000, 500000, 1000000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openShift(
      { openingBalance: modalAmount },
      {
        onSuccess: () => {
          onSuccess(modalAmount);
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md sm:rounded-xl transition-all max-h-[90vh] flex flex-col overflow-hidden">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4 shrink-0 text-left">
          <DialogTitle className="text-lg font-bold text-slate-900">
            Buka Toko & Input Modal Kas
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="space-y-4 px-6 py-5 flex-1">
            {/* Description inside body */}
            <p className="text-xs text-slate-500 leading-relaxed">
              Toko belum dibuka. Silakan masukkan modal kas awal di laci untuk memulai sesi transaksi kasir.
            </p>

            {/* Modal Kas Awal Input */}
            <div className="space-y-2">
              <Label htmlFor="modal-amount" className="text-xs font-bold text-slate-700">
                Modal Kas Awal (Laci Uang)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  Rp
                </span>
                <Input
                  id="modal-amount"
                  type="number"
                  value={modalAmount || ""}
                  onChange={(e) => setModalAmount(Number(e.target.value))}
                  placeholder="500000"
                  className="pl-10 font-bold text-slate-800 text-base rounded-xl h-11 border-slate-200"
                  required
                  min={0}
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setModalAmount(amt)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all border cursor-pointer ${
                      modalAmount === amt
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {formatCurrency(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Catatan Shift */}
            <div className="space-y-1.5">
              <Label htmlFor="shift-notes" className="text-xs font-bold text-slate-700">
                Catatan Shift (Opsional)
              </Label>
              <Input
                id="shift-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Shift Pagi, Uang pecahan Rp 5rb ready"
                className="text-xs rounded-xl h-10 border-slate-200"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-border px-6 py-4 shrink-0">
            <Button
              type="submit"
              disabled={isSubmitting || modalAmount < 0}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11 shadow-sm cursor-pointer text-sm"
            >
              {isSubmitting ? (
                <span>Membuka Toko...</span>
              ) : (
                <span>Buka Toko & Mulai Transaksi</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
