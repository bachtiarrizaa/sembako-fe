"use client"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"
import { formatCurrency } from "@/utils/format"
import { DISCOUNT_TYPES } from "../constants/discount.constant"
import { useDiscountDetails } from "../hooks"

interface DiscountDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  discountId?: string | null
}

const formatPeriodDate = (dateStr?: string | null) => {
  if (!dateStr) return ""
  try {
    return format(new Date(dateStr), "d MMMM yyyy", { locale: id })
  } catch {
    return ""
  }
}

export function DiscountDetailDialog({ open, onOpenChange, discountId }: DiscountDetailDialogProps) {
  const { data: detailResponse, isLoading } = useDiscountDetails(discountId)
  const discount = detailResponse?.data

  const isPercent = discount?.type === DISCOUNT_TYPES.PERCENT
  const formattedValue = discount
    ? isPercent
      ? `${Number(discount.value)}%`
      : formatCurrency(discount.value)
    : ""

  const startDateText = discount?.startDate ? formatPeriodDate(discount.startDate) : ""
  const endDateText = discount?.endDate ? formatPeriodDate(discount.endDate) : ""
  const periodText = (startDateText || endDateText)
    ? `${startDateText || "-"} - ${endDateText || "-"}`
    : "-"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:rounded-xl transition-all max-h-[90vh] flex flex-col overflow-hidden sm:max-w-3xl">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4 shrink-0">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            Detail Diskon
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Spinner className="size-8" />
              <span className="text-xs text-muted-foreground">Memuat detail diskon...</span>
            </div>
          ) : !discount ? (
            <div className="text-center py-10 text-sm text-muted-foreground italic">
              Diskon tidak ditemukan atau gagal dimuat.
            </div>
          ) : (
            <>
              {/* Metadata Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-2 text-sm pb-2">
                <div className="md:col-span-7 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-28 shrink-0 font-medium">Nama Diskon</span>
                    <span className="text-muted-foreground font-medium">:</span>
                    <span className="font-bold text-foreground truncate">{discount.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-28 shrink-0 font-medium">Periode Diskon</span>
                    <span className="text-muted-foreground font-medium">:</span>
                    <span className="font-semibold text-foreground">
                      {periodText}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-28 shrink-0 font-medium">Tipe Diskon</span>
                    <span className="text-muted-foreground font-medium">:</span>
                    <span className="font-semibold text-foreground">
                      {isPercent ? `Persentase (${formattedValue})` : `Nominal (${formattedValue})`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-28 shrink-0 font-medium">Status Diskon</span>
                    <span className="text-muted-foreground font-medium">:</span>
                    <span>
                      {discount.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Nonaktif
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Separator line */}
              <hr className="border-border" />

              {/* Products & Price Simulation Section */}
              <div className="space-y-3 pt-2">
                <div className="text-sm font-bold text-foreground">
                  Daftar Produk & Simulasi Harga:
                </div>

                <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm max-h-[380px] overflow-y-auto">
                  <Table className="w-full text-sm border-collapse table-fixed">
                    <TableHeader className="bg-muted/40 border-b border-border sticky top-0 z-10">
                      <TableRow className="bg-muted/40 border-b border-border hover:bg-muted/40 border-0">
                        <TableHead className="w-[28%] font-bold text-muted-foreground pl-6 pr-4 py-2.5">
                          Nama Produk
                        </TableHead>
                        <TableHead className="w-[12%] font-bold text-muted-foreground text-center px-4 py-2.5">
                          Status
                        </TableHead>
                        <TableHead className="w-[16%] font-bold text-muted-foreground text-center px-4 py-2.5">
                          Satuan
                        </TableHead>
                        <TableHead className="w-[14%] font-bold text-muted-foreground text-right px-4 py-2.5">
                          Harga Normal
                        </TableHead>
                        <TableHead className="w-[12%] font-bold text-muted-foreground text-right px-4 py-2.5">
                          Potongan
                        </TableHead>
                        <TableHead className="w-[18%] font-bold text-muted-foreground text-right pl-4 pr-6 py-2.5">
                          Harga Diskon
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border">
                      {!discount.products || discount.products.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="px-4 py-8 text-center text-xs text-muted-foreground italic bg-white">
                            Tidak ada produk terkait diskon ini.
                          </TableCell>
                        </TableRow>
                      ) : (
                        discount.products.map((dp, pIdx) => {
                          const productName = dp.name || ""
                          const productActive = dp.isActive !== false // defaults to true

                          const units = dp.units || []
                          const totalUnits = units.length

                          if (totalUnits === 0) {
                            return (
                              <TableRow key={dp.id} className="hover:bg-muted/10 bg-white">
                                <TableCell className="font-semibold text-foreground pl-6 pr-4 py-2.5">
                                  <div className="break-words whitespace-normal">{productName}</div>
                                </TableCell>
                                <TableCell className="text-center px-4 py-2.5">
                                  {productActive ? (
                                    <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                      Aktif
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                      Nonaktif
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell colSpan={4} className="text-center text-xs text-muted-foreground italic px-4 py-2.5 bg-muted/5">
                                  Belum ada satuan / data harga.
                                </TableCell>
                              </TableRow>
                            )
                          }

                          return units.map((unit, uIdx) => {
                            const isUnitActive = unit.isActive !== false && productActive && discount.isActive
                            const unitName = unit.unit?.name || "N/A"

                            return (
                              <TableRow key={`${dp.id}-${unit.id || uIdx}`} className="hover:bg-muted/10 bg-white">
                                {/* Only render product info columns on the first unit row using rowSpan */}
                                {uIdx === 0 && (
                                  <>
                                    <TableCell rowSpan={totalUnits} className="font-semibold text-foreground pl-6 pr-4 py-2.5 align-top">
                                      <div className="break-words whitespace-normal">{productName}</div>
                                    </TableCell>
                                    <TableCell rowSpan={totalUnits} className="text-center px-4 py-2.5 align-top">
                                      {productActive ? (
                                        <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                          Aktif
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                          Nonaktif
                                        </span>
                                      )}
                                    </TableCell>
                                  </>
                                )}

                                {/* Unit packaging details */}
                                <TableCell className="px-4 py-2.5 text-center text-xs text-slate-600 font-medium">
                                  {unitName}
                                </TableCell>
                                <TableCell className="px-4 py-2.5 text-right font-medium text-foreground">
                                  {isUnitActive ? (
                                    formatCurrency(unit.sellingPrice)
                                  ) : (
                                    <span className="text-muted-foreground italic text-xs">*(Nonaktif)*</span>
                                  )}
                                </TableCell>
                                <TableCell className="px-4 py-2.5 text-right text-rose-600 font-semibold">
                                  {isUnitActive ? (
                                    `- ${formatCurrency(unit.discountAmount || 0)}`
                                  ) : (
                                    <span className="text-muted-foreground italic text-xs">*(Nonaktif)*</span>
                                  )}
                                </TableCell>
                                <TableCell className="pl-4 pr-6 py-2.5 text-right font-bold text-foreground">
                                  {isUnitActive ? (
                                    formatCurrency(unit.discountedPrice)
                                  ) : (
                                    <span className="text-muted-foreground font-bold">
                                      {formatCurrency(unit.sellingPrice)}
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="border-t border-border px-6 py-4 shrink-0">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer font-medium px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
