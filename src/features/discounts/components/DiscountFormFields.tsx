"use client"

import type { Control, UseFormRegister, FieldErrors } from "react-hook-form"
import { Controller } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { ComboboxSelect } from "@/components/common/ComboboxSelect"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { DISCOUNT_TYPES, DISCOUNT_TYPE_OPTIONS, type DiscountType } from "../constants/discount.constant"
import { FormDatePicker } from "@/components/common/FormDatePicker"
import type { CreateDiscountRequest } from "../schemas/discount.schema"

interface DiscountFormFieldsProps {
  control: Control<CreateDiscountRequest>
  register: UseFormRegister<CreateDiscountRequest>
  errors: FieldErrors<CreateDiscountRequest>
  discountType: DiscountType
  isPending: boolean
}


export function DiscountFormFields({
  control,
  register,
  errors,
  discountType,
  isPending,
}: DiscountFormFieldsProps) {
  return (
    <>
      {/* Top row fields: Nama, Tipe, Nilai */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Nama Diskon */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name" className="text-sm font-semibold text-foreground">
            Nama Diskon <span className="text-destructive">*</span>
          </Label>
          <InputGroup className="bg-background">
            <InputGroupInput
              id="name"
              placeholder="Diskon Awal Tahun"
              {...register("name")}
              disabled={isPending}
            />
          </InputGroup>
          {errors.name && (
            <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Tipe Diskon */}
        <div className="space-y-2 col-span-1">
          <Label className="text-sm font-semibold text-foreground">
            Tipe Diskon <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <ComboboxSelect
                items={DISCOUNT_TYPE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                getOptionValue={(opt) => opt.value}
                getOptionLabel={(opt) => opt.label}
                placeholder="Pilih tipe..."
                searchPlaceholder="Cari tipe..."
                emptyText="Tipe diskon tidak ditemukan."
                disabled={isPending}
              />
            )}
          />
          {errors.type && (
            <p className="text-xs font-medium text-destructive">{errors.type.message}</p>
          )}
        </div>

        {/* Nilai Diskon */}
        <div className="space-y-2 col-span-1">
          <Label htmlFor="value" className="text-sm font-semibold text-foreground">
            Nilai Diskon <span className="text-destructive">*</span>
          </Label>
          <InputGroup className="bg-background">
            {discountType === DISCOUNT_TYPES.NOMINAL && (
              <InputGroupAddon align="inline-start">Rp</InputGroupAddon>
            )}
            <InputGroupInput
              id="value"
              type="number"
              placeholder={discountType === DISCOUNT_TYPES.PERCENT ? "25" : "10000"}
              max={discountType === DISCOUNT_TYPES.PERCENT ? 100 : undefined}
              {...register("value")}
              disabled={isPending}
            />
            {discountType === DISCOUNT_TYPES.PERCENT && (
              <InputGroupAddon align="inline-end">%</InputGroupAddon>
            )}
          </InputGroup>
          {errors.value && (
            <p className="text-xs font-medium text-destructive">{errors.value.message}</p>
          )}
        </div>
      </div>

      {/* Row 2: Tanggal Mulai & Tanggal Berakhir */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormDatePicker
          control={control}
          name="startDate"
          label="Tanggal Mulai"
          error={errors.startDate?.message}
          disabled={isPending}
        />
        <FormDatePicker
          control={control}
          name="endDate"
          label="Tanggal Berakhir"
          error={errors.endDate?.message}
          disabled={isPending}
        />
      </div>
    </>
  )
}
