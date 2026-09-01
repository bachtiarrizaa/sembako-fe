"use client";

import { useState } from "react";
import { CreditCard, QrCode, Banknote, Landmark, CheckCircle2, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PosPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalAmount: number;
  customerName?: string;
  onPaymentSuccess: (method: string, paidAmount: number, change: number) => void;
}

export function PosPaymentModal({
  open,
  onOpenChange,
  totalAmount,
  customerName,
  onPaymentSuccess,
}: PosPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"tunai" | "transfer" | "qris">("tunai");
  const [cashPaid, setCashPaid] = useState<number>(totalAmount);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const quickPresets = [10000, 20000, 50000, 100000, 200000, 500000].filter(
    (v) => v >= totalAmount
  );

  const changeDue = Math.max(0, cashPaid - totalAmount);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const methodLabel =
        paymentMethod === "tunai"
          ? "Tunai"
          : paymentMethod === "transfer"
          ? "Transfer Bank"
          : "QRIS";

      onPaymentSuccess(
        methodLabel,
        paymentMethod === "tunai" ? cashPaid : totalAmount,
        paymentMethod === "tunai" ? changeDue : 0
      );
      onOpenChange(false);
    }, 500);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold text-slate-900">
            Pembayaran Checkout
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {customerName ? `Pelanggan: ${customerName}` : "Pelanggan Umum"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Total Tagihan Banner */}
          <div className="p-4 bg-teal-50/60 border border-teal-100 text-slate-900 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Total Tagihan</span>
              <span className="text-2xl font-bold text-primary">
                {formatRupiah(totalAmount)}
              </span>
            </div>
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <Banknote className="w-6 h-6" />
            </div>
          </div>

          {/* Payment Method Selector: 3 Options */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setPaymentMethod("tunai");
                setCashPaid(totalAmount);
              }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-xs transition-all cursor-pointer ${
                paymentMethod === "tunai"
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Banknote className="w-4 h-4" />
              <span>Tunai</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("transfer")}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-xs transition-all cursor-pointer ${
                paymentMethod === "transfer"
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>Transfer</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("qris")}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-xs transition-all cursor-pointer ${
                paymentMethod === "qris"
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>QRIS</span>
            </button>
          </div>

          {/* Mode 1: Tunai */}
          {paymentMethod === "tunai" && (
            <div className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="cash-paid" className="text-xs font-bold text-slate-700">
                  Uang Tunai Diterima
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    Rp
                  </span>
                  <Input
                    id="cash-paid"
                    type="number"
                    value={cashPaid || ""}
                    onChange={(e) => setCashPaid(Number(e.target.value))}
                    className="pl-10 font-bold text-slate-900 text-lg rounded-xl h-11 border-slate-200"
                    required
                  />
                </div>
              </div>

              {/* Quick Nominal Presets (Toggleable / Click & Unclick) */}
              <div className="flex flex-wrap gap-1.5">
                {quickPresets.map((amt) => {
                  const isSelected = cashPaid === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCashPaid(isSelected ? totalAmount : amt)}
                      className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-xs"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {formatRupiah(amt).replace(",00", "")}
                    </button>
                  );
                })}
              </div>

              {/* Kembalian Highlight Box */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <span className="text-xs text-emerald-800 font-bold">Uang Kembalian</span>
                <span className="text-lg font-bold text-emerald-700">
                  {formatRupiah(changeDue)}
                </span>
              </div>
            </div>
          )}

          {/* Mode 2: Transfer Bank (Bypass Direct Success) */}
          {paymentMethod === "transfer" && (
            <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-2xl flex items-center gap-3 text-xs text-teal-900">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <p className="font-bold">Pembayaran Transfer Bank</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Pembayaran otomatis dianggap berhasil (bypass). Klik tombol di bawah untuk mencetak struk.
                </p>
              </div>
            </div>
          )}

          {/* Mode 3: QRIS (Bypass Direct Success) */}
          {paymentMethod === "qris" && (
            <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-2xl flex items-center gap-3 text-xs text-teal-900">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <p className="font-bold">Pembayaran QRIS</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Pembayaran QRIS otomatis dianggap berhasil (bypass). Klik tombol di bawah untuk mencetak struk.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 sm:space-x-0">
          <Button
            type="button"
            onClick={handlePay}
            disabled={isProcessing || (paymentMethod === "tunai" && cashPaid < totalAmount)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-11 shadow-md shadow-primary/30 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Memproses Pembayaran...</span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" />
                <span>SELESAIKAN & CETAK STRUK</span>
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
