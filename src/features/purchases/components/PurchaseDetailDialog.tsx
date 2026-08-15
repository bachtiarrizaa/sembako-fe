"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency, formatDate, formatDateTime, formatQuantity } from "@/utils/format"
import { usePurchaseDetail } from "../hooks/usePurchaseDetail"

interface PurchaseDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchaseId: string | null
}

export function PurchaseDetailDialog({ open, onOpenChange, purchaseId }: PurchaseDetailDialogProps) {
  const { data, isLoading, isError } = usePurchaseDetail(purchaseId)
  const purchase = data?.data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-2xl sm:rounded-xl">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            Detail Pembelian
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto no-scrollbar">
          {isLoading ? (
            <div className="space-y-5">
              {/* Section 1 skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-border" />

              {/* Section 2 skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : isError || !purchase ? (
            <p className="text-sm text-destructive">Gagal memuat detail pembelian.</p>
          ) : (
            <div className="space-y-5">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground">Informasi Pembelian</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <DetailItem label="No. Invoice" value={purchase.invoiceNumber || "-"} />
                  <DetailItem label="Tanggal Beli" value={formatDate(purchase.purchaseDate)} />
                  <DetailItem label="Supplier" value={purchase.supplier?.name || "-"} />
                  <DetailItem label="Dibuat Oleh" value={purchase.creator?.name || "-"} />
                  <DetailItem label="Waktu Dibuat" value={formatDateTime(purchase.createdAt)} />
                </div>
              </div>

              <hr className="border-border" />

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground">Detail Produk</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <DetailItem label="Nama Produk" value={purchase.product?.name || "-"} />
                  <DetailItem label="Stok Awal" value={formatQuantity(purchase.initialQuantity, purchase.baseUnit)} />
                  <DetailItem label="Stok Sisa" value={formatQuantity(purchase.remainingQuantity, purchase.baseUnit)} />
                  <DetailItem
                    label="Harga Beli"
                    value={
                      purchase.unit && purchase.unitPrice != null
                        ? `${formatCurrency(purchase.unitPrice)}/${purchase.unit.name}${
                            purchase.baseUnit
                              ? ` (= ${formatCurrency(purchase.purchasePrice)}/${purchase.baseUnit.name})`
                              : ""
                          }`
                        : formatCurrency(purchase.purchasePrice)
                    }
                  />
                  <DetailItem
                    label="Total Beli"
                    value={formatCurrency((purchase.initialQuantity ?? 0) * (purchase.purchasePrice ?? 0))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer font-medium px-3 py-4"
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground break-words">{value}</p>
    </div>
  )
}