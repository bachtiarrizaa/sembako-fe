"use client"

import { Control, FieldErrors, UseFormRegister, Controller } from "react-hook-form"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ComboboxSelect } from "@/components/common/ComboboxSelect"
import { Input } from "@/components/ui/input"
import { cn } from "@/utils/cn"
import type { PurchaseFormValues } from "./PurchaseFormDialog"

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
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-foreground">
          Tanggal Beli <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="purchaseDate"
          render={({ field }) => (
            <div className="relative flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background h-8 px-2.5 pr-8 py-1 text-xs md:text-xs",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {field.value ? (
                      format(new Date(field.value), "dd MMMM yyyy", { locale: id })
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(date ? date.toISOString() : "")
                    }}
                  />
                </PopoverContent>
              </Popover>
              {field.value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    field.onChange("")
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        />
        {errors.purchaseDate?.message && (
          <p className="text-xs font-medium text-destructive">{errors.purchaseDate.message}</p>
        )}
      </div>

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
