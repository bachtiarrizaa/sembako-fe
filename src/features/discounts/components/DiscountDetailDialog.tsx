"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { formatCurrency, formatShortDate } from "@/utils/format"
import { DISCOUNT_TYPES } from "../constants/discount.constant"
import { useDiscountDetails } from "../hooks"

interface DiscountDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  discountId?: string | null
}

export function DiscountDetailDialog({
  open,
  onOpenChange,
  discountId,
}: DiscountDetailDialogProps) {
  const { data: detailResponse, isLoading } = useDiscountDetails(discountId)
  const discount = detailResponse?.data

  const isPercent = discount?.type === DISCOUNT_TYPES.PERCENT
  const formattedValue = discount
    ? isPercent
      ? `${Number(discount.value)}%`
      : formatCurrency(discount.value)
    : ""

  const startDateText = discount?.startDate
    ? formatShortDate(discount.startDate)
    : ""
  const endDateText = discount?.endDate
    ? formatShortDate(discount.endDate)
    : ""
  const periodText = startDateText && endDateText
    ? `${startDateText} - ${endDateText}`
    : startDateText
    ? `${startDateText} - Tanpa Batas`
    : endDateText
    ? `- ${endDateText}`
    : "-"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:rounded-xl transition-all max-h-[90vh] flex flex-col overflow-hidden sm:max-w-2xl">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4 shrink-0">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            Detail Diskon & Simulasi Harga
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Spinner className="size-8 text-primary" />
              <span className="text-xs text-muted-foreground">
                Memuat detail diskon...
              </span>
            </div>
          ) : !discount ? (
            <div className="text-center py-10 text-sm text-muted-foreground italic">
              Diskon tidak ditemukan atau gagal dimuat.
            </div>
          ) : (
            <>
              {/* Metadata Info Summary Box */}
              <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-2 text-xs">
                {/* Row 1: Nama Diskon & Badge Status */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-muted-foreground w-24 shrink-0 font-medium">Nama Diskon</span>
                    <span className="text-muted-foreground font-medium">:</span>
                    <span className="font-bold text-foreground text-sm truncate">
                      {discount.name}
                    </span>
                  </div>
                  {discount.isActive ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 shrink-0">
                      Aktif
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 shrink-0">
                      Nonaktif
                    </Badge>
                  )}
                </div>

                {/* Row 2: Tipe Diskon */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-24 shrink-0 font-medium">Tipe Diskon</span>
                  <span className="text-muted-foreground font-medium">:</span>
                  <span className="font-semibold text-foreground">
                    {isPercent
                      ? `Persentase (${formattedValue})`
                      : `Nominal (${formattedValue})`}
                  </span>
                </div>

                {/* Row 3: Periode */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-24 shrink-0 font-medium">Periode</span>
                  <span className="text-muted-foreground font-medium">:</span>
                  <span className="font-semibold text-foreground">
                    {periodText}
                  </span>
                </div>
              </div>

              {/* Products & Price Simulation Section */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground">
                    Daftar Produk ({discount.products?.length ?? 0} Produk)
                  </h4>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
                  {!discount.products || discount.products.length === 0 ? (
                    <div className="text-center py-10 text-xs text-muted-foreground italic bg-muted/10 border border-dashed border-border rounded-xl">
                      Belum ada produk terkait diskon ini.
                    </div>
                  ) : (
                    discount.products.map((dp) => {
                      const productName = dp.name || "Produk"
                      const productActive = dp.isActive !== false
                      const units = dp.units || []

                      return (
                        <div
                          key={dp.id}
                          className="bg-white border border-border rounded-xl p-4 space-y-3 shadow-2xs"
                        >
                          {/* Product Card Header */}
                          <div className="flex items-center justify-between border-b border-border pb-2.5">
                            <span className="font-bold text-xs text-foreground">
                              {productName}
                            </span>
                            {productActive ? (
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                                Produk Aktif
                              </Badge>
                            ) : (
                              <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]">
                                Produk Nonaktif
                              </Badge>
                            )}
                          </div>

                          {/* Units List */}
                          {units.length === 0 ? (
                            <div className="text-xs text-muted-foreground italic py-2 text-center">
                              Belum ada satuan / data harga untuk produk ini.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {units.map((unit, uIdx) => {
                                const isUnitActive =
                                  unit.isActive !== false &&
                                  productActive &&
                                  discount.isActive
                                const unitName = unit.unit?.name || "Satuan"

                                return (
                                  <div
                                    key={`${dp.id}-${unit.id || uIdx}`}
                                    className="bg-muted/20 border border-border/80 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                                  >
                                    {/* Unit Name Badge */}
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-xs">
                                        Satuan: {unitName}
                                      </span>
                                    </div>

                                    {/* Price Simulation Details */}
                                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 text-right">
                                      <div>
                                        <span className="text-[11px] text-muted-foreground block font-medium">
                                          Harga Normal
                                        </span>
                                        <span className="text-slate-600 line-through font-medium">
                                          {formatCurrency(unit.sellingPrice)}
                                        </span>
                                      </div>

                                      <div>
                                        <span className="text-[11px] text-rose-600 block font-medium">
                                          Potongan
                                        </span>
                                        <span className="text-rose-600 font-semibold">
                                          -{formatCurrency(unit.discountAmount || 0)}
                                        </span>
                                      </div>

                                      <div>
                                        <span className="text-[11px] text-emerald-700 block font-medium">
                                          Harga Diskon
                                        </span>
                                        <span className="text-emerald-700 font-bold text-sm">
                                          {isUnitActive
                                            ? formatCurrency(unit.discountedPrice)
                                            : formatCurrency(unit.sellingPrice)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="border-t border-border px-6 py-4 shrink-0">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer font-medium px-4 py-2"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
