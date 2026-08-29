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
import { formatCurrency, resolveStaticUrl } from "@/utils/format"
import { useProductDetails } from "../hooks"
import Image from "next/image"

interface ProductDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string | null
}

export function ProductDetailDialog({ open, onOpenChange, productId }: ProductDetailDialogProps) {
  const { data: detailResponse, isLoading } = useProductDetails(productId)
  const product = detailResponse?.data
  const imageUrl = resolveStaticUrl(product?.image)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:rounded-xl transition-all max-h-[90vh] flex flex-col overflow-hidden sm:max-w-3xl">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4 shrink-0">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            Detail Produk
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Spinner className="size-8" />
              <span className="text-xs text-muted-foreground">Memuat detail produk...</span>
            </div>
          ) : !product ? (
            <div className="text-center py-10 text-sm text-muted-foreground italic">
              Produk tidak ditemukan atau gagal dimuat.
            </div>
          ) : (
            <>
              {/* Product Header Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Col: Image */}
                <div className="col-span-1 flex flex-col items-center justify-start">
                  <div className="w-full aspect-square border border-border rounded-xl overflow-hidden bg-muted flex items-center justify-center relative shadow-sm">
                    {imageUrl ? (
                      <div className="relative w-full h-full rounded-md overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground/60 gap-1.5">
                        <ImageIcon className="size-8" />
                        <span className="text-[10px] font-medium">Tanpa Gambar</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Col: Details */}
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-foreground leading-tight">
                      Nama Produk : {product.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Kategori Produk</span>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-transparent text-[10px] font-bold w-fit">
                        {product.category.name}
                      </Badge>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Status</span>
                      <Badge
                        className={
                          product.isActive
                            ? "bg-emerald-500/10 text-emerald-600 border-transparent hover:bg-emerald-500/10 text-[10px] font-bold w-fit"
                            : "bg-rose-500/10 text-rose-600 border-transparent hover:bg-rose-500/10 text-[10px] font-bold w-fit"
                        }
                      >
                        {product.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 border-t border-border pt-4 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground block">Stok Saat Ini</span>
                      <span className="font-semibold text-foreground">
                        {product.stock} {product.baseUnit.name}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground block">Stok Minimal</span>
                      <span className="font-semibold text-foreground">
                        {product.minimumStock} {product.baseUnit.name}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground block">Margin Threshold</span>
                      <span className="font-semibold text-foreground">
                        {product.marginThresholdPercent}%
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground block">Base Unit</span>
                      <span className="font-semibold text-foreground">
                        {product.baseUnit.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Packaging Units List */}
              <div className="space-y-2 border-t border-border pt-6">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-foreground">Daftar Satuan</span>
                  <span className="text-[10px] text-muted-foreground">(Multi-Unit)</span>
                </div>

                <div className="border border-border rounded-xl overflow-hidden bg-card">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 border-b border-border">
                      <tr className="text-xs font-bold text-muted-foreground text-left">
                        <th className="px-4 py-2.5 font-bold">Satuan</th>
                        <th className="px-4 py-2.5 font-bold text-center">Faktor Konversi</th>
                        <th className="px-4 py-2.5 font-bold text-right">Harga Jual</th>
                        <th className="px-4 py-2.5 font-bold text-center">Nilai Diskon</th>
                        <th className="px-4 py-2.5 font-bold text-right">Harga Diskon</th>
                        <th className="px-4 py-2.5 font-bold text-center">Base Unit?</th>
                        <th className="px-4 py-2.5 font-bold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {product.units?.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-xs text-muted-foreground italic">
                            Belum ada satuan.
                          </td>
                        </tr>
                      ) : (
                        product.units.map((unit) => (
                          <tr key={unit.id} className="hover:bg-muted/10">
                            <td className="px-4 py-2.5 font-semibold text-foreground">{unit.unit.name}</td>
                            <td className="px-4 py-2.5 text-center text-xs text-slate-600 font-medium">
                              1 {unit.unit.name} = {unit.conversionToBase} {product.baseUnit.name}
                            </td>
                            <td className="px-4 py-2.5 text-right font-medium text-foreground">
                              {unit.sellingPrice ? (
                                formatCurrency(unit.sellingPrice)
                              ) : "-"}
                            </td>
                            <td className="px-4 py-2.5 text-center font-medium text-destructive">
                              {unit.discountAmount ? (
                                formatCurrency(unit.discountAmount)
                              ) : "-"}
                            </td>
                            <td className="px-4 py-2.5 text-right font-medium text-gray-600">
                              {unit.discountedPrice ? (
                                formatCurrency(unit.discountedPrice)
                              ) : "-"}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              {unit.isBaseUnit ? (
                                <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-transparent text-[10px] font-bold">
                                  Base Unit
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs">-</span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <Badge className={unit.isActive ? "bg-emerald-500/10 text-emerald-600 border-transparent hover:bg-emerald-500/10 text-[10px] font-bold" : "bg-rose-500/10 text-rose-600 border-transparent hover:bg-rose-500/10 text-[10px] font-bold"}>
                                {unit.isActive ? "Aktif" : "Nonaktif"}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
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

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}
