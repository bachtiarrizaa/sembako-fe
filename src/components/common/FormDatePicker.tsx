"use client"

import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { Controller } from "react-hook-form"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Controller
        control={control}
        name={name}
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
                  disabled={disabled}
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
                    field.onChange(date ? date.toISOString() : emptyValue)
                  }}
                />
              </PopoverContent>
            </Popover>
            {field.value && !disabled && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  field.onChange(emptyValue)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      />
      {error && (
        <p className="text-xs font-medium text-destructive">{error}</p>
      )}
    </div>
  )
}
