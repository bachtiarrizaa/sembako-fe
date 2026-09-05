"use client";

import { useMemo } from "react";
import { Printer, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import type { CartItem } from "../../types/pos";

interface PosReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paidAmount: number;
  change: number;
  customerName?: string;
  receiptNumber?: string;
  createdAt?: string;
  onNewTransaction: () => void;
}

export function PosReceiptModal({
  open,
  onOpenChange,
  items,
  subtotal,
  discount,
  totalAmount,
  paymentMethod,
  paidAmount,
  change,
  customerName,
  receiptNumber,
  createdAt,
  onNewTransaction,
}: PosReceiptModalProps) {
  const formattedDate = useMemo(() => {
    if (!open) return "";
    const dateObj = createdAt ? new Date(createdAt) : new Date();
    return `${dateObj.toLocaleDateString("id-ID")} ${dateObj.toLocaleTimeString("id-ID")}`;
  }, [open, createdAt]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md sm:rounded-xl transition-all max-h-[90vh] flex flex-col overflow-hidden">
        <button type="button" className="sr-only" />

        {/* 1. Header (Centered Pyramid with X Close Button) */}
        <DialogHeader className="border-b border-border px-6 py-4 shrink-0 flex flex-col items-center justify-center text-center">
          <div className="size-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 text-center">
            Transaksi Berhasil
          </DialogTitle>
        </DialogHeader>

        {/* 2. Middle Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0 no-scrollbar">
          {/* Thermal Receipt Box */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl font-mono text-xs text-slate-800 space-y-3 shadow-inner">
            <div className="text-center border-b border-dashed border-slate-300 pb-2 space-y-0.5">
              <h4 className="font-bold text-sm text-slate-900 uppercase">
                Toko Beras Putra Mandiri
              </h4>
              <p className="text-[10px] text-slate-500">
                Jl. Raya Pasar Sembako No. 12, Jakarta
              </p>
              <p className="text-[10px] text-slate-500">Telp: 0812-3456-7890</p>
            </div>

            {/* Transaction Metadata */}
            <div className="text-[10px] space-y-0.5 border-b border-dashed border-slate-300 pb-2">
              <div className="flex justify-between">
                <span>No. Struk</span>
                <span className="font-bold">{receiptNumber || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan</span>
                <span>{customerName || "-"}</span>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-2">
              {items.map((item) => (
                <div key={item.id} className="space-y-0.5 text-[11px]">
                  <div className="font-semibold text-slate-900 flex items-center justify-between">
                    <span>{item.product.name}</span>
                    <span className="text-[10px] text-slate-500 font-normal">({item.unit.name})</span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-[10px]">
                    <span>
                      {item.qty} {item.unit.name} x {formatCurrency(item.unit.price)}
                    </span>
                    <span className="font-bold text-slate-800">
                      {formatCurrency(item.qty * item.unit.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-1 text-[11px] pt-1">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Diskon</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xs text-slate-900 pt-1 border-t border-slate-200">
                <span>Total</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Bayar ({paymentMethod})</span>
                <span>{formatCurrency(paidAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Kembalian</span>
                <span>{formatCurrency(change)}</span>
              </div>
            </div>

            <div className="text-center pt-2 text-[10px] text-slate-500 border-t border-dashed border-slate-300">
              *** Terima Kasih Atas Kunjungan Anda ***
            </div>
          </div>
        </div>

        {/* 3. Footer (Fixed Bottom) */}
        <DialogFooter className="border-t border-border px-6 py-4 shrink-0">
          <Button
            type="button"
            onClick={() => {
              window.print();
              onNewTransaction();
              onOpenChange(false);
            }}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-11 gap-2 cursor-pointer shadow-md shadow-primary/20"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
