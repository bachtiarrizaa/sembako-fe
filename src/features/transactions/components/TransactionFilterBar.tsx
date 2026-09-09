"use client"

import { Filter, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/common/DatePicker"
import { ComboboxSelect } from "@/components/common/ComboboxSelect"
import { Label } from "@/components/ui/label"
import {
  PAYMENT_METHOD_OPTIONS,
  TRANSACTION_STATUS_OPTIONS,
} from "../constants/transaction.constant"

export interface TransactionFilterValues {
  startDate?: string
  endDate?: string
  paymentMethod?: string
  status?: string
}

interface TransactionFilterBarProps {
  startDate: string
  endDate: string
  paymentMethod: string
  status: string
  hasActiveFilters: boolean
  onFilterChange: (key: keyof TransactionFilterValues, value: string | undefined) => void
  onResetFilters: () => void
}

export function TransactionFilterBar({
  startDate,
  endDate,
  paymentMethod,
  status,
  hasActiveFilters,
  onFilterChange,
  onResetFilters,
}: TransactionFilterBarProps) {
  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) {
      onFilterChange("startDate", undefined)
      return
    }
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    onFilterChange("startDate", d.toISOString())
  }

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) {
      onFilterChange("endDate", undefined)
      return
    }
    const d = new Date(date)
    d.setHours(23, 59, 59, 999)
    onFilterChange("endDate", d.toISOString())
  }

  return (
    <div className="rounded-xl border bg-card/60 p-3.5 shadow-2xs backdrop-blur-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
          <Filter className="size-3.5 text-primary" />
          <span>Filter Transaksi</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="size-3 mr-1.5" />
            Reset Filter
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Tanggal Mulai */}
        <DatePicker
          label="Tanggal Mulai"
          placeholder="Pilih tanggal mulai"
          value={startDate || null}
          onChange={handleStartDateChange}
        />

        {/* Tanggal Akhir */}
        <DatePicker
          label="Tanggal Akhir"
          placeholder="Pilih tanggal akhir"
          value={endDate || null}
          onChange={handleEndDateChange}
        />

        {/* Metode Pembayaran */}
        <div className="space-y-1">
          <Label className="text-[11px] font-medium text-muted-foreground">Metode Pembayaran</Label>
          <ComboboxSelect
            items={PAYMENT_METHOD_OPTIONS}
            value={paymentMethod || "all"}
            onChange={(val) =>
              onFilterChange("paymentMethod", !val || val === "all" ? undefined : val)
            }
            getOptionValue={(item) => item.value}
            getOptionLabel={(item) => item.label}
            placeholder="Semua Metode"
            searchPlaceholder="Cari metode..."
            className="h-8 text-xs cursor-pointer"
          />
        </div>

        {/* Status Transaksi */}
        <div className="space-y-1">
          <Label className="text-[11px] font-medium text-muted-foreground">Status Transaksi</Label>
          <ComboboxSelect
            items={TRANSACTION_STATUS_OPTIONS}
            value={status || "all"}
            onChange={(val) =>
              onFilterChange("status", !val || val === "all" ? undefined : val)
            }
            getOptionValue={(item) => item.value}
            getOptionLabel={(item) => item.label}
            placeholder="Semua Status"
            searchPlaceholder="Cari status..."
            className="h-8 text-xs cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
