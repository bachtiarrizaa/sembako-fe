"use client"

import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { Controller } from "react-hook-form"
import { DatePicker } from "./DatePicker"
import { cn } from "@/utils/cn"

interface FormDatePickerProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  error?: string
  disabled?: boolean
  required?: boolean
  className?: string
  emptyValue?: "" | null
}

export function FormDatePicker<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  error,
  disabled,
  required,
  className,
  emptyValue = null,
}: FormDatePickerProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <DatePicker
          label={required ? `${label} *` : label}
          value={field.value || null}
          onChange={(date) => {
            field.onChange(date ? date.toISOString() : emptyValue)
          }}
          disabled={disabled}
          className={className}
        />
      )}
    />
  )
}
