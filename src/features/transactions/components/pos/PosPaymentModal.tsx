"use client";

import { useState } from "react";
import { QrCode, Banknote, Landmark, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/format";
import { Spinner } from "@/components/ui/spinner";

interface PosPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalAmount: number;
  customerName?: string;
  customerId?: string;
  isPending?: boolean;
  onPaymentSuccess: (method: "cash" | "qris" | "transfer", paidAmount: number, change: number) => void;
}

export function PosPaymentModal({
  open,
  onOpenChange,
  totalAmount,
  isPending = false,
  onPaymentSuccess,
}: PosPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer" | "qris">("cash");
  const [cashPaid, setCashPaid] = useState<number>(totalAmount);

  const quickPresets = [10000, 20000, 50000, 100000, 200000, 500000].filter(
    (v) => v >= totalAmount
  );

  const changeDue = Math.max(0, cashPaid - totalAmount);

  const handlePay = () => {
    onPaymentSuccess(
      paymentMethod,
      paymentMethod === "cash" ? cashPaid : totalAmount,
      paymentMethod === "cash" ? changeDue : 0
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md sm:rounded-xl transition-all max-h-[90vh] flex flex-col overflow-hidden">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4 shrink-0 text-left">
          <DialogTitle className="text-lg font-bold text-slate-900">
            Metode Pembayaran
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5 flex-1 overflow-y-auto min-h-0">
          {/* Total Tagihan Banner */}
          <div className="p-4 bg-teal-50/60 border border-teal-100 text-slate-900 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Total Tagihan</span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <Banknote className="w-6 h-6" />
            </div>
          </div>

          {/* Payment Method Selector: 3 Options (cash | transfer | qris) */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setPaymentMethod("cash");
                setCashPaid(totalAmount);
              }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-xs transition-all cursor-pointer ${paymentMethod === "cash"
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
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-xs transition-all cursor-pointer ${paymentMethod === "transfer"
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
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-xs transition-all cursor-pointer ${paymentMethod === "qris"
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
            >
              <QrCode className="w-4 h-4" />
              <span>QRIS</span>
            </button>
          </div>

          {/* Mode 1: Cash */}
          {paymentMethod === "cash" && (
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

              {/* Quick Nominal Presets: grid-cols-2 on mobile, grid-cols-3 on desktop to prevent text collision */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quickPresets.map((amt) => {
                  const isSelected = cashPaid === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCashPaid(isSelected ? totalAmount : amt)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap text-center ${isSelected
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                    >
                      {formatCurrency(amt)}
                    </button>
                  );
                })}
              </div>

              {/* Kembalian Highlight Box */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <span className="text-xs text-emerald-800 font-bold">Uang Kembalian</span>
                <span className="text-lg font-bold text-emerald-700">
                  {formatCurrency(changeDue)}
                </span>
              </div>
            </div>
          )}

          {/* Mode 2: Transfer Bank */}
          {paymentMethod === "transfer" && (
            <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-2xl flex items-center gap-3 text-xs text-teal-900">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <p className="font-bold">Pembayaran Transfer Bank</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Pembayaran otomatis dianggap berhasil. Klik tombol di bawah untuk mencetak struk.
                </p>
              </div>
            </div>
          )}

          {/* Mode 3: QRIS */}
          {paymentMethod === "qris" && (
            <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-2xl flex items-center gap-3 text-xs text-teal-900">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <p className="font-bold">Pembayaran QRIS</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Pembayaran QRIS otomatis dianggap berhasil. Klik tombol di bawah untuk mencetak struk.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border px-6 py-4 shrink-0">
          <Button
            type="button"
            onClick={handlePay}
            disabled={isPending || (paymentMethod === "cash" && cashPaid < totalAmount)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-11 shadow-md shadow-primary/30 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <Spinner data-icon="inline-start" className="size-4" />
            ) : "Bayar & Cetak Struk"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
