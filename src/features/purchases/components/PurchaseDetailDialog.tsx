"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { formatCurrency, formatDate, formatDateTime, purchasedQuantityInUnit } from "@/utils/format"
import { usePurchaseDetail, useDeletePurchaseItem } from "../hooks"
import { Purchase } from "../types/purchase"
import { ConfirmModal } from "@/components/common/ConfirmModal"
import { PurchaseFormDialog } from "./PurchaseFormDialog"

interface PurchaseDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchaseId: string | null
}

export function PurchaseDetailDialog({ open, onOpenChange, purchaseId }: PurchaseDetailDialogProps) {
  const { data, isLoading, isError } = usePurchaseDetail(purchaseId)
  const purchase = data?.data

  const [editingItem, setEditingItem] = useState<Purchase | null>(null)
  const [deletingItem, setDeletingItem] = useState<Purchase | null>(null)

  const deleteItem = useDeletePurchaseItem()

  const handleDeleteItem = () => {
    if (!deletingItem) return
    deleteItem.mutate(deletingItem.id, {
      onSuccess: () => {
        setDeletingItem(null)
        if (purchase && purchase.items.length === 1) {
          onOpenChange(false)
        }
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-4xl sm:rounded-xl">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            Detail Pembelian
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto no-scrollbar">
          {isLoading ? (
            <div className="space-y-5">
              <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>
              <hr className="border-border" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-40 w-full" />
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
                  <DetailItem label="Total Pembelian" value={formatCurrency(purchase.totalAmount)} />
                  <DetailItem label="Dibuat Oleh" value={purchase.creator?.name || "-"} />
                  <DetailItem label="Waktu Dibuat" value={formatDateTime(purchase.createdAt)} />
                </div>
              </div>

              <hr className="border-border" />

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground">Detail Produk</h3>
                {purchase.items.length === 0 ? (
                  <div className="border border-dashed border-border rounded-xl py-6 text-center">
                    <p className="text-sm text-muted-foreground">Tidak ada item.</p>
                  </div>
                ) : (
                  <div className="border border-border rounded-xl overflow-hidden">
                    <Table className="table-fixed w-full">
                      <TableHeader className="bg-primary">
                        <TableRow className="bg-primary border-0 hover:bg-primary">
                          <TableHead className="w-[25%] font-bold text-primary-foreground px-3 py-2">
                            Produk
                          </TableHead>
                          <TableHead className="w-[15%] font-bold text-primary-foreground px-3 py-2">
                            Satuan
                          </TableHead>
                          <TableHead className="w-[10%] font-bold text-primary-foreground px-3 py-2 text-right">
                            Jumlah
                          </TableHead>
                          <TableHead className="w-[20%] font-bold text-primary-foreground px-3 py-2 text-right">
                            Harga
                          </TableHead>
                          <TableHead className="w-[20%] font-bold text-primary-foreground px-3 py-2 text-right">
                            Total
                          </TableHead>
                          <TableHead className="w-[10%] font-bold text-primary-foreground px-3 py-2 text-center">
                            Aksi
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {purchase.items.map((item) => {
                          const isSold = item.remainingQuantity < item.initialQuantity
                          return (
                            <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                              <TableCell className="h-9 text-gray-600 px-3 py-2 whitespace-normal break-words">
                                {item.product?.name || "-"}
                              </TableCell>
                              <TableCell className="h-9 text-gray-600 px-3 py-2 whitespace-normal break-words">
                                {item.unit?.name || "-"}
                              </TableCell>
                              <TableCell className="h-9 text-gray-600 px-3 py-2 text-right whitespace-nowrap">
                                {purchasedQuantityInUnit(item.initialQuantity, item)}
                              </TableCell>
                              <TableCell className="h-9 text-gray-600 px-3 py-2 text-right whitespace-nowrap">
                                {item.unit && item.unitPrice != null
                                  ? formatCurrency(item.unitPrice)
                                  : formatCurrency(item.purchasePrice)}
                              </TableCell>
                              <TableCell className="h-9 font-medium text-gray-800 px-3 py-2 text-right whitespace-nowrap">
                                {formatCurrency(item.total ?? item.initialQuantity * item.purchasePrice)}
                              </TableCell>
                              <TableCell className="h-9 text-gray-600 px-3 py-2">
                                <div className="flex justify-center gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    title="Edit Item"
                                    className="text-yellow-500 hover:text-yellow-500/80 hover:bg-muted cursor-pointer"
                                    onClick={() => setEditingItem(item)}
                                  >
                                    <Pencil className="size-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    title={isSold ? "Item sudah terjual sebagian" : "Hapus Item"}
                                    disabled={isSold}
                                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 disabled:opacity-40 disabled:cursor-not-allowed"
                                    onClick={() => setDeletingItem(item)}
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                      <TableFooter className="bg-muted/50">
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="font-semibold text-foreground px-3 py-2.5"
                          >
                            Total
                          </TableCell>
                          <TableCell className="font-bold text-foreground px-3 py-2.5 text-right">
                            {formatCurrency(purchase.totalAmount)}
                          </TableCell>
                          <TableCell className="px-3 py-2.5" />
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                )}
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

      <PurchaseFormDialog
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
        purchase={editingItem}
      />

      <ConfirmModal
        open={!!deletingItem}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        title="Hapus Item"
        description={
          <>
            Anda yakin ingin menghapus item{" "}
            <strong className="font-bold">{deletingItem?.product?.name}</strong> dari pembelian ini?
            Stok yang masuk akan dikembalikan dan tidak dapat dibatalkan.
          </>
        }
        confirmText="Hapus"
        variant="danger"
        isLoading={deleteItem.isPending}
        onConfirm={handleDeleteItem}
      />
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