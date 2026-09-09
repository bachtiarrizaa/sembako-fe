"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/utils/cn"

interface DatePickerProps {
  value?: Date | string | null
  onChange: (date: Date | undefined) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Pilih tanggal",
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const dateValue = value ? (typeof value === "string" ? new Date(value) : value) : undefined
  const isValidDate = dateValue && !isNaN(dateValue.getTime())

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label className="text-[11px] font-medium text-muted-foreground">
          {label}
        </Label>
      )}
      <div className="relative flex items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-background h-8 px-2.5 pr-8 py-1 text-xs cursor-pointer",
                !isValidDate && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground shrink-0" />
              {isValidDate ? (
                format(dateValue, "dd MMMM yyyy", { locale: id })
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={isValidDate ? dateValue : undefined}
              onSelect={(date) => {
                onChange(date)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
        {isValidDate && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              onChange(undefined)
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}
