"use client";

import { Printer, CheckCircle2, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CartItem } from "./PosCartMatrix";

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
  onNewTransaction,
}: PosReceiptModalProps) {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const now = new Date();
  const invoiceNo = `INV/${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}/${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <DialogHeader className="text-center space-y-1">
          <div className="size-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 text-center">
            Transaksi Berhasil!
          </DialogTitle>
        </DialogHeader>

        {/* Thermal Receipt Box */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl font-mono text-xs text-slate-800 space-y-3 my-2 shadow-inner">
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
              <span className="font-bold">{invoiceNo}</span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal</span>
              <span>
                {now.toLocaleDateString("id-ID")} {now.toLocaleTimeString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pelanggan</span>
              <span>{customerName || "Umum"}</span>
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
                    {item.qty} {item.unit.name} x {formatRupiah(item.unit.price)}
                  </span>
                  <span className="font-bold text-slate-800">
                    {formatRupiah(item.qty * item.unit.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-1 text-[11px] pt-1">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Diskon</span>
                <span>-{formatRupiah(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-xs text-slate-900 pt-1 border-t border-slate-200">
              <span>Total</span>
              <span>{formatRupiah(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Bayar ({paymentMethod})</span>
              <span>{formatRupiah(paidAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Kembalian</span>
              <span>{formatRupiah(change)}</span>
            </div>
          </div>

          <div className="text-center pt-2 text-[10px] text-slate-500 border-t border-dashed border-slate-300">
            *** Terima Kasih Atas Kunjungan Anda ***
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.print()}
            className="w-full sm:w-1/2 border-slate-200 text-slate-700 font-semibold rounded-xl h-10 gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk</span>
          </Button>

          <Button
            type="button"
            onClick={() => {
              onNewTransaction();
              onOpenChange(false);
            }}
            className="w-full sm:w-1/2 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-10 gap-1.5 cursor-pointer shadow-md shadow-primary/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Transaksi Baru</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
