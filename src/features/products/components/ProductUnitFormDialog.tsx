"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { ComboboxSelect } from "@/components/common/ComboboxSelect"
import { useUnits } from "@/features/units/hooks"
import { addProductUnitSchema, updateProductUnitSchema } from "../schemas/product.schema"
import { ProductUnit } from "../types/product"
import { useAddProductUnit, useUpdateProductUnit } from "../hooks"

interface ProductUnitFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  productUnit?: ProductUnit | null
  existingUnitIds?: string[]
}

interface ProductUnitFormValues {
  unitId: string
  conversionToBase: string
  sellingPrice: string
}

export function ProductUnitFormDialog({
  open,
  onOpenChange,
  productId,
  productUnit,
  existingUnitIds = [],
}: ProductUnitFormDialogProps) {
  const isEdit = Boolean(productUnit)
  const addUnit = useAddProductUnit()
  const updateUnit = useUpdateProductUnit()
  const isPending = addUnit.isPending || updateUnit.isPending

  // Fetch master units for dropdown select
  const { data: unitsData, isLoading: isUnitsLoading } = useUnits({ page: 1, limit: 100 })
  const masterUnits = unitsData?.items ?? []

  // Filter out master units that are already added to this product (unless it's the one we are editing)
  const availableUnits = masterUnits.filter((mu) => {
    if (isEdit && productUnit?.unit.id === mu.id) return true
    return !existingUnitIds.includes(mu.id)
  })

  // Set up forms
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<ProductUnitFormValues>({
    resolver: zodResolver(isEdit ? updateProductUnitSchema : addProductUnitSchema) as any,
    defaultValues: {
      unitId: "",
      conversionToBase: "",
      sellingPrice: "",
    },
  })

  const selectedUnitId = watch("unitId")

  // Reset form when dialog opens/closes or productUnit changes
  useEffect(() => {
    if (open) {
      clearErrors()
      if (productUnit) {
        reset({
          unitId: productUnit.unit.id,
          conversionToBase: String(productUnit.conversionToBase),
          sellingPrice: String(productUnit.sellingPrice),
        })
      } else {
        reset({
          unitId: "",
          conversionToBase: "",
          sellingPrice: "",
        })
      }
    }
  }, [open, productUnit, reset, clearErrors])

  const onSubmit = (values: any) => {
    if (isEdit && productUnit) {
      updateUnit.mutate(
        {
          id: productId,
          unitId: productUnit.id, // product relation ID
          payload: {
            conversionToBase: Number(values.conversionToBase),
            sellingPrice: Number(values.sellingPrice),
          },
        },
        {
          onSuccess: () => onOpenChange(false),
        }
      )
    } else {
      addUnit.mutate(
        {
          id: productId,
          payload: {
            unitId: values.unitId,
            conversionToBase: Number(values.conversionToBase),
            sellingPrice: Number(values.sellingPrice),
          },
        },
        {
          onSuccess: () => onOpenChange(false),
        }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md sm:rounded-xl">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            {isEdit ? "Edit Satuan" : "Tambah Satuan"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            {isEdit
              ? "Perbarui faktor konversi dan harga jual satuan produk ini."
              : "Tambahkan satuan baru ke produk ini."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4 px-6 py-4">
            {/* Unit Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Satuan <span className="text-destructive">*</span></Label>
              {isEdit ? (
                <div className="px-3 py-2 bg-muted/50 rounded-lg border border-border text-sm font-medium text-muted-foreground">
                  {productUnit?.unit.name}
                </div>
              ) : (
                <ComboboxSelect
                  items={availableUnits}
                  value={selectedUnitId}
                  onChange={(val) => setValue("unitId", val)}
                  getOptionValue={(u: any) => u.id}
                  getOptionLabel={(u: any) => u.name}
                  placeholder="Pilih Satuan..."
                  searchPlaceholder="Cari satuan..."
                  emptyText={isUnitsLoading ? "Memuat satuan..." : "Satuan tidak ditemukan."}
                  isLoading={isUnitsLoading}
                  className="w-full bg-white"
                />
              )}
              {errors.unitId && (
                <span className="text-[11px] text-destructive leading-none mt-1">
                  {errors.unitId.message}
                </span>
              )}
            </div>

            {/* Conversion to Base */}
            <div className="space-y-1.5">
              <Label htmlFor="conversionToBase" className="text-xs font-semibold text-foreground">
                Faktor Konversi ke Base Unit <span className="text-destructive">*</span>
              </Label>
              <Input
                id="conversionToBase"
                type="number"
                step="any"
                placeholder="Contoh: 10 (1 Dus = 10 Kg)"
                {...register("conversionToBase")}
                disabled={isPending}
                className="bg-white"
              />
              {errors.conversionToBase && (
                <span className="text-[11px] text-destructive leading-none mt-1">
                  {errors.conversionToBase.message}
                </span>
              )}
            </div>

            {/* Selling Price */}
            <div className="space-y-1.5">
              <Label htmlFor="sellingPrice" className="text-xs font-semibold text-foreground">
                Harga Jual (Rupiah) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sellingPrice"
                type="number"
                placeholder="Contoh: 150000"
                {...register("sellingPrice")}
                disabled={isPending}
                className="bg-white"
              />
              {errors.sellingPrice && (
                <span className="text-[11px] text-destructive leading-none mt-1">
                  {errors.sellingPrice.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-border px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="cursor-pointer font-medium px-3 py-4"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer font-medium px-3 py-4"
            >
              {isPending ? <Spinner className="size-4" /> : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
