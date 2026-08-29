"use client"

import { useEffect } from "react"
import { useForm, Resolver } from "react-hook-form"
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
import { ComboboxSelect } from "@/components/common/ComboboxSelect"
import { useUnits } from "@/features/units/hooks"
import { addProductUnitSchema } from "../schemas/product.schema"

interface ProductUnitFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productUnit?: {
    id?: string
    unitId: string
    conversionToBase: string | number
    sellingPrice: string | number
    unit?: { id: string; name: string }
  } | null
  existingUnitIds?: string[]
  onSubmit: (values: { unitId: string; conversionToBase: string; sellingPrice: string }) => void
}

interface ProductUnitFormValues {
  unitId: string
  conversionToBase: string
  sellingPrice: string
}

export function ProductUnitFormDialog({
  open,
  onOpenChange,
  productUnit,
  existingUnitIds = [],
  onSubmit,
}: ProductUnitFormDialogProps) {
  const isEdit = Boolean(productUnit)

  // Fetch master units for dropdown select
  const { data: unitsData, isLoading: isUnitsLoading } = useUnits({ page: 1, limit: 100 })
  const masterUnits = unitsData?.items ?? []

  // Filter out master units that are already added to this product (unless it's the one we are editing)
  const availableUnits = masterUnits.filter((mu) => {
    if (isEdit && (productUnit?.unitId === mu.id || productUnit?.unit?.id === mu.id)) return true
    return !existingUnitIds.includes(mu.id)
  })

  // Find the selected unit's name for display in read-only mode
  const selectedUnit = masterUnits.find((mu) => mu.id === (productUnit?.unitId || productUnit?.unit?.id))
  const displayUnitName = selectedUnit?.name || productUnit?.unit?.name || ""

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
    resolver: zodResolver(addProductUnitSchema) as unknown as Resolver<ProductUnitFormValues>,
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
          unitId: productUnit.unitId || productUnit.unit?.id || "",
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

  const handleFormSubmit = (values: ProductUnitFormValues) => {
    onSubmit(values)
    onOpenChange(false)
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
              ? "Perbarui faktor konversi dan harga jual satuan produk ini secara lokal."
              : "Tambahkan satuan baru ke daftar satuan produk ini secara lokal."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <div className="space-y-4 px-6 py-4">
            {/* Unit Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Satuan <span className="text-destructive">*</span></Label>
              {isEdit ? (
                <div className="px-3 py-2 bg-muted/50 rounded-lg border border-border text-sm font-medium text-muted-foreground">
                  {displayUnitName}
                </div>
              ) : (
                <ComboboxSelect
                  items={availableUnits}
                  value={selectedUnitId}
                  onChange={(val) => setValue("unitId", val)}
                  getOptionValue={(u: { id: string; name: string }) => u.id}
                  getOptionLabel={(u: { id: string; name: string }) => u.name}
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
              className="cursor-pointer font-medium px-3 py-4"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="cursor-pointer font-medium px-3 py-4"
            >
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
