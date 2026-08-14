"use client"

import { useEffect, useRef, useState } from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/utils/cn"

interface ComboboxSelectProps<T> {
  items: T[]
  value: string | null | undefined
  onChange: (value: string) => void
  getOptionValue: (item: T) => string
  getOptionLabel: (item: T) => string
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  isLoading?: boolean
  loadingText?: string
  disabled?: boolean
  className?: string
}

export function ComboboxSelect<T>({
  items,
  value,
  onChange,
  getOptionValue,
  getOptionLabel,
  placeholder = "Pilih...",
  searchPlaceholder = "Cari...",
  emptyText = "Tidak ada data.",
  isLoading = false,
  loadingText = "Memuat...",
  disabled = false,
  className,
}: ComboboxSelectProps<T>) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const selected = items.find((item) => getOptionValue(item) === value) ?? null

  const [inputValue, setInputValue] = useState(selected ? getOptionLabel(selected) : "")

  const [dialogContainer, setDialogContainer] = useState<HTMLElement | null>(null)
  useEffect(() => {
    if (wrapperRef.current) {
      const dialog = wrapperRef.current.closest<HTMLElement>('[role="dialog"]')
      setDialogContainer(dialog)
    }
  }, [])

  return (
    <div ref={wrapperRef}>
      <Combobox
        items={items}
        value={selected}
        onValueChange={(next) => onChange(next ? getOptionValue(next) : "")}
        onInputValueChange={(input) => setInputValue(input)}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setInputValue(selected ? getOptionLabel(selected) : "")
        }}
        itemToStringLabel={(item) => getOptionLabel(item)}
        itemToStringValue={(item) => getOptionValue(item)}
        isItemEqualToValue={(a, b) => getOptionValue(a) === getOptionValue(b)}
      >
        <ComboboxInput
          placeholder={open ? searchPlaceholder : placeholder}
          disabled={disabled}
          showClear={Boolean(selected) && !disabled}
          className={cn("w-full", className)}
        />
        <ComboboxContent container={dialogContainer}>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
              <Spinner className="size-4" />
              <span>{loadingText}</span>
            </div>
          ) : (
            <>
              <ComboboxEmpty>{emptyText}</ComboboxEmpty>
              <ComboboxList>
                {(item: T) => (
                  <ComboboxItem key={getOptionValue(item)} value={item} className="cursor-pointer">
                    {getOptionLabel(item)}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </>
          )}
        </ComboboxContent>
      </Combobox>
    </div>
  )
}