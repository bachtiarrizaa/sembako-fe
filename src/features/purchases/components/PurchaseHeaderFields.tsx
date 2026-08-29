"use client"

import { Control, FieldErrors, UseFormRegister, Controller } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { ComboboxSelect } from "@/components/common/ComboboxSelect"
import { Input } from "@/components/ui/input"
import type { PurchaseFormValues } from "./PurchaseFormDialog"
import { FormDatePicker } from "@/components/common/FormDatePicker"

interface Supplier {
  id: string
  name: string
}

interface PurchaseHeaderFieldsProps {
  control: Control<PurchaseFormValues>
  register: UseFormRegister<PurchaseFormValues>
  errors: FieldErrors<PurchaseFormValues>
  suppliers: Supplier[]
  isSuppliersLoading: boolean
}

export function PurchaseHeaderFields({
  control,
  register,
  errors,
  suppliers,
  isSuppliersLoading,
}: PurchaseHeaderFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Supplier Selection */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-foreground">
          Supplier <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="supplierId"
          render={({ field }) => (
            <ComboboxSelect
              items={suppliers}
              value={field.value}
              onChange={field.onChange}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.name}
              placeholder="Pilih supplier..."
              searchPlaceholder="Cari supplier..."
              emptyText="Supplier tidak ditemukan."
              isLoading={isSuppliersLoading}
              loadingText="Memuat supplier..."
            />
          )}
        />
        {errors.supplierId?.message && (
          <p className="text-xs font-medium text-destructive">{errors.supplierId.message}</p>
        )}
      </div>

      {/* Purchase Date Picker */}
      <FormDatePicker
        control={control}
        name="purchaseDate"
        label="Tanggal Beli"
        required
        error={errors.purchaseDate?.message}
        emptyValue=""
        className="space-y-1.5"
      />

      {/* Invoice Number Input */}
      <div className="space-y-1.5">
        <Label htmlFor="invoiceNumber" className="text-sm font-semibold text-foreground">
          No. Invoice
        </Label>
        <Input
          id="invoiceNumber"
          placeholder="INV/2026/08/001"
          className="bg-background h-8"
          {...register("invoiceNumber")}
        />
        {errors.invoiceNumber?.message && (
          <p className="text-xs font-medium text-destructive">{errors.invoiceNumber.message}</p>
        )}
      </div>
    </div>
  )
}
