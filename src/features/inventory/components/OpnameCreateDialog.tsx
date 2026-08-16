"use client"

import { useEffect } from "react"
import { useForm, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createOpnameSchema, CreateOpnameRequest } from "../schemas/inventory.schema"
import { useCreateOpname } from "../hooks"

interface OpnameCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: {
    id: string
    name: string
    baseUnitName?: string
  }
  systemQty: number
}

export function OpnameCreateDialog({
  open,
  onOpenChange,
  product,
  systemQty,
}: OpnameCreateDialogProps) {
  const createOpname = useCreateOpname()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateOpnameRequest>({
    resolver: zodResolver(createOpnameSchema) as unknown as Resolver<CreateOpnameRequest>,
    defaultValues: {
      productId: product.id,
      physicalQty: undefined,
      note: "",
    },
  })

  // Watch physicalQty to calculate discrepancy in real-time
  const physicalQtyVal = watch("physicalQty")
  const physicalQty =
    physicalQtyVal !== undefined && physicalQtyVal !== null && String(physicalQtyVal) !== ""
      ? Number(physicalQtyVal)
      : null
  const discrepancy = physicalQty !== null ? physicalQty - systemQty : null

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset({
        productId: product.id,
        physicalQty: undefined,
        note: "",
      })
    }
  }, [open, product.id, reset])

  const onSubmit = (values: CreateOpnameRequest) => {
    createOpname.mutate(values, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md sm:rounded-xl">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            Pengajuan Opname Stok
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 px-6 py-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Produk</Label>
            <div className="font-semibold text-sm text-foreground">{product.name}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-xl border border-border">
            <div className="space-y-0.5">
              <span className="text-xs text-muted-foreground block">Stok Sistem</span>
              <span className="text-sm font-semibold text-foreground">
                {systemQty} {product.baseUnitName || ""}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-muted-foreground block">Selisih (Discrepancy)</span>
              <span
                className={`text-sm font-semibold block ${
                  discrepancy === null
                    ? "text-muted-foreground"
                    : discrepancy > 0
                    ? "text-emerald-600"
                    : discrepancy < 0
                    ? "text-destructive"
                    : "text-slate-600"
                }`}
              >
                {discrepancy === null
                  ? "-"
                  : `${discrepancy > 0 ? "+" : ""}${discrepancy} ${product.baseUnitName || ""}`}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="physicalQty" className="text-xs font-semibold text-foreground">
              Jumlah Fisik Real ({product.baseUnitName || "Unit"})
            </Label>
            <Input
              id="physicalQty"
              type="number"
              step="any"
              placeholder="Masukkan jumlah fisik saat ini..."
              {...register("physicalQty")}
              disabled={createOpname.isPending}
            />
            {errors.physicalQty && (
              <span className="flex items-center gap-1 text-[11px] text-destructive leading-none mt-1">
                <AlertCircle className="size-3 shrink-0" />
                {errors.physicalQty.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note" className="text-xs font-semibold text-foreground">
              Catatan Opname
            </Label>
            <Textarea
              id="note"
              placeholder="Alasan opname stok (contoh: barang kadaluarsa/rusak)..."
              {...register("note")}
              disabled={createOpname.isPending}
              rows={3}
              className="resize-none"
            />
            {errors.note && (
              <span className="flex items-center gap-1 text-[11px] text-destructive leading-none mt-1">
                <AlertCircle className="size-3 shrink-0" />
                {errors.note.message}
              </span>
            )}
          </div>

          <DialogFooter className="border-t border-border px-6 py-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createOpname.isPending}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button type="submit" disabled={createOpname.isPending} className="cursor-pointer">
              {createOpname.isPending ? <Spinner className="size-4" /> : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
