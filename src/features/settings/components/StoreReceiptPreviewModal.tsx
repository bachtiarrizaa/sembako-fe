"use client";

import { useMemo } from "react";
import { Receipt, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatTransactionDate } from "@/utils/format";
import { StoreSetting } from "../types/setting";
import { StoreSettingFormValues } from "../schemas/setting.schema";

interface StoreReceiptPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setting: StoreSetting | StoreSettingFormValues;
}

export function StoreReceiptPreviewModal({
  open,
  onOpenChange,
  setting,
}: StoreReceiptPreviewModalProps) {
  const formattedDate = useMemo(() => {
    if (!open) return "";
    return formatTransactionDate(new Date());
  }, [open]);

  // Dummy Items for simulation preview
  const dummyItems = [
    { id: "1", name: "Minyak Goreng Bimoli 2L", qty: 1, unit: "Pcs", price: 35000 },
    { id: "2", name: "Beras Raja Lezat 5kg", qty: 1, unit: "Pcs", price: 72000 },
    { id: "3", name: "Gula Pasir Gulaku 1kg", qty: 2, unit: "Pcs", price: 16000 },
  ];

  const subtotal = 139000;
  const discount = 5000;
  const totalAmount = 134000;
  const paidAmount = 150000;
  const change = 16000;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md sm:rounded-xl transition-all max-h-[90vh] flex flex-col overflow-hidden">
        <button type="button" className="sr-only" />

        {/* Modal Header */}
        <DialogHeader className="border-b border-border px-6 py-4 shrink-0 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Preview Struk Belanja
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          {/* Thermal Receipt Paper Card (Strict Black & White) */}
          <div className="bg-white border border-slate-300 p-4 rounded-xl font-mono text-xs text-black space-y-3 shadow-xs">
            {/* Header Toko */}
            <div className="text-center border-b border-dashed border-slate-300 pb-2 space-y-0.5">
              <h4 className="font-bold text-sm text-black uppercase">
                {setting.storeName || "Nama Toko Anda"}
              </h4>
              <p className="text-[10px] text-slate-700">
                {setting.storeAddress || "Alamat Toko Anda"}
              </p>
              <p className="text-[10px] text-slate-700">
                Telp: {setting.storePhone || "-"}
              </p>
              {setting.receiptHeaderText && (
                <p className="text-[10px] text-slate-800 italic pt-1">
                  `{setting.receiptHeaderText}`
                </p>
              )}
            </div>

            {/* Transaction Metadata */}
            <div className="text-[10px] text-slate-800 space-y-0.5 border-b border-dashed border-slate-300 pb-2">
              <div className="flex items-center gap-1">
                <span className="w-16 shrink-0">No. Struk</span>
                <span>:</span>
                <span className="font-bold text-black">TRX-PREVIEW-001</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-16 shrink-0">Tanggal</span>
                <span>:</span>
                <span>{formattedDate}</span>
              </div>
              {setting.receiptShowCashierName && (
                <div className="flex items-center gap-1">
                  <span className="w-16 shrink-0">Kasir</span>
                  <span>:</span>
                  <span>Admin Toko</span>
                </div>
              )}
              {setting.receiptShowCustomerName && (
                <div className="flex items-center gap-1">
                  <span className="w-16 shrink-0">Pelanggan</span>
                  <span>:</span>
                  <span>Budi Santoso</span>
                </div>
              )}
            </div>

            {/* Dummy Purchased Items */}
            <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-2">
              {dummyItems.map((item) => (
                <div key={item.id} className="space-y-0.5 text-[11px]">
                  <div className="font-semibold text-black flex items-center justify-between">
                    <span>{item.name}</span>
                    <span className="text-[10px] text-slate-600 font-normal">({item.unit})</span>
                  </div>
                  <div className="flex justify-between text-slate-800 text-[10px]">
                    <span>
                      {item.qty} {item.unit} x {formatCurrency(item.price)}
                    </span>
                    <span className="font-bold text-black">
                      {formatCurrency(item.qty * item.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-1 text-[11px] text-slate-800 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Diskon</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
              <div className="flex justify-between font-bold text-xs text-black pt-1 border-t border-slate-300">
                <span>Total</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Bayar (Cash)</span>
                <span>{formatCurrency(paidAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kembalian</span>
                <span>{formatCurrency(change)}</span>
              </div>
            </div>

            {/* Loyalty Points Info (Simulasi Poin Pelanggan) */}
            {setting.receiptShowCustomerName && (
              <div className="text-[10px] text-slate-800 space-y-0.5 pt-1.5 border-t border-dashed border-slate-300">
                <div className="flex justify-between">
                  <span>Poin Diperoleh</span>
                  <span className="font-bold text-black">+15 Poin</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Poin Pelanggan</span>
                  <span className="font-bold text-black">150 Poin</span>
                </div>
              </div>
            )}

            {/* Footer Toko */}
            {setting.receiptFooterText && (
              <div className="text-center pt-2 text-[10px] text-slate-700 border-t border-dashed border-slate-300">
                *** {setting.receiptFooterText} ***
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <DialogFooter className="border-t border-border px-6 py-3 shrink-0">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full font-semibold rounded-xl h-9 gap-1.5 cursor-pointer"
          >
            Tutup Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
