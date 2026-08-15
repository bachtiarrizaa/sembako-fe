"use client"

import { Control, FieldErrors, UseFormRegister, Controller } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ComboboxSelect } from "@/components/common/ComboboxSelect"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { cn } from "@/utils/cn"
import type { PurchaseResponse } from "../types/purchase"
import type { PurchaseFormValues } from "./PurchaseFormDialog"

interface EditProductUnit {
  unit: {
    id: string
    name: string
  }
}

interface PurchaseEditFieldsProps {
  control: Control<PurchaseFormValues>
  register: UseFormRegister<PurchaseFormValues>
  errors: FieldErrors<PurchaseFormValues>
  purchase?: PurchaseResponse | null
  editProductUnits: EditProductUnit[]
  isPartiallySold: boolean
}

export function PurchaseEditFields({
  control,
  register,
  errors,
  purchase,
  editProductUnits,
  isPartiallySold,
}: PurchaseEditFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-foreground">Produk</Label>
          <Input
            disabled
            value={purchase?.product?.name || ""}
            className="bg-muted text-muted-foreground h-8 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-foreground">
            Satuan <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="unitId"
            render={({ field }) => (
              <ComboboxSelect
                items={editProductUnits}
                value={field.value}
                onChange={field.onChange}
                getOptionValue={(u) => u.unit.id}
                getOptionLabel={(u) => u.unit.name}
                placeholder="Pilih satuan..."
                searchPlaceholder="Cari satuan..."
                emptyText="Satuan tidak ditemukan."
              />
            )}
          />
          {errors.unitId?.message && (
            <p className="text-xs font-medium text-destructive">{errors.unitId.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="quantity" className="text-sm font-semibold text-foreground">
            Stok Awal <span className="text-destructive">*</span>
          </Label>
          <Input
            id="quantity"
            type="number"
            placeholder="10"
            disabled={isPartiallySold}
            className={cn("bg-background h-8", isPartiallySold && "cursor-not-allowed")}
            {...register("quantity")}
          />
          {errors.quantity?.message && (
            <p className="text-xs font-medium text-destructive">{errors.quantity.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="purchasePrice" className="text-sm font-semibold text-foreground">
            Harga Beli <span className="text-destructive">*</span>
          </Label>
          <InputGroup className="bg-background">
            <InputGroupAddon align="inline-start">Rp</InputGroupAddon>
            <InputGroupInput
              id="purchasePrice"
              type="number"
              placeholder="10000"
              disabled={isPartiallySold}
              className={cn(isPartiallySold && "cursor-not-allowed")}
              {...register("purchasePrice")}
            />
          </InputGroup>
          {errors.purchasePrice?.message && (
            <p className="text-xs font-medium text-destructive">{errors.purchasePrice.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
