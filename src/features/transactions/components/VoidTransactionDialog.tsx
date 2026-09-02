"use client"

import { useEffect } from "react"
import { useForm, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { formatCurrency, formatTransactionDate } from "@/utils/format"
import { voidTransactionSchema, VoidTransactionRequest } from "../schemas/transaction.schema"
import { useVoidTransaction } from "../hooks/useVoidTransaction"
import type { TransactionResponse } from "../types/transaction"

interface VoidTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: TransactionResponse | null
}

export function VoidTransactionDialog({
  open,
  onOpenChange,
  transaction,
}: VoidTransactionDialogProps) {
  const voidMutation = useVoidTransaction()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VoidTransactionRequest>({
    resolver: zodResolver(voidTransactionSchema) as unknown as Resolver<VoidTransactionRequest>,
    defaultValues: {
      reason: "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({ reason: "" })
    }
  }, [open, reset])

  const onSubmit = (values: VoidTransactionRequest) => {
    if (!transaction) return

    voidMutation.mutate(
      { id: transaction.id, payload: values },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:rounded-xl transition-all max-h-[90vh] flex flex-col overflow-hidden sm:max-w-md">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4 shrink-0">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
            Pembatalan Transaksi
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 space-y-4 flex flex-col flex-1 overflow-y-auto">
          {/* 1. Warning Alert Box */}
          <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-xl p-3.5 space-y-1 text-xs shrink-0">
            <span className="font-bold block text-rose-950">
              Peringatan Pembatalan Transaksi!
            </span>
            <p className="text-rose-700 leading-relaxed">
              Membatalkan transaksi ini akan{" "}
              <strong className="font-semibold text-rose-950">mengembalikan stok produk</strong>{" "}
              yang dibeli dan{" "}
              <strong className="font-semibold text-rose-950">membatalkan poin</strong> yang
              didapatkan pelanggan.
            </p>
          </div>

          {/* 2. Transaction Summary Preview Card */}
          {transaction && (
            <div className="bg-muted/20 border border-border rounded-xl p-3.5 space-y-2 text-xs shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">No. Struk</span>
                <span className="font-bold font-mono text-foreground">
                  {transaction.receiptNumber}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tanggal Transaksi</span>
                <span className="font-medium text-foreground">
                  {formatTransactionDate(transaction.createdAt)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Kasir</span>
                <span className="font-semibold text-foreground">
                  {transaction.cashier?.name || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-semibold text-foreground">
                  {transaction.customer?.name || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-2 mt-1">
                <span className="font-bold text-foreground">Total Transaksi</span>
                <span className="font-bold text-primary text-sm">
                  {formatCurrency(transaction.total)}
                </span>
              </div>
            </div>
          )}

          {/* 3. Reason Input Field (between warning & transaction preview) */}
          <div className="space-y-1.5 shrink-0">
            <Label htmlFor="reason" className="text-xs font-semibold text-foreground">
              Alasan Pembatalan <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reason"
              placeholder="Contoh: Salah input barang / pelanggan batal"
              {...register("reason")}
              disabled={voidMutation.isPending}
              className="bg-white text-xs"
              autoFocus
            />
            {errors.reason && (
              <span className="text-[11px] text-destructive leading-none block mt-1">
                {errors.reason.message}
              </span>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="border-t border-border pt-4 -mx-6 -mb-6 px-6 pb-4 shrink-0 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={voidMutation.isPending}
              className="cursor-pointer font-medium px-4 py-2"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={voidMutation.isPending}
              className="cursor-pointer font-medium px-4 py-2 gap-1.5"
            >
              {voidMutation.isPending ? (
                <>
                  <Spinner className="size-4" /> Memproses...
                </>
              ) : (
                "Batalkan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
