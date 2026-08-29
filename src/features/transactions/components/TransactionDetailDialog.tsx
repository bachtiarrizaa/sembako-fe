"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatTransactionDate } from "@/utils/format"
import { useTransactionDetails } from "../hooks"
import {
  PAYMENT_METHOD_LABELS,
  TRANSACTION_STATUSES,
} from "../constants/transaction.constant"
import type { PaymentMethod } from "../types/transaction"

interface TransactionDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactionId?: string | null
}

export function TransactionDetailDialog({
  open,
  onOpenChange,
  transactionId,
}: TransactionDetailDialogProps) {
  const { data: transaction, isLoading, isError } = useTransactionDetails(transactionId)

  const renderPaymentBadge = (method?: PaymentMethod) => {
    if (!method) return "-"
    const label = PAYMENT_METHOD_LABELS[method] || method
    switch (method) {
      case "cash":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200">
            {label}
          </Badge>
        )
      case "qris":
        return (
          <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200">
            {label}
          </Badge>
        )
      case "transfer":
        return (
          <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200">
            {label}
          </Badge>
        )
      default:
        return <Badge variant="outline">{label}</Badge>
    }
  }

  const isVoid = transaction?.status === TRANSACTION_STATUSES.VOID

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-2xl sm:rounded-xl transition-all max-h-[90vh] flex flex-col overflow-hidden">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4 shrink-0 flex flex-row items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
              Detail Transaksi
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 no-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Spinner className="size-8 text-primary" />
              <span className="text-xs text-muted-foreground">
                Memuat detail transaksi...
              </span>
            </div>
          ) : isError || !transaction ? (
            <div className="text-center py-12 text-sm text-destructive font-medium">
              Transaksi tidak ditemukan atau gagal dimuat.
            </div>
          ) : (
            <>
              {/* Top Metadata Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                {/* Left Column */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-28 shrink-0 font-medium">
                      No. Struk
                    </span>
                    <span className="text-muted-foreground font-medium">:</span>
                    <span className="font-bold font-mono text-foreground">
                      {transaction.receiptNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-28 shrink-0 font-medium">
                      Waktu Transaksi
                    </span>
                    <span className="text-muted-foreground font-medium">:</span>
                    <span className="font-medium text-foreground">
                      {formatTransactionDate(transaction.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-28 shrink-0 font-medium">
                      Nama Kasir
                    </span>
                    <span className="text-muted-foreground font-medium">:</span>
                    <span className="font-semibold text-foreground">
                      {transaction.cashier?.name || "-"}
                    </span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-28 shrink-0 font-medium">
                      Status Transaksi
                    </span>
                    <span className="text-muted-foreground font-medium">:</span>
                    <span>
                      {isVoid ? (
                        <Badge className="bg-rose-50 text-rose-700 border-rose-200">
                          Dibatalkan
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          Selesai
                        </Badge>
                      )}
                    </span>
                  </div>

                  {isVoid && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-28 shrink-0 font-medium">
                          Dibatalkan Oleh
                        </span>
                        <span className="text-muted-foreground font-medium">:</span>
                        <span className="font-semibold text-rose-700">
                          {transaction.voidedByUser?.name || "Kasir"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-28 shrink-0 font-medium">
                          Alasan Dibatalkan
                        </span>
                        <span className="text-muted-foreground font-medium">:</span>
                        <span className="font-medium text-rose-700 italic">
                          {transaction.voidReason || "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-28 shrink-0 font-medium">
                          Waktu Dibatalkan
                        </span>
                        <span className="text-muted-foreground font-medium">:</span>
                        <span className="font-medium text-rose-700">
                          {formatTransactionDate(transaction.voidedAt)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Separator line */}
              <hr className="border-border" />

              {/* Items Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-foreground">
                  Rincian Item Pembelian ({transaction.items?.length ?? 0})
                </h4>
                <div className="border border-border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow className="border-border hover:bg-muted/40">
                        <TableHead className="w-[40%] font-bold text-muted-foreground pl-4 py-2.5 text-xs">
                          Nama Produk
                        </TableHead>
                        <TableHead className="font-bold text-muted-foreground text-center py-2.5 text-xs">
                          Satuan
                        </TableHead>
                        <TableHead className="font-bold text-muted-foreground text-center py-2.5 text-xs">
                          Qty
                        </TableHead>
                        <TableHead className="font-bold text-muted-foreground text-right py-2.5 text-xs">
                          Harga Satuan
                        </TableHead>
                        <TableHead className="font-bold text-muted-foreground text-right py-2.5 text-xs">
                          Diskon
                        </TableHead>
                        <TableHead className="font-bold text-muted-foreground text-right pr-4 py-2.5 text-xs">
                          Subtotal
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transaction.items?.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-6 text-xs text-muted-foreground italic"
                          >
                            Tidak ada item.
                          </TableCell>
                        </TableRow>
                      ) : (
                        transaction.items?.map((item) => (
                          <TableRow
                            key={item.id}
                            className="border-border hover:bg-muted/20 text-xs"
                          >
                            <TableCell className="pl-4 py-2.5 font-semibold text-foreground">
                              {item.productName}
                            </TableCell>
                            <TableCell className="py-2.5 text-center text-muted-foreground font-medium">
                              {item.unitName}
                            </TableCell>
                            <TableCell className="py-2.5 text-center font-semibold text-slate-700">
                              {item.qty}
                            </TableCell>
                            <TableCell className="py-2.5 text-right font-medium text-slate-600">
                              {formatCurrency(item.unitPrice)}
                            </TableCell>
                            <TableCell className="py-2.5 text-right text-rose-600 font-medium">
                              {item.discountApplied > 0 ? (
                                `- ${formatCurrency(item.discountApplied)}`
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="pr-4 py-2.5 text-right font-bold text-foreground">
                              {formatCurrency(item.subtotal)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Option 1: 2-Column Split Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-1">
                {/* Left Card: Info Pembayaran */}
                <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-bold text-foreground">Informasi Pembayaran</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Metode Bayar</span>
                      <span>{renderPaymentBadge(transaction.paymentMethod)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Customer</span>
                      <span className="font-semibold text-foreground">
                        {transaction.customer?.name || "Umum"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Poin Ditukarkan</span>
                      <span className="font-semibold text-rose-600">
                        {transaction.pointsUsed > 0 ? `-${transaction.pointsUsed} Poin` : "0 Poin"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Poin Diperoleh</span>
                      <span className="font-semibold text-emerald-600">
                        {transaction.pointsEarned > 0 ? `+${transaction.pointsEarned} Poin` : "0 Poin"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Card: Rincian Kalkulasi Harga (Struk Box) */}
                <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(transaction.subtotal)}
                    </span>
                  </div>

                  {transaction.totalDiscount > 0 && (
                    <div className="flex justify-between items-center text-rose-600">
                      <span>Total Diskon</span>
                      <span className="font-semibold">
                        - {formatCurrency(transaction.totalDiscount)}
                      </span>
                    </div>
                  )}

                  {transaction.pointsDiscountValue > 0 && (
                    <div className="flex justify-between items-center text-rose-600">
                      <span>Diskon Poin ({transaction.pointsUsed} Poin)</span>
                      <span className="font-semibold">
                        - {formatCurrency(transaction.pointsDiscountValue)}
                      </span>
                    </div>
                  )}

                  <hr className="border-border border-dashed my-1" />

                  <div className="flex justify-between items-center text-sm font-bold text-foreground">
                    <span>Total Bayar</span>
                    <span className="text-base text-primary font-bold">
                      {formatCurrency(transaction.total)}
                    </span>
                  </div>

                  {transaction.paymentMethod === "cash" && (
                    <>
                      <hr className="border-border border-dashed my-1" />
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Tunai Diterima</span>
                        <span className="font-semibold text-foreground">
                          {formatCurrency(transaction.cashReceived)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Kembalian</span>
                        <span className="font-semibold text-foreground">
                          {formatCurrency(transaction.changeGiven)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
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
  )
}
